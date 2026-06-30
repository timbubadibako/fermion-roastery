import nodemailer from 'nodemailer';
import { getMailConfig } from './runtimeConfig.js';
import { logError, logInfo } from './logger.js';

const mailConfig = getMailConfig();

const createSmtpTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || undefined,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    service: !process.env.SMTP_HOST ? 'gmail' : undefined,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const smtpTransporter = createSmtpTransporter();

const sendViaResend = async ({ to, subject, html, attachments = [] }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${mailConfig.fromName} <${mailConfig.fromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content.toString('base64'),
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend failed: ${errorText}`);
  }
};

const sendViaSmtp = async ({ to, subject, html, attachments = [] }) => {
  if (!smtpTransporter) {
    throw new Error('SMTP transporter is not configured');
  }

  await smtpTransporter.sendMail({
    from: `"${mailConfig.fromName}" <${mailConfig.fromEmail}>`,
    to,
    subject,
    html,
    attachments,
  });
};

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    if (mailConfig.provider === 'resend') {
      await sendViaResend({ to, subject, html, attachments });
    } else {
      await sendViaSmtp({ to, subject, html, attachments });
    }

    logInfo('mailer.sent', { to, subject, provider: mailConfig.provider });
    return true;
  } catch (error) {
    logError('mailer.failed', error, { to, subject, provider: mailConfig.provider });
    return false;
  }
};

const renderShell = ({ title, body, ctaLabel, ctaHref, secondaryLabel, secondaryHref }) => `
  <div style="font-family: Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1c1917; line-height: 1.6;">
    <h1 style="color: #0f172a; font-style: italic; margin-bottom: 12px;">${title}</h1>
    <div style="font-size: 14px; color: #44403c;">${body}</div>
    ${ctaHref ? `<div style="margin-top: 28px;"><a href="${ctaHref}" style="display: inline-block; background-color: #1c1917; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">${ctaLabel}</a></div>` : ''}
    ${secondaryHref ? `<div style="margin-top: 14px;"><a href="${secondaryHref}" style="display: inline-block; color: #367F4D; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1.5px;">${secondaryLabel}</a></div>` : ''}
    <p style="margin-top: 32px; color: #78716c;">Salam,<br/>Fermion Roastery</p>
  </div>
`;

export const sendWelcomeB2BEmail = async (partnerEmail, partnerName, dashboardUrl) =>
  sendEmail({
    to: partnerEmail,
    subject: 'Akses B2B Fermion Roastery Anda Sudah Aktif',
    html: renderShell({
      title: `Welcome, ${partnerName}!`,
      body: `<p>Aplikasi kemitraan B2B Anda sudah disetujui. Anda sekarang bisa mengakses harga partner, ledger invoice, dan panel pengiriman.</p>`,
      ctaLabel: 'Buka Dashboard',
      ctaHref: dashboardUrl,
    }),
  });

export const sendOrderCreatedEmail = async ({ order, portalUrl, invoiceUrl, paymentUrl, invoiceAttachment }) =>
  sendEmail({
    to: order.customer_email,
    subject: `Pesanan Fermion #${String(order.id).slice(0, 8).toUpperCase()} Dibuat`,
    html: renderShell({
      title: 'Pesanan Anda sudah tercatat.',
      body: `
        <p>Halo ${order.customer_name}, pesanan Anda sudah masuk ke sistem kami.</p>
        <p>Nomor pesanan: <strong>${order.id}</strong></p>
        ${paymentUrl ? '<p>Silakan lanjutkan pembayaran melalui link yang kami sediakan.</p>' : '<p>Invoice pesanan Anda kami lampirkan pada email ini.</p>'}
      `,
      ctaLabel: order.profile_id ? 'Buka Detail Pesanan' : 'Lacak Pesanan',
      ctaHref: portalUrl,
      secondaryLabel: paymentUrl ? 'Bayar Sekarang' : 'Unduh Invoice',
      secondaryHref: paymentUrl || invoiceUrl,
    }),
    attachments: invoiceAttachment ? [invoiceAttachment] : [],
  });

export const sendPaymentPaidEmail = async ({ order, portalUrl, invoiceUrl, invoiceAttachment }) =>
  sendEmail({
    to: order.customer_email,
    subject: `Pembayaran Diterima untuk Pesanan #${String(order.id).slice(0, 8).toUpperCase()}`,
    html: renderShell({
      title: 'Pembayaran Anda sudah kami terima.',
      body: `<p>Pesanan Anda sedang kami proses untuk roasting dan pengiriman.</p>`,
      ctaLabel: order.profile_id ? 'Lihat Pesanan' : 'Lacak Pesanan',
      ctaHref: portalUrl,
      secondaryLabel: 'Unduh Invoice',
      secondaryHref: invoiceUrl,
    }),
    attachments: invoiceAttachment ? [invoiceAttachment] : [],
  });

export const sendOrderShippedEmail = async ({ order, portalUrl, invoiceUrl }) =>
  sendEmail({
    to: order.customer_email,
    subject: `Pesanan #${String(order.id).slice(0, 8).toUpperCase()} Sedang Dikirim`,
    html: renderShell({
      title: 'Pesanan Anda sedang dalam perjalanan.',
      body: `
        <p>Kurir: <strong>${order.shipping_courier || '-'}</strong></p>
        <p>Nomor resi: <strong>${order.shipping_awb || 'Internal Delivery'}</strong></p>
      `,
      ctaLabel: order.profile_id ? 'Buka Status Pengiriman' : 'Lacak Pengiriman',
      ctaHref: portalUrl,
      secondaryLabel: 'Unduh Invoice',
      secondaryHref: invoiceUrl,
    }),
  });

export const sendOrderDeliveredEmail = async ({ order, portalUrl, invoiceUrl }) =>
  sendEmail({
    to: order.customer_email,
    subject: `Pesanan #${String(order.id).slice(0, 8).toUpperCase()} Sudah Terkirim`,
    html: renderShell({
      title: 'Pesanan Anda sudah sampai.',
      body: `<p>Terima kasih. Semoga batch ini sampai dengan aman dan siap diseduh.</p>`,
      ctaLabel: order.profile_id ? 'Buka Riwayat Pesanan' : 'Unduh Invoice',
      ctaHref: order.profile_id ? portalUrl : invoiceUrl,
      secondaryLabel: order.profile_id ? 'Unduh Invoice' : '',
      secondaryHref: order.profile_id ? invoiceUrl : '',
    }),
  });
