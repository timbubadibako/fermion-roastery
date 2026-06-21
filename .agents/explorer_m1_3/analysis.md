# Translation Keys Extraction & Translation Report

This report documents all hardcoded text strings extracted from B2B Shop, B2B Checkout, and Subscription Checkout pages, proposes logical translation keys, and provides translations in English (en) and Indonesian (id) in compliance with all guidelines.

## Crucial Translation Constraint
- The term **"ritual" / "rituals"** has been completely avoided in keys, namespaces, and translations.
- Straightforward business terms like **"Pesanan" (Order / Orders)**, **"Berlangganan" (Subscription)**, and **"Kemitraan" (Partnership)** are used.

---

## 1. frontend/app/b2b/shop/page.tsx

### Hardcoded Texts Found

| Line | Original Text | Context / Usage | Suggested Key |
|---|---|---|---|
| 51 | `"Gagal memuat katalog grosir."` | Toast error on fetch failure | `toast.loadFailed` |
| 70 | `"${product.name} dimasukkan ke keranjang grosir"` | Toast success on add to cart | `toast.addedToCart` |
| 76 | `"Memuat Katalog Grosir..."` | Loading screen text | `loading` |
| 91 | `"Keranjang"` | Floating cart button text (with dynamic item count) | `floatingCart` |
| 102 | `"Harga Level {currentTier} Aktif"` | Tier status badge (interpolated tier name) | `activeTierPrice` |
| 105 | `"Belanja <br/> Grosir."` | Page main header text | `title` |
| 106 | `"Katalog produk khusus dengan harga kemitraan aktif."` | Page subheader text | `subtitle` |
| 116 | `"Volume Discount Aktif"` | Volume discount banner header | `volumeDiscount.title` |
| 117-120 | `"Harga yang ditampilkan adalah harga dasar Tier {currentTier}. <br/> Dapatkan tambahan diskon 5% untuk total pemesanan di atas 5 KG, dan 10% untuk di atas 10 KG. (Diterapkan otomatis di keranjang)."` | Volume discount banner description | `volumeDiscount.description` |
| 158 | `"Kategori: {mainCat}."` | Catalog category section header | `categoryTitle` |
| 193 | `"Blend"` | Fallback product origin tag if empty | `originBlend` |
| 208 | `"Retail: Rp"` | Compare retail price label | `retailLabel` |
| 212 | `"/ 1 KG"` | Unit price suffix | `unitLabel` |
| 239 | `"Selesai Memilih?"` | Bottom CTA banner title | `checkoutPrompt.title` |
| 240 | `"Tinjau kembali pesanan Anda dan lanjutkan ke proses pengiriman untuk mengamankan batch roastery minggu ini."` | Bottom CTA banner description | `checkoutPrompt.description` |
| 244 | `"Proses Pesanan"` | Bottom CTA button label | `checkoutPrompt.button` |

### Suggested Translation Keys (JSON format)

```json
{
  "b2bShop": {
    "toast": {
      "loadFailed": "Gagal memuat katalog grosir.",
      "addedToCart": "{{name}} dimasukkan ke keranjang grosir"
    },
    "loading": "Memuat Katalog Grosir...",
    "floatingCart": "Keranjang ({{count}})",
    "activeTierPrice": "Harga Level {{tier}} Aktif",
    "title": "Belanja <br/> Grosir.",
    "subtitle": "Katalog produk khusus dengan harga kemitraan aktif.",
    "volumeDiscount": {
      "title": "Volume Discount Aktif",
      "description": "Harga yang ditampilkan adalah harga dasar Tier {{tier}}. <br className=\"hidden md:block\"/> Dapatkan tambahan diskon <strong className=\"font-black\">5%</strong> untuk total pemesanan di atas 5 KG, dan <strong className=\"font-black\">10%</strong> untuk di atas 10 KG. (Diterapkan otomatis di keranjang)."
    },
    "categoryTitle": "Kategori: {{category}}.",
    "originBlend": "Blend",
    "retailLabel": "Retail: Rp",
    "unitLabel": "/ 1 KG",
    "checkoutPrompt": {
      "title": "Selesai Memilih?",
      "description": "Tinjau kembali pesanan Anda dan lanjutkan ke proses pengiriman untuk mengamankan batch roastery minggu ini.",
      "button": "Proses Pesanan"
    }
  }
}
```

### Proposed Translations

#### Indonesian (id)
```json
{
  "b2bShop": {
    "toast": {
      "loadFailed": "Gagal memuat katalog grosir.",
      "addedToCart": "{{name}} dimasukkan ke keranjang grosir"
    },
    "loading": "Memuat Katalog Grosir...",
    "floatingCart": "Keranjang ({{count}})",
    "activeTierPrice": "Harga Level {{tier}} Aktif",
    "title": "Belanja <br/> Grosir.",
    "subtitle": "Katalog produk khusus dengan harga kemitraan aktif.",
    "volumeDiscount": {
      "title": "Volume Discount Aktif",
      "description": "Harga yang ditampilkan adalah harga dasar Tier {{tier}}. <br className=\"hidden md:block\"/> Dapatkan tambahan diskon <strong className=\"font-black\">5%</strong> untuk total pemesanan di atas 5 KG, dan <strong className=\"font-black\">10%</strong> untuk di atas 10 KG. (Diterapkan otomatis di keranjang)."
    },
    "categoryTitle": "Kategori: {{category}}.",
    "originBlend": "Blend",
    "retailLabel": "Retail: Rp",
    "unitLabel": "/ 1 KG",
    "checkoutPrompt": {
      "title": "Selesai Memilih?",
      "description": "Tinjau kembali pesanan Anda dan lanjutkan ke proses pengiriman untuk mengamankan batch roastery minggu ini.",
      "button": "Proses Pesanan"
    }
  }
}
```

#### English (en)
```json
{
  "b2bShop": {
    "toast": {
      "loadFailed": "Failed to load wholesale catalog.",
      "addedToCart": "{{name}} added to wholesale cart"
    },
    "loading": "Loading Wholesale Catalog...",
    "floatingCart": "Cart ({{count}})",
    "activeTierPrice": "Active Tier {{tier}} Pricing",
    "title": "Wholesale <br/> Shop.",
    "subtitle": "Exclusive product catalog with active partnership pricing.",
    "volumeDiscount": {
      "title": "Volume Discount Active",
      "description": "Prices shown are Tier {{tier}} base prices. <br className=\"hidden md:block\"/> Get an additional <strong className=\"font-black\">5%</strong> discount for total orders above 5 KG, and <strong className=\"font-black\">10%</strong> for above 10 KG. (Applied automatically in cart)."
    },
    "categoryTitle": "Category: {{category}}.",
    "originBlend": "Blend",
    "retailLabel": "Retail: Rp",
    "unitLabel": "/ 1 KG",
    "checkoutPrompt": {
      "title": "Done Selecting?",
      "description": "Review your order and proceed to delivery to secure this week's roastery batch.",
      "button": "Process Order"
    }
  }
}
```

---

## 2. frontend/app/b2b/checkout/page.tsx

### Hardcoded Texts Found

| Line | Original Text | Context / Usage | Suggested Key |
|---|---|---|---|
| 75 | `"Please select a cargo method."` | Toast error on missing courier | `toast.selectCargo` |
| 87 | `"Invoice Net-30 Berhasil Dibuat."` | Toast success for tempo checkout | `toast.tempoSuccess` |
| 99 | `"Pesanan offline berhasil dicatat."` | Toast success for offline cash checkout | `toast.offlineSuccess` |
| 139 | `"Procurement protocol initiated! Redirecting to payment..."` | Toast success before redirecting to Xendit | `toast.gatewaySuccess` |
| 149 | `"Failed to generate procurement invoice."` | Toast error on gateway creation fail | `toast.invoiceFailed` |
| 152 | `"Communication failure with Payment Gateway."` | Toast error on fetch exception | `toast.gatewayError` |
| 161, 188 | `"Mempersiapkan Pesanan Grosir..."` | Loading screen text | `loading` |
| 196 | `"Keranjang Grosir Kosong."` | Empty state title | `emptyState.title` |
| 197 | `"Silakan pilih produk grosir terlebih dahulu sebelum melanjutkan."` | Empty state subtitle | `emptyState.subtitle` |
| 199 | `"Kembali ke Katalog"` | Empty state button | `emptyState.button` |
| 209 | `"Protokol_Bayar"` | Top page badge | `badge` |
| 210 | `"Tahap 2 dari 2"` | Checkout step label | `stepLabel` |
| 212 | `"Penyelesaian <br/> Pesanan."` | Page main header title | `title` |
| 221 | `"Tujuan Pengiriman"` | Shipping section header | `shipping.sectionTitle` |
| 232 | `"Alamat Cafe Default"` | Default address button label | `shipping.defaultAddressLabel` |
| 235 | `"Jl. Sudirman No. 1, Jakarta Selatan"` | Fallback address when profile data is missing | `shipping.fallbackAddress` |
| 244 | `"Custom Branch / WH"` | Custom address button label | `shipping.customAddressLabel` |
| 246 | `"Deliver this specific batch to a different location."` | Custom address button subtitle | `shipping.customAddressSubtitle` |
| 259 | `"Custom Delivery Address"` | Custom address input label | `shipping.customAddressInputLabel` |
| 260 | `"Full street address..."` | Custom address input placeholder | `shipping.customAddressPlaceholder` |
| 269 | `"Cargo Selection"` | Courier list section header | `cargo.sectionTitle` |
| 285 | `"Est. {courier.duration}"` | Courier duration prefix | `cargo.estDuration` |
| 299 | `"Ringkasan Pesanan"` | Order summary section header | `summary.sectionTitle` |
| 306 | `"Net 30"` | Net-30 payment tab label | `payment.net30` |
| 312 | `"Tunai (Offline)"` | Offline cash payment tab label | `payment.cashOffline` |
| 317 | `"Gateway"` | Gateway payment tab label | `payment.gateway` |
| 327 | `"{item.quantity} UNIT x Rp {item.price}"` | Inline item price calculation string | `summary.itemCalculation` |
| 336-338 | `"Pembelian sebesar {totalVolumeKg}KG ini akan ditambahkan ke akumulasi bulanan Anda."` | Monthly quota information banner | `summary.monthlyAccumulationAlert` |
| 343 | `"Subtotal Produk"` | Subtotal label | `summary.subtotal` |
| 348 | `"Volume Discount ({discountPercentage * 100}%)"` | Volume discount item label | `summary.volumeDiscount` |
| 353 | `"Total Pembayaran"` | Grand total label | `summary.total` |
| 363 | `"Cetak Invoice Tempo"` / `"Catat Pesanan Tunai"` / `"Bayar Sekarang"` | Dynamic submit button label based on payment method | `payment.btnTempo` / `payment.btnOffline` / `payment.btnGateway` |

- *Note*: Static courier durations `3-5 Days` (Line 66) and `2-4 Days` (Line 67) from mock fetch should also be translated:
  - Key `cargo.durationDays` with pluralization or simple templates can be proposed.

### Suggested Translation Keys (JSON format)

```json
{
  "b2bCheckout": {
    "toast": {
      "selectCargo": "Please select a cargo method.",
      "tempoSuccess": "Invoice Net-30 Berhasil Dibuat.",
      "offlineSuccess": "Pesanan offline berhasil dicatat.",
      "gatewaySuccess": "Procurement protocol initiated! Redirecting to payment...",
      "invoiceFailed": "Failed to generate procurement invoice.",
      "gatewayError": "Communication failure with Payment Gateway."
    },
    "loading": "Mempersiapkan Pesanan Grosir...",
    "emptyState": {
      "title": "Keranjang Grosir Kosong.",
      "subtitle": "Silakan pilih produk grosir terlebih dahulu sebelum melanjutkan.",
      "button": "Kembali ke Katalog"
    },
    "badge": "Protokol_Bayar",
    "stepLabel": "Tahap 2 dari 2",
    "title": "Penyelesaian <br/> Pesanan.",
    "shipping": {
      "sectionTitle": "Tujuan Pengiriman",
      "defaultAddressLabel": "Alamat Cafe Default",
      "fallbackAddress": "Jl. Sudirman No. 1, Jakarta Selatan",
      "customAddressLabel": "Custom Branch / WH",
      "customAddressSubtitle": "Deliver this specific batch to a different location.",
      "customAddressInputLabel": "Custom Delivery Address",
      "customAddressPlaceholder": "Full street address..."
    },
    "cargo": {
      "sectionTitle": "Cargo Selection",
      "estDuration": "Est. {{duration}}"
    },
    "summary": {
      "sectionTitle": "Ringkasan Pesanan",
      "itemCalculation": "{{quantity}} UNIT x Rp {{price}}",
      "monthlyAccumulationAlert": "Pembelian sebesar {{weight}}KG ini akan ditambahkan ke akumulasi bulanan Anda.",
      "subtotal": "Subtotal Produk",
      "volumeDiscount": "Volume Discount ({{percent}}%)",
      "total": "Total Pembayaran"
    },
    "payment": {
      "net30": "Net 30",
      "cashOffline": "Tunai (Offline)",
      "gateway": "Gateway",
      "btnTempo": "Cetak Invoice Tempo",
      "btnOffline": "Catat Pesanan Tunai",
      "btnGateway": "Bayar Sekarang"
    }
  }
}
```

### Proposed Translations

#### Indonesian (id)
```json
{
  "b2bCheckout": {
    "toast": {
      "selectCargo": "Silakan pilih metode kargo terlebih dahulu.",
      "tempoSuccess": "Invoice Net-30 Berhasil Dibuat.",
      "offlineSuccess": "Pesanan offline berhasil dicatat.",
      "gatewaySuccess": "Protokol pengadaan dimulai! Mengalihkan ke pembayaran...",
      "invoiceFailed": "Gagal membuat tagihan pengadaan.",
      "gatewayError": "Kegagalan komunikasi dengan Gerbang Pembayaran."
    },
    "loading": "Mempersiapkan Pesanan Grosir...",
    "emptyState": {
      "title": "Keranjang Grosir Kosong.",
      "subtitle": "Silakan pilih produk grosir terlebih dahulu sebelum melanjutkan.",
      "button": "Kembali ke Katalog"
    },
    "badge": "Protokol_Bayar",
    "stepLabel": "Tahap 2 dari 2",
    "title": "Penyelesaian <br/> Pesanan.",
    "shipping": {
      "sectionTitle": "Tujuan Pengiriman",
      "defaultAddressLabel": "Alamat Cafe Default",
      "fallbackAddress": "Jl. Sudirman No. 1, Jakarta Selatan",
      "customAddressLabel": "Custom Branch / WH",
      "customAddressSubtitle": "Kirim batch khusus ini ke lokasi yang berbeda.",
      "customAddressInputLabel": "Alamat Pengiriman Kustom",
      "customAddressPlaceholder": "Alamat jalan lengkap..."
    },
    "cargo": {
      "sectionTitle": "Pilihan Kargo",
      "estDuration": "Estimasi {{duration}}"
    },
    "summary": {
      "sectionTitle": "Ringkasan Pesanan",
      "itemCalculation": "{{quantity}} UNIT x Rp {{price}}",
      "monthlyAccumulationAlert": "Pembelian sebesar {{weight}}KG ini akan ditambahkan ke akumulasi bulanan Anda.",
      "subtotal": "Subtotal Produk",
      "volumeDiscount": "Volume Discount ({{percent}}%)",
      "total": "Total Pembayaran"
    },
    "payment": {
      "net30": "Net 30",
      "cashOffline": "Tunai (Offline)",
      "gateway": "Gateway",
      "btnTempo": "Cetak Invoice Tempo",
      "btnOffline": "Catat Pesanan Tunai",
      "btnGateway": "Bayar Sekarang"
    }
  }
}
```

#### English (en)
```json
{
  "b2bCheckout": {
    "toast": {
      "selectCargo": "Please select a cargo method.",
      "tempoSuccess": "Net-30 Invoice Created Successfully.",
      "offlineSuccess": "Offline order logged successfully.",
      "gatewaySuccess": "Procurement protocol initiated! Redirecting to payment...",
      "invoiceFailed": "Failed to generate procurement invoice.",
      "gatewayError": "Communication failure with Payment Gateway."
    },
    "loading": "Preparing Wholesale Order...",
    "emptyState": {
      "title": "Wholesale Cart is Empty.",
      "subtitle": "Please select wholesale products first before proceeding.",
      "button": "Back to Catalog"
    },
    "badge": "Payment_Protocol",
    "stepLabel": "Step 2 of 2",
    "title": "Order <br/> Completion.",
    "shipping": {
      "sectionTitle": "Shipping Destination",
      "defaultAddressLabel": "Default Cafe Address",
      "fallbackAddress": "Jl. Sudirman No. 1, South Jakarta",
      "customAddressLabel": "Custom Branch / WH",
      "customAddressSubtitle": "Deliver this specific batch to a different location.",
      "customAddressInputLabel": "Custom Delivery Address",
      "customAddressPlaceholder": "Full street address..."
    },
    "cargo": {
      "sectionTitle": "Cargo Selection",
      "estDuration": "Est. {{duration}}"
    },
    "summary": {
      "sectionTitle": "Order Summary",
      "itemCalculation": "{{quantity}} UNIT x Rp {{price}}",
      "monthlyAccumulationAlert": "This purchase of {{weight}}KG will be added to your monthly accumulation.",
      "subtotal": "Product Subtotal",
      "volumeDiscount": "Volume Discount ({{percent}}%)",
      "total": "Total Payment"
    },
    "payment": {
      "net30": "Net 30",
      "cashOffline": "Cash (Offline)",
      "gateway": "Gateway",
      "btnTempo": "Generate Net-30 Invoice",
      "btnOffline": "Log Cash Order",
      "btnGateway": "Pay Now"
    }
  }
}
```

---

## 3. frontend/app/subscription/checkout/page.tsx

### Hardcoded Texts Found

| Line | Original Text | Context / Usage | Suggested Key |
|---|---|---|---|
| 70 | `"Tidak ada paket langganan yang dipilih."` | Toast error on missing plan in local storage | `toast.noPlanSelected` |
| 130 | `"Alamat tersimpan dimuat."` | Toast success on loading saved address | `toast.savedAddressLoaded` |
| 135 | `"Mohon lengkapi alamat dan identitas penerima."` | Toast validation error | `toast.completeAddressAndIdentity` |
| 178 | `"Gagal membuat tagihan pembayaran."` | Toast error on api order creation fail | `toast.invoiceFailed` |
| 182 | `"Terjadi kesalahan jaringan."` | Toast error on network exception | `toast.networkError` |
| 190 | `"Mempersiapkan Checkout..."` | Loading screen text | `loading` |
| 206 | `"Info Pengiriman."` | Page main header title | `title` |
| 207 | `"Where should we deliver your order?"` | Page main header subtitle | `subtitle` |
| 227 | `"Pengiriman Prioritas"` | Priority benefit title card | `priorityShipping.title` |
| 228 | `"Paket langganan Anda akan selalu diproses pada hari pertama roasting setiap bulannya untuk menjamin kesegaran maksimal."` | Priority benefit card description | `priorityShipping.description` |
| 239 | `"Total Pembayaran"` | Checkout panel heading | `summary.sectionTitle` |
| 245 | `"Paket"` | Subscription plan line-item label | `summary.planLabel` |
| 249 | `"Ongkos Kirim"` | Shipping fee label | `summary.shippingLabel` |
| 250 | `"GRATIS"` | Free shipping tag | `summary.freeShipping` |
| 255 | `"Total"` | Order grand total label | `summary.total` |
| 274 | `"Memproses..."` | Button text during submission | `payment.processing` |
| 276 | `"Konfirmasi & Bayar"` | Standard button label | `payment.confirmAndPay` |
| 283 | `"Pembayaran akan diproses aman melalui Xendit Payment Gateway. Anda menyetujui syarat & ketentuan berlangganan."` | Disclaimers/T&C footer text inside the checkout panel | `payment.termsAlert` |

### Suggested Translation Keys (JSON format)

```json
{
  "subscriptionCheckout": {
    "toast": {
      "noPlanSelected": "Tidak ada paket langganan yang dipilih.",
      "savedAddressLoaded": "Alamat tersimpan dimuat.",
      "completeAddressAndIdentity": "Mohon lengkapi alamat dan identitas penerima.",
      "invoiceFailed": "Gagal membuat tagihan pembayaran.",
      "networkError": "Terjadi kesalahan jaringan."
    },
    "loading": "Mempersiapkan Checkout...",
    "title": "Info Pengiriman.",
    "subtitle": "Where should we deliver your order?",
    "priorityShipping": {
      "title": "Pengiriman Prioritas",
      "description": "Paket langganan Anda akan selalu diproses pada hari pertama roasting setiap bulannya untuk menjamin kesegaran maksimal."
    },
    "summary": {
      "sectionTitle": "Total Pembayaran",
      "planLabel": "Paket",
      "shippingLabel": "Ongkos Kirim",
      "freeShipping": "GRATIS",
      "total": "Total"
    },
    "payment": {
      "processing": "Memproses...",
      "confirmAndPay": "Konfirmasi & Bayar",
      "termsAlert": "Pembayaran akan diproses aman melalui <span className=\"text-slate-900\">Xendit Payment Gateway</span>. Anda menyetujui syarat & ketentuan berlangganan."
    }
  }
}
```

### Proposed Translations

#### Indonesian (id)
```json
{
  "subscriptionCheckout": {
    "toast": {
      "noPlanSelected": "Tidak ada paket langganan yang dipilih.",
      "savedAddressLoaded": "Alamat tersimpan dimuat.",
      "completeAddressAndIdentity": "Mohon lengkapi alamat dan identitas penerima.",
      "invoiceFailed": "Gagal membuat tagihan pembayaran.",
      "networkError": "Terjadi kesalahan jaringan."
    },
    "loading": "Mempersiapkan Checkout...",
    "title": "Info Pengiriman.",
    "subtitle": "Ke mana kami harus mengirimkan pesanan Anda?",
    "priorityShipping": {
      "title": "Pengiriman Prioritas",
      "description": "Paket langganan Anda akan selalu diproses pada hari pertama roasting setiap bulannya untuk menjamin kesegaran maksimal."
    },
    "summary": {
      "sectionTitle": "Total Pembayaran",
      "planLabel": "Paket",
      "shippingLabel": "Ongkos Kirim",
      "freeShipping": "GRATIS",
      "total": "Total"
    },
    "payment": {
      "processing": "Memproses...",
      "confirmAndPay": "Konfirmasi & Bayar",
      "termsAlert": "Pembayaran akan diproses aman melalui <span className=\"text-slate-900\">Xendit Payment Gateway</span>. Anda menyetujui syarat & ketentuan berlangganan."
    }
  }
}
```

#### English (en)
```json
{
  "subscriptionCheckout": {
    "toast": {
      "noPlanSelected": "No subscription plan selected.",
      "savedAddressLoaded": "Saved address loaded.",
      "completeAddressAndIdentity": "Please complete the delivery address and recipient identity.",
      "invoiceFailed": "Failed to generate payment invoice.",
      "networkError": "A network error occurred."
    },
    "loading": "Preparing Checkout...",
    "title": "Shipping Info.",
    "subtitle": "Where should we deliver your order?",
    "priorityShipping": {
      "title": "Priority Shipping",
      "description": "Your subscription package will always be processed on the first roasting day of each month to guarantee maximum freshness."
    },
    "summary": {
      "sectionTitle": "Total Payment",
      "planLabel": "Plan",
      "shippingLabel": "Shipping Fee",
      "freeShipping": "FREE",
      "total": "Total"
    },
    "payment": {
      "processing": "Processing...",
      "confirmAndPay": "Confirm & Pay",
      "termsAlert": "Payment will be securely processed through <span className=\"text-slate-900\">Xendit Payment Gateway</span>. You agree to the subscription terms & conditions."
    }
  }
}
```
