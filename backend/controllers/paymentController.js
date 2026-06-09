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
  
  try {
    const referenceId = `sub-${uuidv4()}`;
    const data = {
      externalId: referenceId,
      amount: amount,
      payerEmail: customerDetails?.email || 'subscriber@example.com',
      description: `Fermion Subscription: ${planName} (Auto-renews)`,
      successRedirectUrl: 'http://localhost:3000/subscription/success',
      failureRedirectUrl: 'http://localhost:3000/subscription/failure',
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
  console.log("Xendit Payment Notification Received:", req.body);
  res.status(200).send("OK");
};
