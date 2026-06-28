import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { supabase } from './supabase.js';

const INVOICE_BUCKET = 'order_invoices';

const getInvoiceStoragePath = (order) => `orders/${order.id}.pdf`;

const resolvePaymentMethod = (order) => {
  if (order.payment_method) return order.payment_method;
  if (order.status === 'NET30') return 'TEMPO';
  if (order.status === 'PENDING_CASH') return 'OFFLINE_CASH';
  return 'ONLINE';
};

const createInvoiceBuffer = async (order) => {
  const doc = new PDFDocument({ margin: 48, size: 'A4' });
  const chunks = [];
  const fileName = `INV-${order.id.split('-')[0].toUpperCase()}.pdf`;
  const logoPath = path.join(process.cwd(), '../frontend/public/fermion-logo.png');
  const paymentMethod = resolvePaymentMethod(order);
  const createdAt = new Date(order.created_at || order.updated_at || Date.now());
  const dueDate = new Date(createdAt);
  dueDate.setDate(dueDate.getDate() + 30);

  doc.on('data', (chunk) => chunks.push(chunk));

  const finished = new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 48, 42, { width: 58 });
  }

  doc.fillColor('#64748B').font('Helvetica-Bold').fontSize(10).text('FERMION ROASTERY', 120, 50);
  doc.font('Helvetica').fontSize(9).text('Jl. Kesambi No. 202, Cirebon, Jawa Barat 45133', 120, 66);
  doc.text('hello@fermionroastery.com', 120, 79);

  doc.fillColor('#CBD5E1').font('Helvetica-BoldOblique').fontSize(38).text('Invoice.', 360, 46, { align: 'right' });
  doc.fillColor('#0F172A').font('Courier-Bold').fontSize(12).text(order.id.slice(0, 8).toUpperCase(), 360, 92, { align: 'right' });

  const badgeWidth = 120;
  doc.roundedRect(430, 112, badgeWidth, 22, 11)
    .fillAndStroke(['PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? '#DCFCE7' : '#FEF3C7', ['PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? '#DCFCE7' : '#FEF3C7');
  doc.fillColor(['PAID', 'READY_TO_SHIP', 'ROASTING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? '#15803D' : '#B45309')
    .font('Helvetica-Bold')
    .fontSize(9)
    .text(order.status, 430, 119, { width: badgeWidth, align: 'center' });

  doc.moveTo(48, 145).lineTo(547, 145).strokeColor('#E2E8F0').stroke();

  doc.fillColor('#94A3B8').font('Helvetica-Bold').fontSize(9).text('DITAGIHKAN KEPADA', 48, 170);
  doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(14).text(order.customer_name || '-', 48, 188);
  doc.fillColor('#64748B').font('Helvetica').fontSize(10)
    .text(order.shipping_address || '-', 48, 208, { width: 220 })
    .text(order.shipping_city || '-', 48, doc.y + 4)
    .text(order.customer_email || '-', 48, doc.y + 4)
    .text(order.customer_phone || '-', 48, doc.y + 4);

  doc.fillColor('#94A3B8').font('Helvetica-Bold').fontSize(9).text('TANGGAL INVOICE', 350, 170, { align: 'right', width: 200 });
  doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(10).text(createdAt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 350, 188, { align: 'right', width: 200 });

  if (paymentMethod === 'TEMPO') {
    doc.fillColor('#DC2626').font('Helvetica-Bold').fontSize(9).text('JATUH TEMPO (NET-30)', 350, 220, { align: 'right', width: 200 });
    doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(10).text(dueDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 350, 238, { align: 'right', width: 200 });
  } else if (paymentMethod === 'OFFLINE_CASH') {
    doc.fillColor('#059669').font('Helvetica-Bold').fontSize(9).text('METODE PEMBAYARAN', 350, 220, { align: 'right', width: 200 });
    doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(10).text('Tunai (Offline)', 350, 238, { align: 'right', width: 200 });
  } else {
    doc.fillColor('#94A3B8').font('Helvetica-Bold').fontSize(9).text('METODE PEMBAYARAN', 350, 220, { align: 'right', width: 200 });
    doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(10).text('Transfer / E-Wallet', 350, 238, { align: 'right', width: 200 });
  }

  doc.moveTo(48, 280).lineTo(547, 280).strokeColor('#E2E8F0').stroke();

  const tableTop = 302;
  doc.fillColor('#94A3B8').font('Helvetica-Bold').fontSize(9);
  doc.text('DESKRIPSI BARANG', 48, tableTop, { width: 240 });
  doc.text('KUANTITAS', 318, tableTop, { width: 70, align: 'right' });
  doc.text('HARGA SATUAN', 388, tableTop, { width: 80, align: 'right' });
  doc.text('TOTAL', 468, tableTop, { width: 79, align: 'right' });
  doc.moveTo(48, tableTop + 18).lineTo(547, tableTop + 18).strokeColor('#CBD5E1').stroke();

  let y = tableTop + 30;
  order.items.forEach((item) => {
    const lineTotal = Number(item.unit_price) * Number(item.quantity);
    doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(10).text(item.product_name, 48, y, { width: 230 });
    doc.fillColor('#94A3B8').font('Helvetica').fontSize(8).text(`${item.variant_grind} / ${item.variant_weight}`, 48, y + 14, { width: 230 });
    doc.fillColor('#0F172A').font('Courier').fontSize(10).text(String(item.quantity), 318, y + 4, { width: 70, align: 'right' });
    doc.text(`Rp ${Number(item.unit_price).toLocaleString('id-ID')}`, 388, y + 4, { width: 80, align: 'right' });
    doc.font('Courier-Bold').text(`Rp ${lineTotal.toLocaleString('id-ID')}`, 468, y + 4, { width: 79, align: 'right' });
    y += 42;
    doc.moveTo(48, y - 8).lineTo(547, y - 8).strokeColor('#F1F5F9').stroke();
  });

  const subtotal = Number(order.total_amount || 0) - Number(order.shipping_fee || 0);
  const shippingFee = Number(order.shipping_fee || 0);
  const totalAmount = Number(order.total_amount || 0);
  const totalsX = 330;
  const totalsWidth = 217;

  y += 16;
  doc.fillColor('#64748B').font('Helvetica').fontSize(10).text('Subtotal', totalsX, y, { width: 110 });
  doc.font('Courier').text(`Rp ${subtotal.toLocaleString('id-ID')}`, totalsX + 107, y, { width: 110, align: 'right' });
  y += 20;
  doc.fillColor('#64748B').font('Helvetica').fontSize(10).text('Pengiriman', totalsX, y, { width: 110 });
  doc.font('Courier').text(`Rp ${shippingFee.toLocaleString('id-ID')}`, totalsX + 107, y, { width: 110, align: 'right' });
  y += 24;
  doc.moveTo(totalsX, y - 8).lineTo(totalsX + totalsWidth, y - 8).strokeColor('#CBD5E1').stroke();
  doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(14).text('Total Tagihan', totalsX, y, { width: 110 });
  doc.font('Courier-Bold').text(`Rp ${totalAmount.toLocaleString('id-ID')}`, totalsX + 107, y, { width: 110, align: 'right' });

  const footerY = Math.max(y + 60, 690);
  doc.moveTo(48, footerY - 18).lineTo(547, footerY - 18).strokeColor('#E2E8F0').stroke();
  doc.fillColor('#94A3B8').font('Helvetica-Bold').fontSize(9).text('INSTRUKSI PEMBAYARAN', 48, footerY);
  doc.fillColor('#64748B').font('Helvetica').fontSize(10);

  if (paymentMethod === 'TEMPO') {
    doc.text(`Harap lakukan pembayaran sebelum tanggal jatuh tempo. Jika memilih transfer manual, silakan transfer ke rekening BCA 1234567890 a/n Fermion Roastery dan sertakan nomor invoice ${order.id.slice(0, 8).toUpperCase()}.`, 48, footerY + 18, { width: 499, align: 'left' });
  } else if (paymentMethod === 'OFFLINE_CASH') {
    doc.text('Pembayaran tunai akan dilakukan secara langsung saat pengambilan atau pengiriman barang oleh kurir Fermion.', 48, footerY + 18, { width: 499, align: 'left' });
  } else {
    doc.text('Silakan selesaikan pembayaran melalui link Xendit yang telah disediakan agar pesanan Anda segera diproses.', 48, footerY + 18, { width: 499, align: 'left' });
  }

  doc.end();

  const buffer = await finished;
  return { buffer, fileName };
};

const generateInvoicePDF = async (orderId) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          product_name,
          quantity,
          unit_price,
          variant_weight,
          variant_grind
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found or error fetching order");

    const { buffer, fileName } = await createInvoiceBuffer(order);
    const storagePath = getInvoiceStoragePath(order);

    const { error: uploadError } = await supabase.storage
      .from(INVOICE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Invoice Storage Upload Error:', uploadError);
    }

    return { buffer, fileName, storagePath, uploaded: !uploadError };
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

const generateShippingLabelsBatch = async (orderIds, res) => {
  try {
    const doc = new PDFDocument({ size: 'A6', margin: 20 });
    doc.pipe(res);

    for (let i = 0; i < orderIds.length; i++) {
      if (i > 0) doc.addPage();

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            product_name,
            quantity
          )
        `)
        .eq('id', orderIds[i])
        .single();

      if (orderError || !order) continue;

      doc.rect(10, 10, 278, 398).stroke();
      doc.fontSize(14).font('Helvetica-Bold').text(order.shipping_courier?.toUpperCase() || 'PENGIRIMAN', 20, 25);
      doc.fontSize(8).font('Helvetica').text('No. Resi:', 20, 45);
      doc.fontSize(12).font('Helvetica-Bold').text(order.shipping_awb || 'MENUNGGU RESI', 20, 55);
      doc.moveTo(10, 80).lineTo(288, 80).stroke();
      doc.fontSize(7).font('Helvetica-Bold').text('PENGIRIM:', 20, 90);
      doc.fontSize(8).font('Helvetica-Bold').text('FERMION ROASTERY', 20, 100);
      doc.fontSize(7).font('Helvetica').text('Jl. Kesambi No. 202, Cirebon, Jawa Barat', 20, 110);
      doc.text('081234567890', 20, 120);
      doc.moveTo(10, 135).lineTo(288, 135).stroke();
      doc.fontSize(7).font('Helvetica-Bold').text('PENERIMA:', 20, 145);
      doc.fontSize(10).font('Helvetica-Bold').text(order.customer_name.toUpperCase(), 20, 155);
      doc.fontSize(8).font('Helvetica-Bold').text(order.customer_phone, 20, 170);
      doc.fontSize(8).font('Helvetica').text(order.shipping_address, 20, 185, { width: 250 });
      doc.text(order.shipping_city, 20, doc.y + 2);
      doc.moveTo(10, 250).lineTo(288, 250).stroke();
      doc.fontSize(7).font('Helvetica-Bold').text('ISI PAKET:', 20, 260);
      let itemY = 270;
      order.items.forEach(item => {
        doc.fontSize(7).font('Helvetica').text(`- ${item.product_name} (${item.quantity} pcs)`, 20, itemY);
        itemY += 10;
      });
      doc.fontSize(6).font('Helvetica-Oblique').text('Dicetak otomatis oleh Fermion Business Engine', 20, 385, { align: 'center', width: 258 });
    }

    doc.end();
  } catch (error) {
    console.error('Batch Label Generation Error:', error);
    if (!res.headersSent) res.status(500).send("Error generating labels");
  }
};

export { INVOICE_BUCKET, getInvoiceStoragePath, generateInvoicePDF, generateShippingLabelsBatch };
