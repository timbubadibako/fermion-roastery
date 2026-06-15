# Biteship API Integration Guide - Fermion Roastery

## 📌 Overview
Biteship is a multi-carrier shipping aggregator that provides a single API for rate checking, shipment creation, and real-time tracking across major Indonesian couriers (JNE, SiCepat, J&T, etc.).

---

## 🛠️ API Flow
1. **Rates:** Check costs based on weight and destination.
2. **Draft Orders:** Create a temporary shipment record.
3. **Confirm Order:** Finalize the shipment and generate a Waybill (Resi).
4. **Tracking:** Monitor delivery status via Webhooks or Tracking URLs.

---

## 🚀 Key Endpoints

### 1. Order Management
- **Create Order (Draft):** `POST https://api.biteship.com/v1/orders`
- **Confirm Order:** `POST https://api.biteship.com/v1/orders/{order_id}/confirm`
- **Get Order Detail:** `GET https://api.biteship.com/v1/orders/{order_id}`

### 2. Required Fields for Items
Every item in the `items` array **MUST** include:
- `name`: Product name.
- `description`: Detailed description (required for insurance).
- `value`: Price per item (integer).
- `quantity`: Number of items (integer).
- `weight`: Weight in **grams** (integer).

---

## 📄 Shipping Labels
The shipping label is the document printed and attached to the package.
- **Availability:** Only generated after an order is **Confirmed**.
- **Retrieval:** Found in the `courier` object of the Order Detail response or Webhook payload.
- **URL Pattern:** `https://biteship.com/shipping-label/{order_id}` (Internal fallback) or the dynamic `label_url` provided by the API.

---

## 📡 Webhook Integration
Configure your endpoint to receive `POST` notifications for status changes.

### Sample Webhook Payload:
```json
{
  "event": "order.status",
  "order_id": "88264e3e-0941-4f59-8d70-32de0b830fd2",
  "status": "picked",
  "courier_tracking_id": "WAYBILL_12345",
  "label_url": "https://biteship.com/labels/...",
  "tracking_url": "https://biteship.com/track/..."
}
```

### Important Statuses:
| Status | Meaning |
| :--- | :--- |
| `pending` | Draft order created. |
| `confirmed` | Order accepted, resi generated. |
| `picked` | Package collected by courier. |
| `delivered` | Successfully reached the customer. |
| `canceled` | Order cancelled. |

---

## 📍 Tracking
Public tracking can be accessed without authentication:
- **Direct Link:** `https://biteship.com/track/{waybill_id}`
- **API Provided:** Always use the `tracking_url` from the response for the best user experience.

---

## 🧪 Sandbox vs Production
- **Sandbox:** `https://api.biteship.com/v1` (Use Sandbox API Key).
- **Production:** Same URL, switch to Production API Key.
- *Note:* In Sandbox, certain status changes (like `picked` or `delivered`) must be simulated via the Biteship Dashboard.
