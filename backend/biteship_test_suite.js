import axios from 'axios';
import dotenv from 'dotenv';

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

async function runBiteshipTests() {
  console.log('🚀 Starting Biteship Test Suite...\n');
  
  let orderId = null;

  try {
    // 1. Dapatkan Ongkir Testing (Rates API)
    console.log('📦 1. Testing Rates API (Cek Ongkir)...');
    const ratesPayload = {
      origin_area_id: "IDNP9JB279", // Cirebon area ID (example)
      destination_area_id: "IDNP11JB42", // Jakarta Selatan area ID (example)
      couriers: "jne,sicepat",
      items: [
        {
          name: "Coffee Beans",
          description: "Arabica 250g",
          value: 150000,
          length: 10,
          width: 10,
          height: 10,
          weight: 300,
          quantity: 1
        }
      ]
    };
    
    // Note: We use the postal code/coordinate based rate checking to be safer if area IDs are wrong
    const ratesPostalPayload = {
      origin_postal_code: 45133,
      destination_postal_code: 12110,
      couriers: "jne,sicepat",
      items: [
         {
          name: "Coffee Beans",
          description: "Arabica 250g",
          value: 150000,
          length: 10,
          width: 10,
          height: 10,
          weight: 300,
          quantity: 1
        }
      ]
    };

    const ratesRes = await axios.post(`${BITESHIP_URL}/rates/couriers`, ratesPostalPayload, { headers });
    console.log(`✅ Rates API Success! Found ${ratesRes.data.pricing?.length || 0} courier options.\n`);

    // 2. Buat Pesanan Testing (Create Order API)
    console.log('📝 2. Testing Create Order API...');
    const orderPayload = {
      shipper_contact_name: "Fermion Roastery",
      shipper_contact_phone: "081234567890",
      shipper_contact_email: "hello@fermion.com",
      shipper_organization: "Fermion Roastery",
      origin_contact_name: "Fermion Roastery",
      origin_contact_phone: "081234567890",
      origin_address: "Jl. Kesambi No. 202, Cirebon",
      origin_note: "Pick up at the front desk",
      origin_postal_code: 45133,
      destination_contact_name: "Biteship Reviewer",
      destination_contact_phone: "081234567891",
      destination_contact_email: "test@biteship.com",
      destination_address: "Kebayoran Baru, Jakarta Selatan",
      destination_postal_code: 12110,
      destination_note: "Leave at security",
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

    const orderRes = await axios.post(`${BITESHIP_URL}/orders`, orderPayload, { headers });
    orderId = orderRes.data.id;
    console.log(`✅ Create Order Success! Order ID: ${orderId}\n`);

    // 3. Dapatkan Pesanan Testing (Get Order API)
    console.log('🔍 3. Testing Get Order API...');
    const getOrderRes = await axios.get(`${BITESHIP_URL}/orders/${orderId}`, { headers });
    console.log(`✅ Get Order Success! Order Status: ${getOrderRes.data.status}\n`);

    console.log('🎉 SELURUH TESTING API SELESAI!');
    console.log('----------------------------------------------------');
    console.log('⚠️ LANGKAH TERAKHIR (MANUAL DI DASHBOARD BITESHIP):');
    console.log('1. Buka halaman "Pesanan" di Dashboard Biteship kamu.');
    console.log(`2. Cari pesanan dengan ID: ${orderId}`);
    console.log('3. Di kolom "Aksi", klik "Update Status" / "Simulasi".');
    console.log('4. Ubah statusnya menjadi DELIVERED.');
    console.log('5. (Opsional) Jalankan ulang script ini dan kamu akan melihat status di Step 3 berubah jadi "delivered".');

  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error(error.response?.data?.error || error.message);
  }
}

runBiteshipTests();
