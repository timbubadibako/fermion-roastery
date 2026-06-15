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
    }
  }
};

export const useI18n = (lang: Language = 'id') => {
  return translations[lang];
};
