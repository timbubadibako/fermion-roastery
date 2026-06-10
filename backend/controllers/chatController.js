import Ably from 'ably';
import dotenv from 'dotenv';

dotenv.config();

const ably = new Ably.Rest(process.env.ABLY_API_KEY || 'MISSING_KEY');

export const getAblyToken = async (req, res) => {
  const { clientId } = req.query;
  
  if (!clientId) {
    return res.status(400).json({ message: "clientId is required" });
  }

  try {
    const tokenRequestData = await ably.auth.createTokenRequest({ clientId });
    res.status(200).json(tokenRequestData);
  } catch (error) {
    console.error('Ably Token Request Error:', error);
    res.status(500).json({ message: "Failed to create token request" });
  }
};
