export const testAccounts = {
  retail: {
    email: process.env.E2E_RETAIL_EMAIL || "",
    password: process.env.E2E_RETAIL_PASSWORD || "",
  },
  b2bApproved: {
    email: process.env.E2E_B2B_APPROVED_EMAIL || "",
    password: process.env.E2E_B2B_APPROVED_PASSWORD || "",
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL || "",
    password: process.env.E2E_ADMIN_PASSWORD || "",
  },
};

export const seededProducts = {
  retailSearchTerm: process.env.E2E_RETAIL_SEARCH || "sumedang",
};
