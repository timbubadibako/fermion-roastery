# Analysis Report: Extraction of Hardcoded Text for Localization

This report lists all hardcoded user-facing strings found in the specified frontend files, proposes logical translation keys following the project's nested structure pattern, and provides compliant translations in English (`en`) and Indonesian (`id`) without using the forbidden word "ritual".

---

## 1. Hardcoded Text Strings Found

### A. `frontend/app/account/page.tsx`

| Line Number | Hardcoded Text String | Context |
| :--- | :--- | :--- |
| **70** | `'Alamat Utama'` | Default label for primary address in `addresses` state initialization. |
| **71** | `'Alamat 2'` | Default label for secondary address in `addresses` state initialization. |
| **72** | `'Alamat 3'` | Default label for tertiary address in `addresses` state initialization. |
| **132** | `"Langganan berhasil dihentikan."` | Toast success message when canceling a subscription. |
| **135** | `"Gagal menghentikan langganan."` | Toast error message when failing to cancel a subscription. |
| **137** | `"Terjadi kesalahan jaringan."` | Toast error message on network failure. |
| **147** | `"Gagal memuat daftar pesanan."` | Toast error message when failing to retrieve the order list. |
| **228** | `"Pengaturan profil dan alamat tersimpan."` | Toast success message when saving profile settings. |
| **236** | `"Gagal menyimpan perubahan."` | Toast error message when failing to save profile settings. |
| **239** | `"Gagal terhubung ke server."` | Toast error message when the server is unreachable. |
| **245** | `"Geolocation tidak didukung browser."` | Toast error message when browser does not support geolocation. |
| **249** | `"Mendeteksi lokasi asli anda..."` | Toast loading message when fetching current geolocation. |
| **289** | `"Alamat terdeteksi otomatis! Silakan lengkapi detail nomor rumah dan cari kota/kecamatan."` | Toast success message upon successfully retrieving address from GPS coordinates. |
| **293** | `"Gagal menerjemahkan lokasi. Silakan isi manual."` | Toast error message when reverse geocoding fails. |
| **297** | `"Akses lokasi ditolak browser."` | Toast error message when user blocks geolocation access. |
| **308** | `"Accessing Laboratory Hub..."` | Loading state paragraph. |
| **323** | `"Account Hub"` | Main header title. |
| **324** | `"Scientist:"` | Label preceding scientist/user name. |
| **327** | `"Keluar dari Sistem"` | Logout button text. |
| **334** | `"Overview"` | Navigation tab label. |
| **335** | `"Order Records"` | Navigation tab label. |
| **336** | `"Subscription"` | Navigation tab label. |
| **337** | `"Lab Settings"` | Navigation tab label. |
| **340** | `"Registrasi B2B"` | Navigation tab label (B2B condition). |
| **372** | `"Status Pesanan Terakhir"` | Heading inside Overview card. |
| **376** | `"Order #"` | Prefix text for order ID in Overview card. |
| **382** | `"Lihat Detail"` | Detail view button text. |
| **387** | `"Belum ada pesanan aktif."` | Empty state text in recent orders. |
| **395** | `"Total Pembelian"` | Overview sub-card heading. |
| **396** | `"Pesanan"` | Label inside purchase counter sub-card. |
| **399** | `"Subscription"` | Overview sub-card heading. |
| **400** | `'No Active Plan'` | Fallback label when there is no active subscription. |
| **401** | `"Aktif sejak"` | Date prefix label for active subscription. |
| **401** | `'Belum berlangganan'` | Subtitle fallback for subscription status. |
| **410** | `"Lab Subscription"` | Title inside Subscription tab. |
| **414** | `"Paket Aktif"` | Status field label in active subscription block. |
| **415** | `"Aktif"` | Active badge status label. |
| **419** | `"Hentikan Langganan"` | Unsubscribe action button text. |
| **424** | `"Belum ada paket langganan aktif."` | Empty state text for subscription tab. |
| **426** | `"Mulai Langganan"` | Button to navigate to subscription catalog. |
| **439** | `"Lab Records"` | Title inside Orders tab. |
| **440** | `"Pesanan"` | Label count text next to total orders. |
| **446** | `"Arsip pesanan tidak ditemukan."` | Empty state text when order history is empty. |
| **468** | `"Total"` | Label for the total amount of a specific order. |
| **486** | `"Kurir & Resi"` | Order tracking metadata label. |
| **487** | `'Pending'` | Shipping courier fallback status. |
| **487** | `'Menunggu Resi'` | AWB fallback status. |
| **498** | `"Confirmed"` | First status step in tracking timeline. |
| **499** | `"Order verified and paid."` | Verification description in tracking timeline. |
| **505** | `"Roasting"` | Second status step in tracking timeline. |
| **506** | `"Beans are being precision roasted."` | Roasting description in tracking timeline. |
| **512** | `"Shipped"` | Third status step in tracking timeline. |
| **513** | `"On the way to your laboratory."` | Shipping description in tracking timeline. |
| **519** | `"Delivered"` | Fourth status step in tracking timeline. |
| **520** | `"Successfully dispatched."` | Delivery confirmation in tracking timeline. |
| **540** | `"Lab Settings"` | Title inside Settings tab. |
| **551** | `"Identitas Peneliti"` | Sub-section title in Settings. |
| **555** | `"Nama Lengkap"` | Full name input field label. |
| **559** | `"Nomor Kontak WhatsApp"` | Phone number input field label. |
| **561** | `"08..."` | Placeholder text for phone number input. |
| **574** | `"Buku Alamat Pengiriman"` | Sub-section title in Settings. |
| **576-578**| `"Gunakan Lokasi Saat Ini"` | *Note: Commented out button.* |
| **603** | `"Nama Penerima"` | Address recipient name input field label. |
| **615** | `"Nomor Telpon Penerima"` | Address recipient phone number input field label. |
| **631** | `"RT / RW"` | Address RT/RW field label. |
| **634** | `"Misal: RT 03 / RW 01"` | Placeholder text for RT/RW field. |
| **642** | `"Blok / Dusun / Kampung / Jalan"` | Detailed street/hamlet field label. |
| **645** | `"Misal: Dusun Manis / Blok Pahing / Jl. Elang"` | Placeholder text for street/hamlet field. |
| **655** | `"Desa / Kelurahan"` | Detailed village/sub-district field label. |
| **658** | `"Misal: Desa Waled Kota"` | Placeholder text for village/sub-district field. |
| **667** | `"Patokan (Opsional)"` | Landmark field label. |
| **675** | `"Misal: Samping Mushola Al-Ikhlas"` | Placeholder text for landmark field. |
| **686** | `"Cari Kecamatan / Kota"` | Address selection input component label. |
| **714** | `"Konfirmasi & Simpan Semua Perubahan"` | Form submit button label in settings. |
| **729** | `"Status: Menunggu Persetujuan"` | Title banner for pending B2B partner status. |
| **730** | `"Mohon lengkapi dokumen kontrak di bawah ini agar tim kami dapat segera menyetujui akun B2B Anda."` | Instruction paragraph for B2B pending status. |
| **744** | `"Contract Protocol."` | Scrapbook contract title in B2B tab. |
| **745** | `"Legal Finalization"` | Sub-label in B2B contract block. |
| **746-748**| `"Your partnership agreement is ready. Please download, sign, and upload to finalize your lab access."` | Action instruction paragraph for B2B contract setup. |
| **756** | `"Download Contract PDF"` | B2B contract download action button label. |
| **763** | `"Drop or Click to Upload"` | Dropzone label for uploading signed contract. |
| **764** | `"Accepted Format: PDF Only (Max 5MB)"` | Dropzone constraints info text. |
| **769** | `"Uploading contract..."` | Loading toast during contract upload. |
| **771** | `"Contract uploaded successfully!"` | Success toast when contract upload finishes. |
| **794** | `"Initializing Laboratory..."` | Initial page suspense fallback text. |

---

### B. `frontend/app/cart/page.tsx`

| Line Number | Hardcoded Text String | Context |
| :--- | :--- | :--- |
| **162** | `"Gagal mengambil tarif pengiriman."` | Toast error message when shipping rates fail to fetch. |
| **170** | `"Pilih metode pengiriman terlebih dahulu."` | Toast error message when attempting checkout without a courier selected. |
| **210** | `"Pesanan dibuat! Mengalihkan ke pembayaran..."` | Toast success message when order/invoice is successfully created. |
| **219** | `"Gagal membuat invoice."` | Toast error message when invoice creation fails. |
| **222** | `"Gagal terhubung ke Payment Gateway."` | Toast error message on network failure to the payments API. |
| **240** | `"Keranjang Kosong"` | Empty state heading. |
| **242** | `"Lihat Produk"` | Empty state button linking back to coffee listing page. |
| **258** | `"01 Review"` | Checkout progress flow header - Step 1. |
| **260** | `"02 Shipping"` | Checkout progress flow header - Step 2. |
| **267** | `"Daftar Produk"` | Main heading of the shopping cart review screen. |
| **268** | `"Specimen selection for your next order"` | Subheading under cart review title. |
| **307** | `"Subtotal Item"` | Label indicating total cost of a single line item. |
| **318** | `"Kembali Belanja"` | Link back to the coffee catalogue. |
| **321** | `"Lanjut ke Pengiriman"` | Button to proceed to step 2 (shipping details). |
| **332** | `"Ringkasan Pesanan"` | Heading of order summary panel. |
| **338** | `"Total Produk"` | Order summary label for sum of items. |
| **339** | `"Pcs"` | Unit label for total items. |
| **342** | `"Subtotal"` | Order summary subtotal label. |
| **348** | `"Total"` | Order summary total label. |
| **351** | `"*Belum termasuk biaya pengiriman"` | Footnote showing shipping is excluded. |
| **357** | `"Pastikan pesanan Anda sudah sesuai sebelum melanjutkan ke pengiriman."` | Notice box message about order correctness. |
| **368** | `"Info Pengiriman"` | Main heading of the shipping step. |
| **369** | `"Where should we dispatch your specimens?"` | Subheading under shipping title. |
| **431** | `"Metode Pengiriman"` | Courier section heading. |
| **432** | `"Select your logistics partner"` | Courier section subheading. |
| **443** | `"Mencari kurir terbaik..."` | Placeholder text during loading of shipping rates. |
| **443** | `"Tentukan alamat untuk menghitung ongkos kirim"` | Helper text when area ID is not selected yet. |
| **488** | `"Kembali ke Review"` | Button to return to step 1 (cart review). |
| **499** | `"Total Pembayaran"` | Heading of final checkout summary panel. |
| **505** | `"Subtotal Produk"` | Checkout summary product price sum label. |
| **509** | `"Ongkos Kirim"` | Checkout summary shipping cost label. |
| **511** | `"MENUNGGU"` | Fallback text for shipping cost when courier is not chosen. |
| **517** | `"Total"` | Checkout summary final total label. |
| **526** | `"Bayar Sekarang"` | Primary checkout submit action button. |
| **533** | `"Pembayaran akan diproses aman melalui"` | Checkout footnote explaining secure processing. |
| **533** | `"Xendit Payment Gateway"` | Payment processor brand name. |

---

### C. `frontend/components/cart-sheet.tsx`

| Line Number | Hardcoded Text String | Context |
| :--- | :--- | :--- |
| **38** | `"Please select at least one item to checkout."` | Toast error message if user clicks checkout with 0 selected items. |
| **66** | `"Current Selection"` | Title header inside the cart slide-over sheet. |
| **75** | `"Cart is empty."` | Empty state text inside the cart sheet. |
| **78** | `"Explore Specimens"` | Empty state button linking to coffee list. |
| **128** | `"Subtotal"` | Label indicating total cost of selected items. |
| **138** | `"Confirm Checkout"` | Primary action button to confirm checkout. |

---

## 2. Suggested Translation Keys

Following the modular nested structure of `frontend/lib/i18n.ts`, we propose adding or updating the namespaces below:

```json
{
  "common": {
    "messages": {
      "networkError": "...",
      "serverConnectionFailure": "..."
    }
  },
  "account": {
    "loading": {
      "accessingHub": "...",
      "initializing": "..."
    },
    "header": {
      "title": "...",
      "scientistLabel": "...",
      "logoutButton": "..."
    },
    "tabs": {
      "overview": "...",
      "orderRecords": "...",
      "subscription": "...",
      "labSettings": "...",
      "b2bRegistration": "..."
    },
    "overview": {
      "latestOrderStatus": "...",
      "orderLabel": "...",
      "viewDetailsButton": "...",
      "noActiveOrders": "...",
      "totalPurchaseTitle": "...",
      "ordersCountLabel": "...",
      "subscriptionTitle": "...",
      "noActivePlan": "...",
      "activeSince": "...",
      "notSubscribed": "..."
    },
    "subscription": {
      "title": "...",
      "activePlanLabel": "...",
      "activeBadge": "...",
      "cancelButton": "...",
      "noSubscription": "...",
      "startSubscriptionButton": "..."
    },
    "orders": {
      "title": "...",
      "countLabel": "...",
      "emptyHistory": "...",
      "totalHeader": "..."
    },
    "tracking": {
      "courierAndAwb": "...",
      "pending": "...",
      "awaitingAwb": "...",
      "status": {
        "confirmed": {
          "title": "...",
          "desc": "..."
        },
        "roasting": {
          "title": "...",
          "desc": "..."
        },
        "shipped": {
          "title": "...",
          "desc": "..."
        },
        "delivered": {
          "title": "...",
          "desc": "..."
        }
      }
    },
    "settings": {
      "title": "...",
      "researcherIdentity": "...",
      "fullNameLabel": "...",
      "whatsappNumberLabel": "...",
      "whatsappPlaceholder": "...",
      "addressBookTitle": "...",
      "useCurrentLocation": "...",
      "recipientNameLabel": "...",
      "recipientPhoneLabel": "...",
      "rtRwLabel": "...",
      "rtRwPlaceholder": "...",
      "streetAddressLabel": "...",
      "streetAddressPlaceholder": "...",
      "villageLabel": "...",
      "villagePlaceholder": "...",
      "landmarkLabel": "...",
      "landmarkPlaceholder": "...",
      "districtCitySearchLabel": "...",
      "saveButton": "...",
      "addresses": {
        "primaryLabel": "...",
        "address2Label": "...",
        "address3Label": "..."
      }
    },
    "b2b": {
      "pendingStatusTitle": "...",
      "pendingStatusDesc": "...",
      "contractProtocolTitle": "...",
      "legalFinalizationLabel": "...",
      "partnershipAgreementText": "...",
      "downloadButton": "...",
      "uploadDropzoneTitle": "...",
      "uploadDropzoneFormat": "..."
    },
    "messages": {
      "subscriptionCancelSuccess": "...",
      "subscriptionCancelFailure": "...",
      "ordersLoadFailure": "...",
      "profileSaveSuccess": "...",
      "profileSaveFailure": "...",
      "geolocationUnsupported": "...",
      "detectingLocation": "...",
      "locationDetected": "...",
      "locationGeocodeFailure": "...",
      "locationAccessDenied": "...",
      "uploadingContract": "...",
      "contractUploadSuccess": "..."
    }
  },
  "cart": {
    "emptyState": {
      "title": "...",
      "viewProductsButton": "..."
    },
    "steps": {
      "review": "...",
      "shipping": "..."
    },
    "review": {
      "title": "...",
      "subtitle": "...",
      "itemSubtotalLabel": "...",
      "backToShopLink": "...",
      "proceedToShippingButton": "..."
    },
    "summary": {
      "title": "...",
      "totalItemsLabel": "...",
      "pcsLabel": "...",
      "subtotalLabel": "...",
      "totalLabel": "...",
      "shippingExcludedNote": "...",
      "validationHint": "..."
    },
    "shipping": {
      "title": "...",
      "subtitle": "...",
      "courierTitle": "...",
      "courierSubtitle": "...",
      "searchingCouriers": "...",
      "setAddressPrompt": "...",
      "backToReviewButton": "..."
    },
    "payment": {
      "title": "...",
      "productSubtotalLabel": "...",
      "shippingFeeLabel": "...",
      "awaitingShippingFee": "...",
      "totalLabel": "...",
      "payNowButton": "...",
      "processorNotePrefix": "...",
      "processorName": "..."
    },
    "messages": {
      "shippingRatesLoadFailure": "...",
      "selectCourierWarning": "...",
      "orderCreatedRedirecting": "...",
      "invoiceGenerationFailure": "...",
      "paymentGatewayError": "..."
    }
  },
  "cartSheet": {
    "messages": {
      "selectItemWarning": "..."
    },
    "header": {
      "title": "..."
    },
    "emptyState": {
      "title": "...",
      "exploreButton": "..."
    },
    "footer": {
      "subtotalLabel": "...",
      "confirmCheckoutButton": "..."
    }
  }
}
```

---

## 3. Proposed Translations (English vs. Indonesian)

All translations avoid the term "ritual". In Indonesian, straightforward business concepts like "Pesanan", "Berlangganan", or "Kemitraan" are used.

### A. Common/Global Keys
```typescript
// en
common: {
  messages: {
    networkError: "A network error occurred.",
    serverConnectionFailure: "Failed to connect to server."
  }
}

// id
common: {
  messages: {
    networkError: "Terjadi kesalahan jaringan.",
    serverConnectionFailure: "Gagal terhubung ke server."
  }
}
```

### B. Account Hub Namespace (`account`)

```typescript
// en
account: {
  loading: {
    accessingHub: "Accessing Laboratory Hub...",
    initializing: "Initializing Laboratory..."
  },
  header: {
    title: "Account Hub",
    scientistLabel: "Scientist:",
    logoutButton: "Exit System"
  },
  tabs: {
    overview: "Overview",
    orderRecords: "Order Records",
    subscription: "Subscription",
    labSettings: "Lab Settings",
    b2bRegistration: "B2B Registration"
  },
  overview: {
    latestOrderStatus: "Latest Order Status",
    orderLabel: "Order #",
    viewDetailsButton: "View Details",
    noActiveOrders: "No active orders found.",
    totalPurchaseTitle: "Total Purchases",
    ordersCountLabel: "Orders",
    subscriptionTitle: "Subscription",
    noActivePlan: "No Active Plan",
    activeSince: "Active since",
    notSubscribed: "Not subscribed"
  },
  subscription: {
    title: "Lab Subscription",
    activePlanLabel: "Active Plan",
    activeBadge: "Active",
    cancelButton: "Cancel Subscription",
    noSubscription: "No active subscription plan found.",
    startSubscriptionButton: "Start Subscription"
  },
  orders: {
    title: "Lab Records",
    countLabel: "Orders",
    emptyHistory: "Order archive not found.",
    totalHeader: "Total"
  },
  tracking: {
    courierAndAwb: "Courier & AWB",
    pending: "Pending",
    awaitingAwb: "Awaiting AWB",
    status: {
      confirmed: {
        title: "Confirmed",
        desc: "Order verified and paid."
      },
      roasting: {
        title: "Roasting",
        desc: "Beans are being precision roasted."
      },
      shipped: {
        title: "Shipped",
        desc: "On the way to your laboratory."
      },
      delivered: {
        title: "Delivered",
        desc: "Successfully dispatched."
      }
    }
  },
  settings: {
    title: "Lab Settings",
    researcherIdentity: "Researcher Identity",
    fullNameLabel: "Full Name",
    whatsappNumberLabel: "WhatsApp Contact Number",
    whatsappPlaceholder: "08...",
    addressBookTitle: "Shipping Address Book",
    useCurrentLocation: "Use Current Location",
    recipientNameLabel: "Recipient Name",
    recipientPhoneLabel: "Recipient Phone Number",
    rtRwLabel: "RT / RW",
    rtRwPlaceholder: "e.g. RT 03 / RW 01",
    streetAddressLabel: "Block / Hamlet / Village / Street",
    streetAddressPlaceholder: "e.g. Dusun Manis / Blok Pahing / Jl. Elang",
    villageLabel: "Subdistrict / Village",
    villagePlaceholder: "e.g. Desa Waled Kota",
    landmarkLabel: "Landmark (Optional)",
    landmarkPlaceholder: "e.g. Next to Al-Ikhlas Mosque",
    districtCitySearchLabel: "Search District / City",
    saveButton: "Confirm & Save All Changes",
    addresses: {
      primaryLabel: "Primary Address",
      address2Label: "Address 2",
      address3Label: "Address 3"
    }
  },
  b2b: {
    pendingStatusTitle: "Status: Awaiting Approval",
    pendingStatusDesc: "Please complete the contract documents below so our team can approve your B2B account.",
    contractProtocolTitle: "Contract Protocol.",
    legalFinalizationLabel: "Legal Finalization",
    partnershipAgreementText: "Your partnership agreement is ready. Please download, sign, and upload to finalize your partner dashboard access.",
    downloadButton: "Download Contract PDF",
    uploadDropzoneTitle: "Drop or Click to Upload",
    uploadDropzoneFormat: "Accepted Format: PDF Only (Max 5MB)"
  },
  messages: {
    subscriptionCancelSuccess: "Subscription successfully cancelled.",
    subscriptionCancelFailure: "Failed to cancel subscription.",
    ordersLoadFailure: "Failed to load order history.",
    profileSaveSuccess: "Profile and address settings saved.",
    profileSaveFailure: "Failed to save changes.",
    geolocationUnsupported: "Geolocation is not supported by your browser.",
    detectingLocation: "Detecting your current location...",
    locationDetected: "Address automatically detected! Please complete the house number details and search for city/district.",
    locationGeocodeFailure: "Failed to resolve location. Please fill in manually.",
    locationAccessDenied: "Location access denied by browser.",
    uploadingContract: "Uploading contract...",
    contractUploadSuccess: "Contract uploaded successfully!"
  }
}

// id
account: {
  loading: {
    accessingHub: "Mengakses Pusat Laboratorium...",
    initializing: "Menginisialisasi Laboratorium..."
  },
  header: {
    title: "Pusat Akun",
    scientistLabel: "Peneliti:",
    logoutButton: "Keluar dari Sistem"
  },
  tabs: {
    overview: "Ringkasan",
    orderRecords: "Catatan Pesanan",
    subscription: "Berlangganan",
    labSettings: "Pengaturan Lab",
    b2bRegistration: "Registrasi B2B"
  },
  overview: {
    latestOrderStatus: "Status Pesanan Terakhir",
    orderLabel: "Pesanan #",
    viewDetailsButton: "Lihat Detail",
    noActiveOrders: "Belum ada pesanan aktif.",
    totalPurchaseTitle: "Total Pembelian",
    ordersCountLabel: "Pesanan",
    subscriptionTitle: "Berlangganan",
    noActivePlan: "Belum Ada Paket Aktif",
    activeSince: "Aktif sejak",
    notSubscribed: "Belum berlangganan"
  },
  subscription: {
    title: "Langganan Lab",
    activePlanLabel: "Paket Aktif",
    activeBadge: "Aktif",
    cancelButton: "Hentikan Langganan",
    noSubscription: "Belum ada paket langganan aktif.",
    startSubscriptionButton: "Mulai Langganan"
  },
  orders: {
    title: "Arsip Lab",
    countLabel: "Pesanan",
    emptyHistory: "Arsip pesanan tidak ditemukan.",
    totalHeader: "Total"
  },
  tracking: {
    courierAndAwb: "Kurir & Resi",
    pending: "Tertunda",
    awaitingAwb: "Menunggu Resi",
    status: {
      confirmed: {
        title: "Dikonfirmasi",
        desc: "Pesanan diverifikasi dan dibayar."
      },
      roasting: {
        title: "Roasting",
        desc: "Biji kopi sedang dipanggang secara presisi."
      },
      shipped: {
        title: "Dikirim",
        desc: "Dalam perjalanan menuju laboratorium Anda."
      },
      delivered: {
        title: "Diterima",
        desc: "Berhasil dikirimkan."
      }
    }
  },
  settings: {
    title: "Pengaturan Lab",
    researcherIdentity: "Identitas Peneliti",
    fullNameLabel: "Nama Lengkap",
    whatsappNumberLabel: "Nomor Kontak WhatsApp",
    whatsappPlaceholder: "08...",
    addressBookTitle: "Buku Alamat Pengiriman",
    useCurrentLocation: "Gunakan Lokasi Saat Ini",
    recipientNameLabel: "Nama Penerima",
    recipientPhoneLabel: "Nomor Telpon Penerima",
    rtRwLabel: "RT / RW",
    rtRwPlaceholder: "Misal: RT 03 / RW 01",
    streetAddressLabel: "Blok / Dusun / Kampung / Jalan",
    streetAddressPlaceholder: "Misal: Dusun Manis / Blok Pahing / Jl. Elang",
    villageLabel: "Desa / Kelurahan",
    villagePlaceholder: "Misal: Desa Waled Kota",
    landmarkLabel: "Patokan (Opsional)",
    landmarkPlaceholder: "Misal: Samping Mushola Al-Ikhlas",
    districtCitySearchLabel: "Cari Kecamatan / Kota",
    saveButton: "Konfirmasi & Simpan Semua Perubahan",
    addresses: {
      primaryLabel: "Alamat Utama",
      address2Label: "Alamat 2",
      address3Label: "Alamat 3"
    }
  },
  b2b: {
    pendingStatusTitle: "Status: Menunggu Persetujuan",
    pendingStatusDesc: "Mohon lengkapi dokumen kontrak di bawah ini agar tim kami dapat segera menyetujui akun B2B Anda.",
    contractProtocolTitle: "Protokol Kontrak.",
    legalFinalizationLabel: "Finalisasi Hukum",
    partnershipAgreementText: "Perjanjian kemitraan Anda telah siap. Silakan unduh, tanda tangani, dan unggah untuk meresmikan akses dashboard mitra Anda.",
    downloadButton: "Unduh Kontrak PDF",
    uploadDropzoneTitle: "Letakkan File atau Klik untuk Mengunggah",
    uploadDropzoneFormat: "Format yang Diterima: PDF Saja (Maks. 5MB)"
  },
  messages: {
    subscriptionCancelSuccess: "Langganan berhasil dihentikan.",
    subscriptionCancelFailure: "Gagal menghentikan langganan.",
    ordersLoadFailure: "Gagal memuat daftar pesanan.",
    profileSaveSuccess: "Pengaturan profil dan alamat tersimpan.",
    profileSaveFailure: "Gagal menyimpan perubahan.",
    geolocationUnsupported: "Geolocation tidak didukung browser.",
    detectingLocation: "Mendeteksi lokasi asli anda...",
    locationDetected: "Alamat terdeteksi otomatis! Silakan lengkapi detail nomor rumah dan cari kota/kecamatan.",
    locationGeocodeFailure: "Gagal menerjemahkan lokasi. Silakan isi manual.",
    locationAccessDenied: "Akses lokasi ditolak browser.",
    uploadingContract: "Mengunggah kontrak...",
    contractUploadSuccess: "Kontrak berhasil diunggah!"
  }
}
```

### C. Shopping Cart Namespace (`cart`)

```typescript
// en
cart: {
  emptyState: {
    title: "Empty Cart",
    viewProductsButton: "View Products"
  },
  steps: {
    review: "01 Review",
    shipping: "02 Shipping"
  },
  review: {
    title: "Product List",
    subtitle: "Specimen selection for your next order",
    itemSubtotalLabel: "Item Subtotal",
    backToShopLink: "Continue Shopping",
    proceedToShippingButton: "Proceed to Shipping"
  },
  summary: {
    title: "Order Summary",
    totalItemsLabel: "Total Products",
    pcsLabel: "Pcs",
    subtotalLabel: "Subtotal",
    totalLabel: "Total",
    shippingExcludedNote: "*Excluding shipping fees",
    validationHint: "Please verify your order details before proceeding to shipping."
  },
  shipping: {
    title: "Shipping Info",
    subtitle: "Where should we dispatch your specimens?",
    courierTitle: "Shipping Method",
    courierSubtitle: "Select your logistics partner",
    searchingCouriers: "Searching for best couriers...",
    setAddressPrompt: "Set your address to calculate shipping costs",
    backToReviewButton: "Back to Review"
  },
  payment: {
    title: "Total Payment",
    productSubtotalLabel: "Product Subtotal",
    shippingFeeLabel: "Shipping Fee",
    awaitingShippingFee: "AWAITING",
    totalLabel: "Total",
    payNowButton: "Pay Now",
    processorNotePrefix: "Payment will be securely processed through",
    processorName: "Xendit Payment Gateway"
  },
  messages: {
    shippingRatesLoadFailure: "Failed to load shipping rates.",
    selectCourierWarning: "Please select a shipping method first.",
    orderCreatedRedirecting: "Order created! Redirecting to payment...",
    invoiceGenerationFailure: "Failed to generate invoice.",
    paymentGatewayError: "Failed to connect to Payment Gateway."
  }
}

// id
cart: {
  emptyState: {
    title: "Keranjang Kosong",
    viewProductsButton: "Lihat Produk"
  },
  steps: {
    review: "01 Peninjauan",
    shipping: "02 Pengiriman"
  },
  review: {
    title: "Daftar Produk",
    subtitle: "Seleksi spesimen untuk pesanan Anda berikutnya",
    itemSubtotalLabel: "Subtotal Item",
    backToShopLink: "Kembali Belanja",
    proceedToShippingButton: "Lanjut ke Pengiriman"
  },
  summary: {
    title: "Ringkasan Pesanan",
    totalItemsLabel: "Total Produk",
    pcsLabel: "Pcs",
    subtotalLabel: "Subtotal",
    totalLabel: "Total",
    shippingExcludedNote: "*Belum termasuk biaya pengiriman",
    validationHint: "Pastikan pesanan Anda sudah sesuai sebelum melanjutkan ke pengiriman."
  },
  shipping: {
    title: "Info Pengiriman",
    subtitle: "Ke mana kami harus mengirimkan spesimen Anda?",
    courierTitle: "Metode Pengiriman",
    courierSubtitle: "Pilih mitra logistik Anda",
    searchingCouriers: "Mencari kurir terbaik...",
    setAddressPrompt: "Tentukan alamat untuk menghitung ongkos kirim",
    backToReviewButton: "Kembali ke Review"
  },
  payment: {
    title: "Total Pembayaran",
    productSubtotalLabel: "Subtotal Produk",
    shippingFeeLabel: "Ongkos Kirim",
    awaitingShippingFee: "MENUNGGU",
    totalLabel: "Total",
    payNowButton: "Bayar Sekarang",
    processorNotePrefix: "Pembayaran akan diproses aman melalui",
    processorName: "Xendit Payment Gateway"
  },
  messages: {
    shippingRatesLoadFailure: "Gagal mengambil tarif pengiriman.",
    selectCourierWarning: "Pilih metode pengiriman terlebih dahulu.",
    orderCreatedRedirecting: "Pesanan dibuat! Mengalihkan ke pembayaran...",
    invoiceGenerationFailure: "Gagal membuat invoice.",
    paymentGatewayError: "Gagal terhubung ke Payment Gateway."
  }
}
```

### D. Cart Slide-Over Sheet Namespace (`cartSheet`)

```typescript
// en
cartSheet: {
  messages: {
    selectItemWarning: "Please select at least one item to checkout."
  },
  header: {
    title: "Current Selection"
  },
  emptyState: {
    title: "Your cart is empty.",
    exploreButton: "Explore Specimens"
  },
  footer: {
    subtotalLabel: "Subtotal",
    confirmCheckoutButton: "Confirm Checkout"
  }
}

// id
cartSheet: {
  messages: {
    selectItemWarning: "Silakan pilih setidaknya satu produk untuk checkout."
  },
  header: {
    title: "Pilihan Saat Ini"
  },
  emptyState: {
    title: "Keranjang kosong.",
    exploreButton: "Jelajahi Produk"
  },
  footer: {
    subtotalLabel: "Subtotal",
    confirmCheckoutButton: "Konfirmasi Checkout"
  }
}
```
