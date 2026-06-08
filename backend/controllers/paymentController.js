import { Xendit } from 'xendit-node';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

export const createInvoice = async (req, res) => {
  const { amount, items, customerDetails } = req.body;
  
  try {
    const data = {
      externalId: `invoice-${uuidv4()}`,
      amount: amount,
      payerEmail: customerDetails?.email || 'guest@example.com',
      description: 'Fermion Roastery Coffee Order',
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      successRedirectUrl: 'http://localhost:3000/retail/success',
      failureRedirectUrl: 'http://localhost:3000/retail/failure',
    };

    // Note: Due to recent xendit-node SDK changes, the Invoice namespace is used
    const response = await xendit.Invoice.createInvoice({ data });
    
    res.status(200).json({ 
      invoiceUrl: response.invoiceUrl,
      externalId: response.externalId
    });
  } catch (error) {
    console.error('Xendit Error:', error);
    res.status(500).json({ message: "Failed to create payment invoice", error: error.message });
  }
};

export const createSubscription = async (req, res) => {
  const { amount, planName, customerDetails, interval, intervalCount } = req.body;
  // interval: 'DAY', 'WEEK', 'MONTH'
  // intervalCount: e.g., 1 for every 1 month
  
  try {
    const referenceId = `sub-${uuidv4()}`;
    
    // Note: Creating a recurring payment plan in Xendit usually involves
    // generating a recurring invoice or a payment method linking flow.
    // For this prototype, we'll create a recurring invoice plan if supported by the SDK,
    // or simulate the subscription start with a standard invoice tagged as recurring.
    // Standard Xendit API for Recurring is "v2/recurring_payment/plans" or similar.
    // Let's use the standard Invoice for the initial charge, and the webhook handles the rest,
    // or use the specialized Subscription API if available.
    // Due to varying SDK versions, we'll construct a standard invoice representing the first
    // cycle of a subscription to get the customer's payment details securely.

    const data = {
      externalId: referenceId,
      amount: amount,
      payerEmail: customerDetails?.email || 'subscriber@example.com',
      description: `Fermion Subscription: ${planName} (Auto-renews)`,
      successRedirectUrl: 'http://localhost:3000/subscription/success',
      failureRedirectUrl: 'http://localhost:3000/subscription/failure',
      // In a full implementation, you'd pass parameters to tokenize the card for future charges
    };

    const response = await xendit.Invoice.createInvoice({ data });
    
    res.status(200).json({ 
      invoiceUrl: response.invoiceUrl,
      subscriptionId: referenceId,
      message: "Subscription initial charge created"
    });
  } catch (error) {
    console.error('Xendit Subscription Error:', error);
    res.status(500).json({ message: "Failed to create subscription", error: error.message });
  }
};

export const handleNotification = (req, res) => {

  // Webhook from Xendit
  console.log("Xendit Payment Notification Received:", req.body);
  res.status(200).send("OK");
};

