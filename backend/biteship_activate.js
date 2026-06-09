import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

const API_KEY = process.env.BITESHIP_API_KEY;

if (!API_KEY) {
  console.error('❌ ERROR: BITESHIP_API_KEY is not set in backend/.env');
  process.exit(1);
}

const BITESHIP_URL = 'https://api.biteship.com/v1';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

const payload = {
  shipper_contact_name: "Fermion Roastery",
  shipper_contact_phone: "081234567890",
  shipper_contact_email: "hello@fermion.com",
  shipper_organization: "Fermion Roastery",
  origin_contact_name: "Fermion Roastery",
  origin_contact_phone: "081234567890",
  origin_address: "Jl. Kesambi No. 202, Cirebon",
  origin_note: "Pick up at the front desk",
  origin_postal_code: "45133",
  origin_coordinate: {
    latitude: -6.7320,
    longitude: 108.5523
  },
  destination_contact_name: "Biteship Reviewer",
  destination_contact_phone: "081234567891",
  destination_contact_email: "test@biteship.com",
  destination_address: "Kebayoran Baru, Jakarta Selatan",
  destination_postal_code: "12110",
  destination_note: "Leave at security",
  destination_coordinate: {
    latitude: -6.2415,
    longitude: 106.8048
  },
  courier_company: "jne",
  courier_type: "reg",
  delivery_type: "now",
  order_note: "Please handle with care",
  metadata: {},
  items: [
    {
      name: "Test Arabica Coffee Beans 250g",
      description: "Coffee beans for testing",
      value: 150000,
      quantity: 1,
      weight: 300
    }
  ]
};

async function generateTestOrders() {
  try {
    console.log('🚀 Generating Order 1 (For Delivered)...');
    const order1Res = await axios.post(`${BITESHIP_URL}/orders`, payload, { headers });
    const order1Id = order1Res.data.id;
    console.log(`✅ Order 1 Created: ${order1Id}`);

    console.log('🚀 Generating Order 2 (For Cancelled)...');
    const order2Res = await axios.post(`${BITESHIP_URL}/orders`, payload, { headers });
    const order2Id = order2Res.data.id;
    console.log(`✅ Order 2 Created: ${order2Id}`);

    console.log('\n🎉 SUCCESS! Here are your Order IDs:');
    console.log('----------------------------------------------------');
    console.log(`Order 1: ${order1Id}`);
    console.log(`Order 2: ${order2Id}`);
    console.log('----------------------------------------------------');
    console.log('⚠️ IMPORTANT NEXT STEP:');
    console.log('1. Buka dashboard Biteship kamu (https://dashboard.biteship.com/orders)');
    console.log('2. Buka pesanan pertama, lalu klik tombol "Simulasikan Status" / "Test Tracking" ke DELIVERED.');
    console.log('3. Buka pesanan kedua, lalu ubah statusnya ke CANCELLED.');
    console.log('4. Copy ID pesanan tersebut dan paste ke form Aktivasi.');

  } catch (error) {
    console.error('❌ Failed to generate test orders:');
    console.error(error.response?.data?.error || error.message);
  }
}

generateTestOrders();
