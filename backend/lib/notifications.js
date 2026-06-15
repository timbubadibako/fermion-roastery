export const sendOrderNotification = async (orderId, customerName, email, phone) => {
  // In a real production environment, this would integrate with Twilio/Wablas or SendGrid
  console.log(`\n🔔 [NOTIFICATION TRIGGERED]`);
  console.log(`✉️ Sending Email to: ${email} -> "Thank you ${customerName}, your order #${orderId} is confirmed!"`);
  if (phone) {
    console.log(`📱 Sending WhatsApp to: ${phone} -> "Hi ${customerName}, your Fermion Roastery order is now being processed."`);
  }
  console.log(`------------------------------------------------\n`);
};
