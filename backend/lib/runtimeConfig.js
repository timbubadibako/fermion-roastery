const required = (key) => {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const getAppUrl = () => required('APP_URL') || 'http://localhost:3000';

export const getBackendUrl = () => required('BACKEND_URL') || required('APP_URL') || 'http://localhost:3001';

export const getGatewayMode = (provider) => {
  const key = provider === 'xendit' ? 'XENDIT_MODE' : 'BITESHIP_MODE';
  const raw = required(key).toLowerCase();
  if (raw === 'production') return 'production';
  return 'sandbox';
};

export const getBiteshipOrigin = () => ({
  area_id: required('BITESHIP_ORIGIN_AREA_ID') || 'IDNP9IDNC105IDND151IDZ45131',
  postal_code: Number(required('BITESHIP_ORIGIN_POSTAL_CODE') || 45131),
});

export const getMailConfig = () => ({
  provider: required('MAIL_PROVIDER').toLowerCase() || 'smtp',
  fromEmail: required('MAIL_FROM_EMAIL') || 'hello@fermionroastery.com',
  fromName: required('MAIL_FROM_NAME') || 'Fermion Roastery',
});
