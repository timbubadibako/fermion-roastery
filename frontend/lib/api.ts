import { supabase } from "./supabase";

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;

  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;

    try {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      return data.access_token ?? data.session?.access_token ?? null;
    } catch {
      continue;
    }
  }

  return null;
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token || getStoredAccessToken();

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
};