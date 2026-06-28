const currency = new Intl.NumberFormat('id-ID');

const escapeCsv = (value) => {
  const text = value == null ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export const toCsv = (rows) => rows.map((row) => row.map(escapeCsv).join(',')).join('\n');

export const formatCurrency = (value) => `Rp ${currency.format(Number(value || 0))}`;

export const mapOrdersExport = (orders) => [
  ['Order ID', 'Tanggal', 'Pelanggan', 'Status', 'Subtotal', 'Ongkir', 'Total', 'Kurir', 'Resi', 'Item'],
  ...orders.map((order) => {
    const items = (order.order_items || order.items || [])
      .map((item) => `${item.quantity}x ${item.product_name || item.name} ${item.variant_weight || item.weight || ''}`.trim())
      .join(' | ');
    const total = Number(order.total_amount || 0);
    const shipping = Number(order.shipping_fee || 0);
    return [
      order.id,
      new Date(order.created_at || Date.now()).toISOString(),
      order.customer_name || '',
      order.status || '',
      formatCurrency(total - shipping),
      formatCurrency(shipping),
      formatCurrency(total),
      order.shipping_courier || '',
      order.shipping_awb || '',
      items,
    ];
  }),
];

export const mapPartnersExport = (partners) => [
  ['Partner ID', 'Nama Usaha', 'PIC', 'Email', 'Status', 'Tier', 'Volume Estimasi (kg)', 'Dibuat'],
  ...partners.map((partner) => [
    partner.id,
    partner.company_name || '',
    partner.profiles?.full_name || partner.full_name || '',
    partner.profiles?.email || partner.email || '',
    partner.status || '',
    partner.tier_name || '',
    partner.estimated_volume_kg || '',
    partner.created_at || '',
  ]),
];

export const mapInvoicesExport = (orders) => [
  ['Invoice', 'Order ID', 'Pelanggan', 'Status', 'Metode', 'Total', 'Dibuat'],
  ...orders.map((order) => [
    `INV-${String(order.id).slice(0, 8).toUpperCase()}`,
    order.id,
    order.customer_name || '',
    order.status || '',
    order.payment_method || '',
    formatCurrency(order.total_amount),
    order.created_at || '',
  ]),
];
