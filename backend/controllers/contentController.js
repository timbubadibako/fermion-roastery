import { query } from '../lib/db.js';

// 1. Get Site Config
export const getSiteConfig = (req, res) => {
  res.status(200).json({
    announcement: "Free shipping for orders above Rp 500.000! (Indonesia only)",
    brand: {
      name: "FERMION",
      tagline: "Curated, roasted, and revered.",
      subTagline: "Bringing happiness into your cup."
    },
    navigation: [
      { label: "OUR COFFEE", href: "/our-coffee" },
      { label: "WHOLESALE", href: "/wholesale" },
      { label: "SUBSCRIPTION", href: "/subscription" },
      { label: "JOURNAL", href: "/journal" },
      { label: "OUR STORY", href: "/our-story" },
    ],
    wholesale: {
      milestones: [
        { year: "2018", title: "The Garage Era", desc: "Started with a 1kg manual roaster in Cirebon." },
        { year: "2020", title: "Micro-Batch Lab", desc: "Built our first precision laboratory for sensory analysis." },
        { year: "2022", title: "Partner Network", desc: "Powering 20+ specialty cafes across West Java." },
        { year: "2024", title: "Tech Integration", desc: "Launching automated corporate supply & tracking systems." },
        { year: "2026", title: "Fermion 2.0", desc: "Engineered for global reliability and local impact." }
      ],
      benefits: [
        { title: "Tiered B2B Pricing", desc: "The more you grow, the less you pay." },
        { title: "Automated Invoicing", desc: "Download tax-ready invoices instantly." },
        { title: "Priority Fulfillment", desc: "First-row access to our roast schedule." },
        { title: "Roast-on-Demand", desc: "Specify your preferred roast profile." }
      ]
    }
  });
};

// 2. Get Latest Batches (for Lab Records)
export const getLatestBatches = async (req, res) => {
  try {
    const result = await query(`
      SELECT b.*, p.name as product_name, p.origin, p.process
      FROM batches b
      JOIN products p ON b.product_id = p.id
      ORDER BY b.roast_date DESC
      LIMIT 3
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching latest batches:', error);
    res.status(500).json({ message: "Failed to fetch batches" });
  }
};
