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

async function runDraftOrderTest() {
  console.log('🚀 Starting Biteship Draft Order Flow Test...\n');
  
  try {
    // 1. Create Draft Order (Without Courier)
    console.log('📝 1. Creating Draft Order (Initial)...');
    const draftPayload = {
      origin_contact_name: "Fermion Roastery",
      origin_contact_phone: "081234567890",
      origin_address: "Jl. Kesambi No. 202, Cirebon",
      origin_postal_code: 45133,
      destination_contact_name: "John Doe",
      destination_contact_phone: "088888888888",
      destination_address: "Kebayoran Baru, Jakarta Selatan",
      destination_postal_code: 12110,
      delivery_type: "now",
      items: [
        {
          name: "Arabica Gayo 250g",
          description: "Premium Coffee Beans",
          value: 125000,
          quantity: 1,
          weight: 300,
          length: 10,
          width: 10,
          height: 10
        }
      ]
    };

    const draftRes = await axios.post(`${BITESHIP_URL}/draft_orders`, draftPayload, { headers });
    const draftId = draftRes.data.id;
    console.log(`✅ Draft Created! ID: ${draftId}\n`);

    // 2. Retrieve Draft Rates (Simulate User choosing courier)
    console.log('📦 2. Retrieving Rates for Draft...');
    const ratesRes = await axios.get(`${BITESHIP_URL}/draft_orders/${draftId}/rates`, { headers });
    const availableCouriers = ratesRes.data.pricing;
    console.log(`✅ Found ${availableCouriers.length} courier options.`);
    
    // Pick first available courier for testing
    const selectedCourier = availableCouriers[0];
    console.log(`👉 User selected: ${selectedCourier.courier_name} (${selectedCourier.courier_service_name}) - Price: ${selectedCourier.price}\n`);

    // 3. Update Draft with Selected Courier
    console.log(`🛠️ 3. Updating Draft with courier: ${selectedCourier.courier_code}...`);
    await axios.post(`${BITESHIP_URL}/draft_orders/${draftId}`, {
      courier_company: selectedCourier.courier_code,
      courier_type: selectedCourier.courier_service_code
    }, { headers });
    console.log('✅ Draft updated and status is now "ready".\n');

    // 4. Confirm Draft Order (Finalize)
    console.log('🔔 4. Confirming Draft Order (Finalization)...');
    const confirmRes = await axios.post(`${BITESHIP_URL}/draft_orders/${draftId}/confirm`, {}, { headers });
    const orderId = confirmRes.data.id;
    const waybillId = confirmRes.data.courier.waybill_id;
    console.log(`✅ Order Confirmed!`);
    console.log(`🆔 Biteship Order ID: ${orderId}`);
    console.log(`📄 Waybill/Resi: ${waybillId}\n`);

    console.log('🎉 DRAFT ORDER FLOW TEST COMPLETED SUCCESSFULLY!');

  } catch (error) {
    console.error('❌ Draft Test Failed:');
    console.error(error.response?.data?.error || error.response?.data?.message || error.message);
  }
}

runDraftOrderTest();
