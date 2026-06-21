import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Create a generic transporter
// For Gmail: use service: 'gmail', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
// The SMTP_PASS should be an "App Password", not the actual account password.
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your custom SMTP like Hostinger/Niagahoster
  auth: {
    user: process.env.SMTP_USER || 'fermiom.test@gmail.com', 
    pass: process.env.SMTP_PASS || 'placeholder_app_password_here',
  },
});

export const sendWelcomeB2BEmail = async (partnerEmail, partnerName) => {
  const mailOptions = {
    from: `"Fermion Roastery" <${process.env.SMTP_USER || 'hello@fermion.com'}>`,
    to: partnerEmail,
    subject: 'Selamat Datang di Jaringan B2B Fermion Roastery! ☕',
    html: `
      <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
        <h1 style="color: #367F4D; font-style: italic;">Welcome, ${partnerName}!</h1>
        <p>Aplikasi kemitraan B2B Anda telah kami terima dan <strong>disetujui</strong>.</p>
        <p>Sekarang Anda dapat masuk ke Dashboard Mitra menggunakan akun yang telah Anda daftarkan. Di sana Anda bisa langsung memesan biji kopi dengan harga grosir (tiering), melacak riwayat pengiriman, dan mengunduh invoice secara otomatis.</p>
        <br/>
        <a href="https://fermion-roastery.vercel.app/auth" style="display: inline-block; background-color: #1c1917; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Masuk ke Dashboard</a>
        <br/><br/>
        <p>Mari tingkatkan standar kopi Anda bersama kami.</p>
        <p style="font-weight: bold;">Salam hangat,<br/>Tim Fermion Roastery</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('B2B Welcome email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending B2B Welcome email:', error);
    return false;
  }
};

export const sendOrderShippedEmail = async (customerEmail, customerName, orderId, courier, resi) => {
  const isInternal = resi === 'INTERNAL';
  const mailOptions = {
    from: `"Fermion Roastery" <${process.env.SMTP_USER || 'hello@fermion.com'}>`,
    to: customerEmail,
    subject: `Pesanan #${orderId.split('-')[0].toUpperCase()} Sedang Dikirim! 🚀`,
    html: `
      <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
        <h2 style="color: #367F4D; font-style: italic;">Pesanan Anda dalam perjalanan!</h2>
        <p>Halo ${customerName},</p>
        <p>Kabar baik! Kopi pesanan Anda (Order ID: <strong>${orderId.split('-')[0].toUpperCase()}</strong>) baru saja diserahkan ke bagian logistik.</p>
        
        <div style="background-color: #f5f5f4; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #78716c;">Ekspedisi</p>
          <h3 style="margin: 5px 0 15px 0;">${courier}</h3>
          
          ${!isInternal ? `
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #78716c;">Nomor Resi (AWB)</p>
            <h3 style="margin: 5px 0 0 0; font-family: monospace; font-size: 18px;">${resi}</h3>
          ` : `
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #78716c;">Status</p>
            <h3 style="margin: 5px 0 0 0;">Dikirim Langsung oleh Kurir Internal/Mandiri</h3>
          `}
        </div>

        <a href="https://fermion-roastery.vercel.app/b2b/shipping" style="display: inline-block; background-color: #1c1917; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Lacak Pesanan</a>
        <br/><br/>
        <p>Terima kasih telah memilih Fermion Roastery.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order Shipped email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending Order Shipped email:', error);
    return false;
  }
};
