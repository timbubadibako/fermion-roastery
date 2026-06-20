import { useLangStore } from "./store";

export type Language = 'en' | 'id';

export const translations = {
  en: {
    common: {
      loading: "Loading...",
      save: "Save Changes",
      cancel: "Cancel",
      delete: "Delete",
      back: "Back",
      continue: "Continue",
      total: "Total",
      status: "Status",
      action: "Action",
      search: "Search...",
      no_items: "No items found.",
    },
    nav: {
      our_coffee: "OUR COFFEE",
      wholesale: "WHOLESALE",
      subscription: "SUBSCRIPTION",
      journal: "JOURNAL",
      our_story: "OUR STORY",
      login: "LOGIN",
      account: "MY ACCOUNT",
      partner_hub: "PARTNER HUB",
      admin_portal: "ADMIN PORTAL",
    },
    cart: {
      title: "My Cart",
      empty: "Your cart is empty",
      checkout: "Checkout",
      subtotal: "Subtotal",
      shipping: "Shipping",
      free_shipping_info: "Free shipping above Rp 500.000",
      buy_now: "Buy It Now",
    },
    checkout: {
      steps: {
        review: "Review Order",
        shipping: "Shipping Info",
        payment: "Payment",
      },
      identification: "Identification",
      full_name: "Full Name",
      phone: "WhatsApp Number",
      destination: "Shipping Destination",
      address: "Full Street Address",
      city_search: "Search City or Area",
      postal_code: "Postal Code",
      courier_selection: "Courier Selection",
      finalize: "Pay Now",
      success_title: "Payment Successful",
      success_desc: "Your order has been placed and is being processed.",
    },
    account: {
      welcome: "Welcome back",
      tabs: {
        overview: "Overview",
        orders: "Order History",
        settings: "Profile & Address",
      },
      latest_order: "Latest Order Status",
      tracking: {
        expand: "Track Package",
        collapse: "Close Details",
        history: "Package Journey",
        no_data: "No data available from courier yet.",
      },
      order_status: {
        unpaid: "Awaiting Payment",
        paid: "Paid",
        processed: "Processed",
        roasting: "Roasting",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
    },
    admin: {
      kanban: {
        title: "Order Kanban",
        columns: {
          unpaid: "Awaiting Payment",
          paid: "New Orders",
          ready: "Ready to Ship",
          roasting: "Roasting",
          shipped: "Shipped",
        },
        actions: {
          confirm_payment: "Confirm Payment",
          generate_resi: "Generate AWB",
          accept: "Accept",
          reject: "Reject",
          print_label: "Print Label",
          track: "Track Live",
        }
      }
    },
    header: {
      promo: {
        freeShipping: "Free Shipping",
        minPurchase: "Above Rp 500.000"
      },
      search: {
        placeholder: "Search archives...",
        curated: "Curated Specimen",
        matchesFound: "Matches Found",
        results: "Result(s)",
        noMatch: "No specimen matches your query.",
        examineAll: "Examine All Results"
      },
      navMobile: {
        account: "My Account",
        partnerHub: "Partner Hub",
        adminPortal: "Admin Portal",
        login: "Login Account",
        cart: "My Cart"
      }
    },
    spotlight: {
      ourCoffee: {
        title: "The Specimens",
        content: "Explore our latest roasts and laboratory-grade single origins. Each bean is treated like a unique specimen."
      },
      wholesale: {
        title: "B2B Partnership",
        content: "Looking for precision roasting for your cafe? We provide custom profiles and scalable wholesale pricing."
      },
      subscription: {
        title: "Never Run Out",
        content: "Subscribe to our rotating experimental lots. Fresh roasts delivered on your schedule."
      },
      catalog: {
        title: "The Laboratory",
        content: "This is our complete archives. Every bean here has been scientifically profiled for peak flavor."
      },
      tools: {
        title: "Refine Search",
        content: "Use these tools to filter by process, origin, or change your viewing layout."
      },
      sort: {
        title: "Prioritize",
        content: "Sort by price or featured lots to find exactly what you need."
      },
      card: {
        title: "Specimen Data",
        content: "Each card shows origin, price, and tasting notes. Click for full technical specifications."
      },
      buttons: {
        next: "Next",
        gotIt: "Got It",
        quickTour: "Quick Tour"
      },
      cartPage: {
        title: "Your Cart",
        content: "Review your selected specimens before proceeding to checkout."
      },
      addCart: {
        title: "Add to Cart",
        content: "Click this button to add the item to your cart. (This is just a tour, your cart can be emptied later and transaction won't be forced)."
      },
      openCart: {
        title: "Your Cart",
        content: "This is your shopping cart. You can find all your added specimens here."
      },
      checkoutBtn: {
        title: "Checkout",
        content: "Proceed to checkout. Don't worry, the transaction won't be forced."
      },
      addressSelection: {
        title: "Shipping Address",
        content: "Select or add your shipping address here."
      },
      accountSaveHint: {
        content: "To save your addresses for future orders, you can register or log in from the menu up here."
      },
      checkout: {
        title: "Secure Checkout",
        content: "Fill in your shipping details and select a payment method here."
      },
      wholesalePage: {
        title: "B2B Solutions & Partnerships",
        content: "Partner with us and unlock exclusive benefits: tier-based wholesale pricing, dedicated lab support for custom roasting profiles, barista training, and priority access to our limited experimental lots."
      },
      wholesaleJoin: {
        title: "Join the Network",
        content: "Ready to elevate your coffee program? Click here to begin the registration process and become a partner."
      },
      wholesaleCalc: {
        title: "Growth Engine",
        content: "Calculate your projected monthly savings based on your volume using our interactive tier calculator."
      },
      wholesaleSlider: {
        title: "Volume Slider",
        content: "Adjust your monthly volume estimation here to see how it affects your partnership tier."
      },
      wholesaleTier: {
        title: "Partnership Tier",
        content: "Your projected tier, lab discounts, and total savings will dynamically update here."
      },
      wholesaleBenefits: {
        title: "Partner Benefits",
        content: "Explore the six core pillars of our B2B partnership, from quality control to priority logistics."
      },
      wholesaleBenefitCard: {
        title: "Quality Assurance",
        content: "This is one of our six core promises. Every partnership comes with a guarantee of excellence."
      },
      b2bRegHeader: {
        title: "Registration Progress",
        content: "Follow these three steps: account creation, profile setup, and contract finalization."
      },
      b2bRegForm: {
        title: "Partnership Form",
        content: "Fill in your details and estimated monthly volume to help us prepare your custom B2B dashboard."
      },
      b2bContractHeader: {
        title: "Contract Protocol",
        content: "This is the final step. You can always return to this page later if you need time to review."
      },
      b2bContractDownload: {
        title: "Download Contract",
        content: "Click here to download your personalized B2B partnership agreement."
      },
      b2bContractUpload: {
        title: "Upload Signed Copy",
        content: "Once signed, upload the document here to activate your partner dashboard access."
      },
      subHero: {
        title: "The Lab Loop",
        content: "Welcome to our exclusive subscription service. Let our Master Roaster curate your monthly delivery."
      },
      subMaster: {
        title: "Master Roaster's Promise",
        content: "Every batch is meticulously crafted and guaranteed by our Head Roaster, Mr. Yanotama."
      },
      subSteps: {
        title: "How It Works",
        content: "The process is simple: choose your vibe, wait for the roast, and enjoy your monthly supply."
      },
      subPricing: {
        title: "Select Your Plan",
        content: "From 'The Discovery' to 'The Collector', pick the plan that best matches your coffee journey."
      },
      subCheckSaved: {
        title: "Saved Addresses",
        content: "Quickly select an address from your account profile, or manage them in your account dashboard."
      },
      subCheckForm: {
        title: "Shipping Details",
        content: "Please review and complete your recipient details and exact delivery coordinates."
      },
      subCheckPriority: {
        title: "Priority Shipping",
        content: "As a subscriber, your delivery automatically receives priority routing on the first roasting day."
      },
      subCheckSummary: {
        title: "Order Summary",
        content: "Review your selected subscription plan. Note that shipping is completely free."
      },
      subCheckPay: {
        title: "Complete Subscription",
        content: "Click here to proceed to payment and finalize your coffee subscription."
      },
      journalHero: {
        title: "The Archives",
        content: "Read our latest experiments, field reports, and roastery updates."
      },
      journalSearch: {
        title: "Search Records",
        content: "Looking for something specific? Search through our entire repository of articles."
      },
      journalGrid: {
        title: "Pinned Chronicles",
        content: "Explore our featured stories presented in a staggered scrapbook layout."
      },
      journalExplore: {
        title: "Explore More",
        content: "Swipe through our older entries and discover the history behind our beans."
      },
      storyPage: {
        title: "Our Manifesto",
        content: "Learn about the philosophy and history that drives Fermion Roastery."
      },
      admin: {
        loading: "Accessing Control Center...",
        overviewTitle: "Operational Overview.",
        overviewDesc: "Real-time intelligence for Fermion Roastery operations.",
        days7: "7 Days",
        days30: "30 Days",
        custom: "Custom",
        reportRange: "Select Report Range",
        applyFilter: "Apply Filter",
        criticalAlert: "CRITICAL_ALERT",
        inactiveCompany: "Inactive.",
        daysSinceLastOrder: "Days since last order.",
        noOrderHistory: "No order history detected.",
        contactWa: "Contact via WA",
        totalRevenue: "Total Revenue",
        volumeFlow: "Volume Flow",
        activePartner: "Active Partner",
        needsReview: "Needs Review",
        thisPeriod: "This Period",
        logistics: "Logistics",
        stability: "Stability",
        urgent: "Urgent",
        revenueAnalysis: "Revenue Flow Analysis",
        financialPerformance: "Financial Performance by Time Range",
        labAnalysis: "Laboratory Analysis.",
        labDescPart1: "Current best-selling product is",
        labDescPart2: ". Consider prioritizing the next roast batch for Silver Tier partners.",
        roastAccuracy: "Roast Accuracy",
        aiStrategyBtn: "Generate AI Strategy",
        comingSoonTitle: "Coming Soon.",
        comingSoonDesc: "AI Strategy features are currently being calibrated in our lab. Stay tuned!",
        okUnderstand: "OK, Understood",
        revenue: "Revenue",
        selectFullRange: "Select full date range."
      },
      headerSearch: {
        title: "Quick Search",
        content: "Find specific coffee beans, origins, or journal articles instantly."
      },
      headerLang: {
        title: "Language Switch",
        content: "Toggle between English and Bahasa Indonesia seamlessly."
      },
      headerAccount: {
        title: "Your Account",
        content: "Manage your orders, subscriptions, and profile settings."
      },
      headerCart: {
        title: "Mini Cart",
        content: "Quickly view your added items and total price."
      }
    },
    landing: {
      hero: {
        badge: "Exclusive Coffee Roastery",
        title: "CURATED, ROASTED, | REVERED",
        subtitle: "Precision processes to produce unforgettable, high-quality coffee.",
        description: "Precision roasting meets artisan passion. Built for the perfect morning.",
        cta_primary: "Shop Now",
        cta_secondary: "View Products",
        stickers: { origin: "Origin", quality: "100% PRO" }
      },
      partnerRibbon: { placeholder: "Cafe Partner" },
      series: {
        espresso: { title: "Espresso Series.", subtitle: "Rich • Syrupy • Bold", cta: "Explore Bold Beans", sticker: "Adventure Ready" },
        filter: { title: "Filter Series.", subtitle: "Clean • Tea-like • Vibrant", cta: "Explore Vibrant Beans", sticker: "Eco Conscious" }
      },
      theWay: {
        titleMain: "The", titleSub: "Fermion Way.", description: "6 Pillars of Scientific Happiness",
        pillars: [
          { id: "01", title: "Precision", desc: "Extreme control over every thermal cycle." },
          { id: "02", title: "Direct", desc: "Sourcing directly from Java's finest farms." },
          { id: "03", title: "Sensory", desc: "Mathematically scored cup profiles." },
          { id: "04", title: "Eco Pack", desc: "Compostable materials only." },
          { id: "05", title: "Artisan", desc: "Blended for complexity and joy." },
          { id: "06", title: "Tracking", desc: "Real-time roasting-to-door data." }
        ],
        stickers: { lab: "Science Lab", map: "Happiness Map" }
      },
      labRecords: {
        title: "Lab Records.", subtitle: "Real-time QC Data", ctaExplore: "Explore Laboratory",
        cardTitle: "Sumedang Roast Curve", cardAnalysis: "Analysis: 92 Points →",
        ctaDiveTitle: "Dive deeper into our data.", ctaDiveDesc: "Unlock technical specs for every single harvest.", ctaDiveBtn: "Explore All Records"
      },
      newReleases: {
        title: "New Releases.", subtitle: "Directly from the cooling tray",
        cta: "Add to Cart"
      },
      faq: {
        title: "Frequently Asked Questions",
      },
      contact: {
        title: "Contact Us",
        name: "Full Name",
        email: "Email Address",
        message: "Your Message",
        submit: "Send Message",
      },
      footer: {
        titleMain: "Fermion", titleSub: "Roastery.",
        navTitle: "Navigation", copyright: "© 2026 Fermion. Engineered for Joy.", signature: "STAY HAPPY!",
        socials: ["Instagram", "YouTube", "WhatsApp"]
      }
    },
    catalog: {
      badge: "Retail Catalogue",
      titleMain: "Our Coffee",
      titleSub: "Specimens.",
      description: "Explore our collection of precision-roasted beans, curated from the finest altitudes.",
      tools: "Catalogue Tools",
      bestSeller: "BEST SELLER",
      batchRecord: "Batch Record",
      perWeight: "Rp / 250G",
      addToCart: "Add to Cart",
      emptyStateTitle: "No Specimens Found",
      emptyStateDesc: "We couldn't find any coffee that matches your current filters. Try selecting a different process or category.",
      emptyStateReset: "Reset Filters"
    },
    productDetail: {
      returnToCatalogue: "Return to Catalogue",
      specimenRecord: "Specimen Record v.01",
      score: "Score",
      extractionProtocol: "Extraction Protocol",
      brewingGuide: "Brewing Guide",
      forEspresso: "FOR ESPRESSO",
      withMilk: "WITH MILK",
      dose: "DOSE",
      yield: "YIELD",
      time: "TIME",
      ratio: "RATIO",
      authenticRecord: "Authentic Record",
      valuation: "Valuation",
      specimenAnalysis: "Specimen Analysis",
      originsProcessing: "Origins & Processing",
      origin: "Origin",
      process: "Process",
      altitude: "Altitude",
      selectQuantity: "Select Quantity",
      packaging: "Packaging",
      preparation: "Preparation",
      addToOrder: "Add to Order",
      initiateCheckout: "Initiate Checkout",
      labSuggestions: "Laboratory Suggestions",
      completeArchive: "Complete the Archive.",
      browseFullCollection: "Browse Full Collection",
      analyzingBatch: "Analyzing Batch Record...",
      productNotFound: "Product not found",
      returnToArchive: "Return to Archive",
      fermentation: "Fermentation",
      sweetness: "Sweetness",
      acidity: "Acidity",
      body: "Body"
    },
    wholesale: {
      heroBadge: "B2B Partnership Lab",
      heroTitle1: "Scale Your",
      heroTitle2: "Business.",
      heroDesc: "End-to-end coffee solutions for businesses that prioritize quality, consistency, and the story behind every bean.",
      joinHub: "Join the Partner Hub",
      dedicated: "Dedicated",
      facility: "Facility.",
      centralizedOps: "Centralized Roastery Ops",
      trusted: "Trusted",
      partner: "Partner.",
      est: "Est. 2026",
      ecoTest: "Economic Feasibility Test",
      growthEngine: "Your Growth Engine.",
      monthlyVol: "Monthly Specimen Volume",
      min: "MIN 10 KG",
      scale: "SCALE 200+ KG",
      currentTier: "Current Allocation Tier",
      bronze: "Bronze Partner",
      silver: "Silver Partner",
      gold: "Gold Partner",
      labDiscount: "Lab Discount",
      projectedSavings: "Projected Savings",
      perMo: "MO",
      whyPartner: "Why Partner?",
      confidential: "Confidential",
      initialize: "Initialize",
      onboarding: "Onboarding.",
      ctaDesc: "Automate your partnership. Fill the form, download your lab contract, and activate your wholesale access instantly.",
      beginRegistration: "Begin Registration",
      benefits: {
        qualityTitle: "Quality Guarantee",
        qualityDesc: "Every batch is roasted with strict quality control standards.",
        customTitle: "Custom Roast",
        customDesc: "Customize the roast profile to match the unique character of your cafe brand.",
        tieredTitle: "Tiered Pricing",
        tieredDesc: "Get increasingly competitive prices as your volume grows.",
        logisticsTitle: "Reliable Logistics",
        logisticsDesc: "Scheduled deliveries to ensure your stock never runs out.",
        sourcingTitle: "Direct Sourcing",
        sourcingDesc: "Direct access to the best coffee farms across the archipelago.",
        supportTitle: "Partner Support",
        supportDesc: "Menu consultation and routine calibration from our expert roaster team."
      }
    },
    subscription: {
      badge: "Exclusive Subscription Club",
      heroTitle1: "Don't choose.",
      heroTitle2: "Let the Master decide.",
      heroDesc: "Unlock the absolute best of our laboratory. A curated selection delivered automatically, precisely when your soul needs it most.",
      labAccess: "#LAB-ACCESS",
      sensoryExpert: "SENSORY EXPERT",
      quote: "\"I taste over 50 cups a day. The Subscription box is where I put the 2 cups that made me stop and smile.\"",
      headRoaster: "Head Roaster & Q-Grader",
      stepsBadge: "Subscription Steps",
      stepsTitle: "The Laboratory Loop.",
      step1Title: "Choose Vibe",
      step1Desc: "Select the plan that fits your caffeine needs. From discovery to collector.",
      step2Title: "The Lab Curates",
      step2Desc: "We pick the best beans roasting that week specifically for you.",
      step3Title: "Doorstep Magic",
      step3Desc: "Freshly roasted. Rested precisely. Delivered when it tastes best.",
      mastersPick: "MASTER'S PICK",
      perMonth: "/Mo",
      subscribeNow: "Subscribe Now",
      loginRequired: "Please login first to subscribe."
    },
    ourStory: {
      badge: "The Roastery Manifesto",
      title1: "The Flavor",
      title2: "Bridge.",
      desc1: "We exist to connect the hands that grow the coffee to the hands that brew it. Our role is simple but critical: to serve as the flavor bridge between the producer and the coffee drinker.",
      desc2: "There are good intentions, unique character, and intrinsic values within every single bean. It is our sworn duty to ensure those values remain unbroken from farm to cup.",
      est: "#EST-2018",
      garage: "GARAGE DAYS",
      philCategory1: "THE PRODUCER",
      philTitle1: "Honoring the Origin.",
      philDesc1: "We source directly from dedicated farmers. Every cherry carries their hard work and a unique terroir that we are sworn to protect and highlight through careful profiling.",
      philCategory2: "THE DRINKER",
      philTitle2: "Delivering the Value.",
      philDesc2: "Through scientific precision and sensory calibration, we ensure that the original goodness and unique flavor profile reach your morning ritual intact and unbroken.",
      galleryBadge: "Visual Evidence",
      galleryTitle: "Where the magic happens.",
      galleryItem1Title: "Machine",
      galleryItem1Text: "The Probat",
      galleryItem2Title: "QC Pass",
      galleryItem2Text: "Quality Check",
      galleryItem3Title: "Hand Packed",
      galleryItem3Text: "Final Record",
      manifestoQuote: "\"Our job is to be the flavor bridge between the producer and the coffee drinker. There are good things, unique flavors, and values that must not be broken.\"",
      manifestoSign: "— The Fermion Manifesto"
    }
  },
  id: {
    common: {
      loading: "Memuat...",
      save: "Simpan Perubahan",
      cancel: "Batal",
      delete: "Hapus",
      back: "Kembali",
      continue: "Lanjut",
      total: "Total",
      status: "Status",
      action: "Aksi",
      search: "Cari...",
      no_items: "Data tidak ditemukan.",
    },
    nav: {
      our_coffee: "KOPI KAMI",
      wholesale: "GROSIR",
      subscription: "LANGGANAN",
      journal: "JURNAL",
      our_story: "TENTANG KAMI",
      login: "MASUK",
      account: "AKUN SAYA",
      partner_hub: "PARTNER HUB",
      admin_portal: "ADMIN PORTAL",
    },
    cart: {
      title: "Keranjang Saya",
      empty: "Keranjang masih kosong",
      checkout: "Checkout",
      subtotal: "Subtotal",
      shipping: "Ongkos Kirim",
      free_shipping_info: "Gratis ongkir di atas Rp 500.000",
      buy_now: "Beli Sekarang",
    },
    checkout: {
      steps: {
        review: "Tinjau Pesanan",
        shipping: "Info Pengiriman",
        payment: "Pembayaran",
      },
      identification: "Identitas",
      full_name: "Nama Lengkap",
      phone: "Nomor WhatsApp",
      destination: "Tujuan Pengiriman",
      address: "Alamat Lengkap",
      city_search: "Cari Kota atau Wilayah",
      postal_code: "Kode Pos",
      courier_selection: "Pilih Kurir",
      finalize: "Bayar Sekarang",
      success_title: "Pembayaran Berhasil",
      success_desc: "Pesanan Anda telah diterima dan sedang diproses.",
    },
    account: {
      welcome: "Selamat datang kembali",
      tabs: {
        overview: "Ringkasan",
        orders: "Riwayat Pesanan",
        settings: "Profil & Alamat",
      },
      latest_order: "Status Pesanan Terbaru",
      tracking: {
        expand: "Pantau Paket",
        collapse: "Tutup Detail",
        history: "Riwayat Perjalanan",
        no_data: "Data belum tersedia di sistem kurir.",
      },
      order_status: {
        unpaid: "Menunggu Bayar",
        paid: "Sudah Dibayar",
        processed: "Diproses",
        roasting: "Dipanggang",
        shipped: "Dikirim",
        delivered: "Diterima",
        cancelled: "Dibatalkan",
      },
    },
    admin: {
      kanban: {
        title: "Papan Pesanan",
        columns: {
          unpaid: "Belum Bayar",
          paid: "Pesanan Baru",
          ready: "Siap Kirim",
          roasting: "Proses Roasting",
          shipped: "Sudah Dikirim",
        },
        actions: {
          confirm_payment: "Konfirmasi Bayar",
          generate_resi: "Buat Resi",
          accept: "Terima",
          reject: "Tolak",
          print_label: "Cetak Label",
          track: "Pantau Lokasi",
        }
      }
    },
    header: {
      promo: {
        freeShipping: "Gratis Ongkir",
        minPurchase: "Di atas Rp 500.000"
      },
      search: {
        placeholder: "Cari arsip kopi...",
        curated: "Koleksi Terkurasi",
        matchesFound: "Ditemukan",
        results: "Hasil",
        noMatch: "Tidak ada kopi yang sesuai dengan pencarian Anda.",
        examineAll: "Lihat Semua Hasil"
      },
      navMobile: {
        account: "Akun Saya",
        partnerHub: "Portal Mitra",
        adminPortal: "Portal Admin",
        login: "Masuk Akun",
        cart: "Keranjang Saya"
      }
    },
    spotlight: {
      ourCoffee: {
        title: "Koleksi Kopi",
        content: "Jelajahi hasil roasting terbaru dan single origin berstandar laboratorium kami. Setiap biji kopi diperlakukan secara unik."
      },
      wholesale: {
        title: "Kemitraan B2B",
        content: "Butuh suplai presisi untuk kafe Anda? Kami menyediakan profil roasting khusus dan harga grosir terukur."
      },
      subscription: {
        title: "Berlangganan",
        content: "Dapatkan pengiriman rutin untuk eksperimen roasting terbaru kami. Kopi segar dikirim sesuai jadwal Anda."
      },
      catalog: {
        title: "Laboratorium",
        content: "Ini adalah arsip lengkap kami. Setiap biji kopi di sini telah diprofilkan secara ilmiah untuk rasa yang maksimal."
      },
      tools: {
        title: "Filter Pencarian",
        content: "Gunakan alat ini untuk memfilter berdasarkan proses, asal, atau mengubah tata letak."
      },
      sort: {
        title: "Urutkan",
        content: "Urutkan berdasarkan harga atau produk unggulan untuk menemukan yang Anda butuhkan."
      },
      card: {
        title: "Data Spesimen",
        content: "Setiap kartu menampilkan asal, harga, dan catatan rasa. Klik untuk spesifikasi teknis lengkap."
      },
      buttons: {
        next: "Lanjut",
        gotIt: "Mengerti",
        quickTour: "Panduan Cepat"
      },
      cartPage: {
        title: "Keranjang Anda",
        content: "Tinjau spesimen pilihan Anda sebelum melanjutkan ke pembayaran."
      },
      addCart: {
        title: "Tambah ke Keranjang",
        content: "Klik tombol ini untuk memasukkan kopi ke keranjang belanja Anda. (Ini hanya tour, keranjang akan dikosongkan dan transaksi tidak terpaksa)."
      },
      openCart: {
        title: "Keranjang Anda",
        content: "Ini adalah ikon keranjang belanja Anda. Anda dapat menemukan semua pesanan Anda di sini."
      },
      checkoutBtn: {
        title: "Checkout",
        content: "Lanjut ke checkout. Jangan khawatir, transaksi ini tidak akan diproses."
      },
      addressSelection: {
        title: "Alamat Pengiriman",
        content: "Pilih atau tambahkan alamat pengiriman Anda di sini."
      },
      accountSaveHint: {
        content: "Untuk menyimpan alamat Anda secara permanen, Anda bisa mendaftar dan melihatnya di kanan atas sana."
      },
      checkout: {
        title: "Pembayaran Aman",
        content: "Isi detail pengiriman Anda dan pilih metode pembayaran di sini."
      },
      wholesalePage: {
        title: "Solusi B2B & Kemitraan",
        content: "Bergabunglah menjadi mitra kami dan dapatkan berbagai keuntungan: harga khusus grosir bertingkat, dukungan lab untuk profil roasting kustom, pelatihan barista, serta akses prioritas untuk koleksi eksperimental terbatas kami."
      },
      wholesaleJoin: {
        title: "Bergabung Sekarang",
        content: "Siap meningkatkan program kopi Anda? Klik di sini untuk memulai proses pendaftaran dan menjadi mitra kami."
      },
      wholesaleCalc: {
        title: "Kalkulator Kemitraan",
        content: "Hitung proyeksi penghematan bulanan Anda berdasarkan volume menggunakan kalkulator tier interaktif kami."
      },
      wholesaleSlider: {
        title: "Slider Volume",
        content: "Sesuaikan estimasi volume bulanan Anda di sini untuk melihat bagaimana itu memengaruhi tingkat kemitraan Anda."
      },
      wholesaleTier: {
        title: "Tingkat Kemitraan",
        content: "Proyeksi tingkat Anda, diskon lab, dan total penghematan akan diperbarui secara dinamis di sini."
      },
      wholesaleBenefits: {
        title: "Keuntungan Mitra",
        content: "Jelajahi enam pilar inti dari kemitraan B2B kami, dari kontrol kualitas hingga prioritas logistik."
      },
      wholesaleBenefitCard: {
        title: "Jaminan Kualitas",
        content: "Ini adalah salah satu dari enam janji inti kami. Setiap kemitraan hadir dengan jaminan keunggulan."
      },
      b2bRegHeader: {
        title: "Progres Pendaftaran",
        content: "Ikuti tiga langkah ini: pembuatan akun, pengaturan profil, dan finalisasi kontrak."
      },
      b2bRegForm: {
        title: "Formulir Kemitraan",
        content: "Isi detail Anda dan estimasi volume bulanan untuk membantu kami menyiapkan dashboard B2B kustom Anda."
      },
      b2bContractHeader: {
        title: "Protokol Kontrak",
        content: "Ini adalah langkah terakhir. Anda selalu dapat kembali ke halaman ini nanti jika butuh waktu untuk meninjau."
      },
      b2bContractDownload: {
        title: "Unduh Kontrak",
        content: "Klik di sini untuk mengunduh perjanjian kemitraan B2B kustom Anda."
      },
      b2bContractUpload: {
        title: "Unggah Salinan Bertanda Tangan",
        content: "Setelah ditandatangani, unggah dokumen di sini untuk mengaktifkan akses dashboard mitra Anda."
      },
      subHero: {
        title: "Siklus Laboratorium",
        content: "Selamat datang di layanan langganan eksklusif kami. Biarkan Master Roaster kami mengkurasi pengiriman bulanan Anda."
      },
      subMaster: {
        title: "Janji Master Roaster",
        content: "Setiap batch disangrai dengan teliti dan dijamin kualitasnya oleh Head Roaster kami, Mr. Yanotama."
      },
      subSteps: {
        title: "Cara Kerja",
        content: "Prosesnya sederhana: pilih paket Anda, tunggu proses roasting, dan nikmati pasokan bulanan Anda."
      },
      subPricing: {
        title: "Pilih Paket Anda",
        content: "Mulai dari 'The Discovery' hingga 'The Collector', pilih paket yang paling sesuai dengan perjalanan kopi Anda."
      },
      subCheckSaved: {
        title: "Alamat Tersimpan",
        content: "Pilih alamat dengan cepat dari profil Anda, atau atur alamat lainnya di dashboard akun."
      },
      subCheckForm: {
        title: "Detail Pengiriman",
        content: "Harap periksa dan lengkapi detail identitas penerima serta koordinat pengiriman Anda."
      },
      subCheckPriority: {
        title: "Pengiriman Prioritas",
        content: "Sebagai pelanggan, pesanan Anda otomatis mendapatkan rute pengiriman prioritas di hari pertama roasting."
      },
      subCheckSummary: {
        title: "Ringkasan Pesanan",
        content: "Tinjau paket langganan pilihan Anda. Perhatikan bahwa ongkos kirim sepenuhnya gratis."
      },
      subCheckPay: {
        title: "Selesaikan Berlangganan",
        content: "Klik di sini untuk melanjutkan ke pembayaran dan menyelesaikan langganan kopi Anda."
      },
      journalHero: {
        title: "Arsip Jurnal",
        content: "Baca eksperimen terbaru, laporan lapangan, dan pembaruan roastery kami."
      },
      journalSearch: {
        title: "Cari Catatan",
        content: "Mencari sesuatu yang spesifik? Cari melalui seluruh repositori artikel kami."
      },
      journalGrid: {
        title: "Kronik Utama",
        content: "Jelajahi cerita unggulan kami yang disajikan dalam tata letak buku tempel bertingkat."
      },
      journalExplore: {
        title: "Jelajahi Lebih Lanjut",
        content: "Geser melalui entri lama kami dan temukan sejarah di balik biji kopi kami."
      },
      storyPage: {
        title: "Manifesto Kami",
        content: "Pelajari tentang filosofi dan sejarah yang mendorong Fermion Roastery."
      },
      headerSearch: {
        title: "Pencarian Cepat",
        content: "Temukan biji kopi tertentu, asal, atau artikel jurnal secara instan."
      },
      headerLang: {
        title: "Ganti Bahasa",
        content: "Beralih antara Bahasa Inggris dan Bahasa Indonesia dengan mulus."
      },
      headerAccount: {
        title: "Akun Anda",
        content: "Kelola pesanan, langganan, dan pengaturan profil Anda."
      },
      headerCart: {
        title: "Keranjang Mini",
        content: "Lihat dengan cepat barang yang Anda tambahkan dan total harga."
      }
    },
    landing: {
      hero: {
        badge: "Roastery Kopi Eksklusif",
        title: "TERKURASI, DIPANGGANG, | DIHORMATI",
        subtitle: "Proses presisi untuk menghasilkan kopi yang tak terlupakan dan berkualitas tinggi.",
        description: "Roasting presisi dipadukan dengan hasrat artisan. Dibuat untuk pagi yang sempurna.",
        cta_primary: "Belanja Sekarang",
        cta_secondary: "Lihat Produk",
        stickers: { origin: "Asal", quality: "100% PRO" }
      },
      partnerRibbon: { placeholder: "Mitra Kafe" },
      series: {
        espresso: { title: "Seri Espresso.", subtitle: "Kaya • Kental • Berani", cta: "Jelajahi Biji Kopi Bold", sticker: "Siap Berpetualang" },
        filter: { title: "Seri Filter.", subtitle: "Bersih • Seperti Teh • Cerah", cta: "Jelajahi Biji Kopi Cerah", sticker: "Ramah Lingkungan" }
      },
      theWay: {
        titleMain: "Cara", titleSub: "Fermion.", description: "6 Pilar Kebahagiaan Ilmiah",
        pillars: [
          { id: "01", title: "Presisi", desc: "Kontrol ekstrem di setiap siklus suhu." },
          { id: "02", title: "Langsung", desc: "Sumber langsung dari perkebunan terbaik di Jawa." },
          { id: "03", title: "Sensori", desc: "Profil cangkir yang dinilai secara matematis." },
          { id: "04", title: "Kemasan Ramah", desc: "Hanya menggunakan bahan yang dapat dikomposkan." },
          { id: "05", title: "Artisan", desc: "Dicampur untuk kompleksitas dan kebahagiaan." },
          { id: "06", title: "Pelacakan", desc: "Data real-time dari mesin roasting ke pintu Anda." }
        ],
        stickers: { lab: "Lab Sains", map: "Peta Kebahagiaan" }
      },
      labRecords: {
        title: "Catatan Lab.", subtitle: "Data QC Real-time", ctaExplore: "Jelajahi Laboratorium",
        cardTitle: "Kurva Roasting Sumedang", cardAnalysis: "Analisis: 92 Poin →",
        ctaDiveTitle: "Selami data kami lebih dalam.", ctaDiveDesc: "Buka spesifikasi teknis untuk setiap panen.", ctaDiveBtn: "Jelajahi Semua Catatan"
      },
      newReleases: {
        title: "Rilis Terbaru.", subtitle: "Langsung dari nampan pendingin",
        cta: "Tambah ke Keranjang"
      },
      faq: {
        title: "Pertanyaan yang Sering Diajukan",
      },
      contact: {
        title: "Hubungi Kami",
        name: "Nama Lengkap",
        email: "Alamat Email",
        message: "Pesan Anda",
        submit: "Kirim Pesan",
      },
      footer: {
        titleMain: "Fermion", titleSub: "Roastery.",
        navTitle: "Navigasi", copyright: "© 2026 Fermion. Diciptakan untuk Kebahagiaan.", signature: "TETAP BAHAGIA!",
        socials: ["Instagram", "YouTube", "WhatsApp"]
      }
    },
    catalog: {
      badge: "Katalog Ritel",
      titleMain: "Kopi Kami",
      titleSub: "Koleksi.",
      description: "Jelajahi koleksi biji kopi yang dipanggang secara presisi, dikurasi dari ketinggian terbaik.",
      tools: "Alat Katalog",
      bestSeller: "TERLARIS",
      batchRecord: "Catatan Batch",
      perWeight: "Rp / 250G",
      addToCart: "Tambah ke Keranjang",
      emptyStateTitle: "Spesimen Tidak Ditemukan",
      emptyStateDesc: "Kami tidak dapat menemukan kopi yang sesuai dengan filter Anda. Cobalah memilih proses atau kategori yang berbeda.",
      emptyStateReset: "Reset Filter"
    },
    productDetail: {
      returnToCatalogue: "Kembali ke Katalog",
      specimenRecord: "Rekaman Spesimen v.01",
      score: "Skor",
      extractionProtocol: "Protokol Ekstraksi",
      brewingGuide: "Panduan Seduh",
      forEspresso: "UNTUK ESPRESSO",
      withMilk: "DENGAN SUSU",
      dose: "DOSIS",
      yield: "HASIL",
      time: "WAKTU",
      ratio: "RASIO",
      authenticRecord: "Catatan Otentik",
      valuation: "Valuasi",
      specimenAnalysis: "Analisis Spesimen",
      originsProcessing: "Asal & Proses",
      origin: "Asal",
      process: "Proses",
      altitude: "Ketinggian",
      selectQuantity: "Pilih Jumlah",
      packaging: "Kemasan",
      preparation: "Persiapan",
      addToOrder: "Tambah Pesanan",
      initiateCheckout: "Mulai Pembayaran",
      labSuggestions: "Saran Laboratorium",
      completeArchive: "Lengkapi Koleksi.",
      browseFullCollection: "Jelajahi Semua Koleksi",
      analyzingBatch: "Menganalisis Catatan Batch...",
      productNotFound: "Produk tidak ditemukan",
      returnToArchive: "Kembali ke Arsip",
      fermentation: "Fermentasi",
      sweetness: "Kemanisan",
      acidity: "Keasaman",
      body: "Bodi"
    },
    wholesale: {
      heroBadge: "Kemitraan B2B",
      heroTitle1: "Tingkatkan",
      heroTitle2: "Bisnis Anda.",
      heroDesc: "Solusi kopi hulu-ke-hilir untuk bisnis yang mengutamakan kualitas, konsistensi, dan cerita di balik setiap biji.",
      joinHub: "Gabung ke Partner Hub",
      dedicated: "Fasilitas",
      facility: "Khusus.",
      centralizedOps: "Pusat Operasional Roastery",
      trusted: "Mitra",
      partner: "Terpercaya.",
      est: "Est. 2026",
      ecoTest: "Uji Kelayakan Ekonomi",
      growthEngine: "Mesin Pertumbuhan Anda.",
      monthlyVol: "Volume Spesimen Bulanan",
      min: "MIN 10 KG",
      scale: "SKALA 200+ KG",
      currentTier: "Tingkat Alokasi Saat Ini",
      bronze: "Mitra Perunggu",
      silver: "Mitra Perak",
      gold: "Mitra Emas",
      labDiscount: "Diskon Laboratorium",
      projectedSavings: "Proyeksi Penghematan",
      perMo: "BLN",
      whyPartner: "Mengapa Bermitra?",
      confidential: "Rahasia",
      initialize: "Mulai",
      onboarding: "Proses Orientasi.",
      ctaDesc: "Otomatiskan kemitraan Anda. Isi formulir, unduh kontrak lab Anda, dan aktifkan akses grosir Anda secara instan.",
      beginRegistration: "Mulai Pendaftaran",
      benefits: {
        qualityTitle: "Jaminan Kualitas",
        qualityDesc: "Setiap batch dipanggang dengan standar kontrol kualitas yang ketat.",
        customTitle: "Roast Khusus",
        customDesc: "Sesuaikan profil sangrai untuk mencocokkan karakter unik brand cafe Anda.",
        tieredTitle: "Harga Bertingkat",
        tieredDesc: "Dapatkan harga yang semakin kompetitif seiring bertambahnya volume Anda.",
        logisticsTitle: "Logistik Andal",
        logisticsDesc: "Pengiriman terjadwal untuk memastikan stok Anda tidak pernah kosong.",
        sourcingTitle: "Pengadaan Langsung",
        sourcingDesc: "Akses langsung ke kebun kopi terbaik di seluruh nusantara.",
        supportTitle: "Dukungan Mitra",
        supportDesc: "Konsultasi menu dan kalibrasi rutin dari tim roaster ahli kami."
      }
    },
    subscription: {
      badge: "Klub Berlangganan Eksklusif",
      heroTitle1: "Tak perlu memilih.",
      heroTitle2: "Biarkan Master yang menentukan.",
      heroDesc: "Buka akses ke kopi terbaik dari laboratorium kami. Pilihan kurasi dikirim otomatis, tepat ketika jiwa Anda paling membutuhkannya.",
      labAccess: "#AKSES-LAB",
      sensoryExpert: "AHLI SENSORI",
      quote: "\"Saya mencicipi lebih dari 50 cangkir sehari. Kotak Berlangganan ini adalah tempat saya menaruh 2 cangkir yang membuat saya tersenyum.\"",
      headRoaster: "Kepala Roaster & Q-Grader",
      stepsBadge: "Langkah Berlangganan",
      stepsTitle: "Siklus Laboratorium.",
      step1Title: "Pilih Vibe",
      step1Desc: "Pilih paket yang sesuai dengan kebutuhan kafein Anda. Dari penemuan hingga kolektor.",
      step2Title: "Kurasi Lab",
      step2Desc: "Kami memilih biji kopi terbaik yang dipanggang minggu itu khusus untuk Anda.",
      step3Title: "Keajaiban di Pintu",
      step3Desc: "Baru dipanggang. Diistirahatkan dengan presisi. Dikirim saat rasanya paling enak.",
      mastersPick: "PILIHAN MASTER",
      perMonth: "/Bln",
      subscribeNow: "Mulai Langganan",
      loginRequired: "Silakan masuk terlebih dahulu untuk memulai langganan."
    },
    ourStory: {
      badge: "Manifesto Roastery",
      title1: "Jembatan",
      title2: "Rasa.",
      desc1: "Kami hadir untuk menghubungkan tangan yang menanam kopi dengan tangan yang menyeduhnya. Peran kami sederhana namun penting: menjadi jembatan rasa antara produsen dan peminum kopi.",
      desc2: "Ada niat baik, karakter unik, dan nilai intrinsik di dalam setiap biji kopi. Adalah tugas suci kami untuk memastikan nilai-nilai tersebut tetap utuh dari kebun hingga ke cangkir.",
      est: "#EST-2018",
      garage: "HARI-HARI GARASI",
      philCategory1: "SANG PRODUSEN",
      philTitle1: "Menghormati Asal-Usul.",
      philDesc1: "Kami mengambil bahan langsung dari petani yang berdedikasi. Setiap ceri membawa kerja keras mereka dan terroir unik yang wajib kami lindungi dan soroti melalui profiling yang hati-hati.",
      philCategory2: "SANG PEMINUM",
      philTitle2: "Menyampaikan Nilai.",
      philDesc2: "Melalui presisi ilmiah dan kalibrasi sensori, kami memastikan kebaikan asli dan profil rasa yang unik sampai ke rutinitas pagi Anda dengan utuh.",
      galleryBadge: "Bukti Visual",
      galleryTitle: "Di sinilah keajaiban terjadi.",
      galleryItem1Title: "Mesin",
      galleryItem1Text: "Sang Probat",
      galleryItem2Title: "Lulus QC",
      galleryItem2Text: "Cek Kualitas",
      galleryItem3Title: "Kemas Tangan",
      galleryItem3Text: "Catatan Akhir",
      manifestoQuote: "\"Tugas kami adalah sebagai jembatan rasa antara producer dan coffee drinker. Ada hal baik, rasa yang unik dan value yang tidak boleh putus.\"",
      manifestoSign: "— The Fermion Manifesto"
    },
    admin: {
      loading: "Mengakses Pusat Kendali...",
      overviewTitle: "Ringkasan Operasional.",
      overviewDesc: "Intelijen real-time untuk operasional Fermion Roastery.",
      days7: "7 Hari",
      days30: "30 Hari",
      custom: "Kustom",
      reportRange: "Pilih Rentang Laporan",
      applyFilter: "Terapkan Filter",
      criticalAlert: "PERINGATAN_KRITIS",
      inactiveCompany: "Tidak Aktif.",
      daysSinceLastOrder: "Hari sejak pesanan terakhir.",
      noOrderHistory: "Belum ada riwayat pesanan terdeteksi.",
      contactWa: "Hubungi via WA",
      totalRevenue: "Total Pendapatan",
      volumeFlow: "Arus Volume",
      activePartner: "Partner Aktif",
      needsReview: "Butuh Review",
      thisPeriod: "Periode Ini",
      logistics: "Logistik",
      stability: "Stabilitas",
      urgent: "Urgen",
      revenueAnalysis: "Analisa Arus Pendapatan",
      financialPerformance: "Performa Keuangan Berdasarkan Rentang Waktu",
      labAnalysis: "Analisa Laboratorium.",
      labDescPart1: "Produk terlaris saat ini adalah",
      labDescPart2: ". Pertimbangkan untuk memprioritaskan batch pemanggangan berikutnya untuk partner Tier Silver.",
      roastAccuracy: "Akurasi Pemanggangan",
      aiStrategyBtn: "Buat Strategi AI",
      comingSoonTitle: "Coming Soon.",
      comingSoonDesc: "Fitur Strategi AI sedang dikalibrasi di laboratorium kami. Nantikan kehadirannya!",
      okUnderstand: "Oke, Mengerti",
      revenue: "Pendapatan",
      selectFullRange: "Pilih rentang tanggal lengkap."
    }
  }
};

export const useI18n = () => {
  const { language } = useLangStore();
  return translations[language];
};
