import { getAppUrl } from './runtimeConfig.js';
import { createGuestTrackingToken } from './trackingToken.js';

export const buildGuestTrackingUrl = (order) => {
  const token = createGuestTrackingToken({
    orderId: order.id,
    customerEmail: order.customer_email,
  });

  return `${getAppUrl()}/track/order?token=${encodeURIComponent(token)}`;
};

export const buildOrderPortalUrl = (order) => {
  if (!order.profile_id) {
    return buildGuestTrackingUrl(order);
  }

  if (order.type === 'b2b' || order.status === 'NET30' || order.status === 'PENDING_CASH') {
    return `${getAppUrl()}/b2b/ledger`;
  }

  return `${getAppUrl()}/account?tab=orders`;
};

export const buildOrderInvoiceUrl = (order) => {
  if (!order.profile_id) {
    const token = createGuestTrackingToken({
      orderId: order.id,
      customerEmail: order.customer_email,
    });

    return `${getAppUrl()}/api/orders/public/${encodeURIComponent(token)}/invoice`;
  }

  return `${getAppUrl()}/api/orders/${order.id}/invoice`;
};
