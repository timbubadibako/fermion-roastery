import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { supabase } from './supabase.js';

const generateInvoicePDF = async (orderId) => {
  try {
    // 1. Fetch complete order details with items
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

    // 2. Setup PDF Document
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `INV-${order.id.split('-')[0].toUpperCase()}.pdf`;
    const invoicesDir = path.join(process.cwd(), 'invoices');
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);
    const filePath = path.join(invoicesDir, fileName);
    
    // Pipe to file
    doc.pipe(fs.createWriteStream(filePath));

    // --- Header ---
    const logoPath = path.join(process.cwd(), '../frontend/public/fermion-logo.png');
    if (fs.existsSync(logoPath)) {
      // Draw Logo on the left
      doc.image(logoPath, 50, 40, { width: 60 });
      // Text on the right
      doc.fontSize(24).font('Helvetica-Bold').text('FERMION ROASTERY', 120, 45);
      doc.fontSize(10).font('Helvetica').text('Jl. Kesambi No. 202, Cirebon, Jawa Barat', 120, 70);
      doc.text('hello@fermion.com | +62 812 3456 7890', 120, 85);
      doc.y = 120; // reset y position after header
    } else {
      doc.fontSize(24).font('Helvetica-Bold').text('FERMION ROASTERY', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text('Jl. Kesambi No. 202, Cirebon, Jawa Barat', { align: 'center' });
      doc.text('hello@fermion.com | +62 812 3456 7890', { align: 'center' });
      doc.moveDown(2);
    }

    // --- Invoice Info ---
    doc.fontSize(20).font('Helvetica-Bold').text('INVOICE');
    doc.fontSize(10).font('Helvetica')
       .text(`Invoice No: INV-${order.id.split('-')[0].toUpperCase()}`)
       .text(`Date: ${new Date(order.updated_at).toLocaleDateString('id-ID')}`)
       .text(`Status: ${order.status}`);
    doc.moveDown();

    // --- Customer Info ---
    doc.font('Helvetica-Bold').text('Bill To:');
    doc.font('Helvetica')
       .text(order.customer_name)
       .text(order.customer_email)
       .text(order.customer_phone)
       .text(order.shipping_address)
       .text(`${order.shipping_city} ${order.shipping_notes ? '('+order.shipping_notes+')' : ''}`);
    doc.moveDown(2);

    // --- Items Table ---
    const tableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Item Description', 50, tableTop);
    doc.text('Qty', 350, tableTop, { width: 50, align: 'right' });
    doc.text('Price', 400, tableTop, { width: 70, align: 'right' });
    doc.text('Total', 470, tableTop, { width: 70, align: 'right' });
    
    // Draw line
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    
    let y = tableTop + 25;
    doc.font('Helvetica');
    
    order.items.forEach(item => {
      const itemTotal = item.unit_price * item.quantity;
      doc.text(`${item.product_name} (${item.variant_weight} - ${item.variant_grind})`, 50, y, { width: 280 });
      doc.text(item.quantity.toString(), 350, y, { width: 50, align: 'right' });
      doc.text(Number(item.unit_price).toLocaleString('id-ID'), 400, y, { width: 70, align: 'right' });
      doc.text(itemTotal.toLocaleString('id-ID'), 470, y, { width: 70, align: 'right' });
      y += 20;
    });

    // Draw line
    doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
    y += 20;

    // --- Totals ---
    doc.font('Helvetica-Bold');
    doc.text('Subtotal:', 350, y, { width: 120, align: 'right' });
    doc.font('Helvetica').text(`Rp ${(order.total_amount - order.shipping_fee).toLocaleString('id-ID')}`, 470, y, { width: 70, align: 'right' });
    y += 20;

    doc.font('Helvetica-Bold');
    doc.text(`Shipping (${order.shipping_courier || 'Kurir'}):`, 350, y, { width: 120, align: 'right' });
    doc.font('Helvetica').text(`Rp ${Number(order.shipping_fee).toLocaleString('id-ID')}`, 470, y, { width: 70, align: 'right' });
    y += 20;

    // Draw line
    doc.moveTo(350, y + 10).lineTo(550, y + 10).stroke();
    y += 20;

    doc.fontSize(14).font('Helvetica-Bold');
    doc.text('Grand Total:', 350, y, { width: 120, align: 'right' });
    doc.text(`Rp ${Number(order.total_amount).toLocaleString('id-ID')}`, 470, y, { width: 70, align: 'right' });

    // --- Footer ---
    doc.fontSize(10).font('Helvetica-Oblique');
    doc.text('Thank you for choosing Fermion Roastery.', 50, 700, { align: 'center' });

    // Finalize
    doc.end();
    return filePath;
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

export { generateInvoicePDF, generateShippingLabelsBatch };
