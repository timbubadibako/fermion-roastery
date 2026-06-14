import Ably from 'ably';
import dotenv from 'dotenv';

dotenv.config();

const ABLY_API_KEY = process.env.ABLY_API_KEY;

let ably;
if (ABLY_API_KEY && ABLY_API_KEY !== 'MISSING_KEY') {
  ably = new Ably.Rest(ABLY_API_KEY);
}

export const publishEvent = async (channelName, eventName, data) => {
  if (!ably) {
    // Silent if not configured
    return;
  }

  try {
    const channel = ably.channels.get(channelName);
    await channel.publish(eventName, data);
    console.log(`📡 Ably Event Published: [${channelName}] ${eventName}`);
  } catch (error) {
    console.error(`❌ Ably Publish Error:`, error);
  }
};

export default ably;
