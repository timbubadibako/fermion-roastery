import crypto from 'crypto';

const base64urlEncode = (value) => Buffer.from(value, 'utf8').toString('base64url');
const base64urlDecode = (value) => Buffer.from(value, 'base64url').toString('utf8');

const getTrackingSecret = () => process.env.ORDER_TRACKING_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'fermion-tracking-secret';

const signPayload = (payload) =>
  crypto
    .createHmac('sha256', getTrackingSecret())
    .update(payload)
    .digest('base64url');

export const createGuestTrackingToken = ({ orderId, customerEmail }) => {
  const payload = JSON.stringify({
    orderId,
    customerEmail: String(customerEmail || '').trim().toLowerCase(),
    issuedAt: new Date().toISOString(),
  });

  const encodedPayload = base64urlEncode(payload);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
};

export const verifyGuestTrackingToken = (token) => {
  if (!token || !String(token).includes('.')) {
    return { valid: false, reason: 'invalid_format' };
  }

  const [encodedPayload, signature] = String(token).split('.');
  const expectedSignature = signPayload(encodedPayload);

  if (
    !signature ||
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return { valid: false, reason: 'invalid_signature' };
  }

  try {
    const parsed = JSON.parse(base64urlDecode(encodedPayload));
    return {
      valid: true,
      payload: {
        orderId: parsed.orderId,
        customerEmail: String(parsed.customerEmail || '').trim().toLowerCase(),
        issuedAt: parsed.issuedAt,
      },
    };
  } catch {
    return { valid: false, reason: 'invalid_payload' };
  }
};
