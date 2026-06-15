export const strings = {
  id: {
    hero: {
      title: "CURATED, ROASTED, | REVERED",
      subtitle: "Proses presisi untuk menghasilkan kopi yang tak terlupakan dan berkualitas tinggi.",
      cta_primary: "Belanja Sekarang",
      cta_secondary: "Lihat Produk",
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
    b2b: {
      claim_silver: "Klaim Potongan Silver",
      progress: "Akumulasi Pembelian Bulan Ini",
      service_locked: "Fermion Service akan terbuka pada kontrak kedua",
    }
  },
  en: {
    hero: {
      title: "CURATED, ROASTED, | REVERED",
      subtitle: "Precision processes to produce unforgettable, high-quality coffee.",
      cta_primary: "Shop Now",
      cta_secondary: "View Products",
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
    b2b: {
      claim_silver: "Claim Silver Discount",
      progress: "Monthly Purchase Accumulation",
      service_locked: "Fermion Service will be unlocked on the second contract",
    }
  }
};

export type Language = 'id' | 'en';
export type StringKey = keyof typeof strings.id;
