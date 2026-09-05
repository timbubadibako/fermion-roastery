export const CSV_TEMPLATE_CONTENT = `name,slug,category,sub_category,origin,farm,process,altitude,price_retail,stock_quantity,roast_profile,description
"Sumedang Anaerob Natural","sumedang-anaerob-natural","filter","filter_specialty","Sumedang, West Java","Kebun Manglayang","Anaerob Natural","1400 - 1600 mdpl",145000,50,"Light to Medium","Profil rasa manis strawberry dan winey finish."
"Gayo Musara Full Washed","gayo-musara-washed","filter","filter_specialty","Aceh Gayo","Koperasi Musara","Full Washed","1500 mdpl",135000,30,"Light","Clean cup dengan acidity jeruk purut yang cerah."
"Kerinci Barokah Honey","kerinci-barokah-honey","filter","filter_exotic","Jambi, Kerinci","Koperasi Barokah","Honey Process","1600 mdpl",155000,25,"Light to Medium","Floral jasmine aroma dengan rasa nangka madu."
"Espresso Komoditi Blend","espresso-komoditi-blend","espresso","espresso_commodity","Blend Java & Sumatra","Multi Farm","Washed & Natural","1200 - 1400 mdpl",110000,100,"Medium to Dark","Body tebal dengan crema melimpah cocok untuk es kopi susu."`;

export const downloadCsvTemplate = () => {
  const blob = new Blob([CSV_TEMPLATE_CONTENT], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "template_import_kopi_fermion.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCsvProducts = (text: string) => {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const products: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex parsing row with quotes handling
    const rowRegex = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\s\S][^'\\]*)*)'|"([^"\\]*(?:\\[\s\S][^"\\]*)*)"|([^,\s"]*))\s*(?:,|$)/g;
    const matches: string[] = [];
    let match;
    while ((match = rowRegex.exec(lines[i])) !== null) {
      if (match.index === rowRegex.lastIndex) rowRegex.lastIndex++;
      matches.push((match[1] || match[2] || match[3] || '').trim());
    }

    if (matches.length === 0) continue;

    const getVal = (name: string) => {
      const idx = headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
      return idx !== -1 ? matches[idx] : '';
    };

    const name = getVal('name');
    if (!name) continue;

    const rawSlug = getVal('slug') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const price_retail = parseFloat(getVal('price_retail')) || 100000;
    const stock_quantity = parseInt(getVal('stock_quantity')) || 50;

    products.push({
      name,
      slug: rawSlug,
      category: getVal('category') || 'filter',
      sub_category: getVal('sub_category') || 'filter_specialty',
      origin: getVal('origin') || 'Indonesia',
      farm: getVal('farm') || '',
      process: getVal('process') || 'Natural',
      altitude: getVal('altitude') || '1400 mdpl',
      price_retail,
      stock_quantity,
      roast_profile: getVal('roast_profile') || 'Light to Medium',
      description: getVal('description') || '',
      is_active: true,
      b2b_discount_enabled: true,
      variants: [
        { weight: "150g", price: price_retail, stock_quantity: Math.floor(stock_quantity / 2) || 25 },
        { weight: "250g", price: Math.round(price_retail * 1.5), stock_quantity: Math.floor(stock_quantity / 2) || 25 }
      ]
    });
  }

  return products;
};
