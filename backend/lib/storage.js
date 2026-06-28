import { supabase } from './supabase.js';

const SUPABASE_STORAGE_PATTERN = /\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/;

export const buildStorageReference = (bucket, filePath) => `${bucket}:${filePath}`;

export const parseStorageReference = (value) => {
  if (!value || typeof value !== 'string') return null;

  if (value.includes(':') && !value.startsWith('http')) {
    const [bucket, ...rest] = value.split(':');
    const filePath = rest.join(':');
    if (bucket && filePath) {
      return { bucket, filePath };
    }
  }

  const matched = value.match(SUPABASE_STORAGE_PATTERN);
  if (matched) {
    return {
      bucket: matched[1],
      filePath: decodeURIComponent(matched[2].split('?')[0]),
    };
  }

  return null;
};

export const createSignedAssetUrl = async (reference, expiresIn = 60 * 60) => {
  const parsed = parseStorageReference(reference);
  if (!parsed) return reference;

  const { data, error } = await supabase.storage
    .from(parsed.bucket)
    .createSignedUrl(parsed.filePath, expiresIn);

  if (error || !data?.signedUrl) {
    return reference;
  }

  return data.signedUrl;
};

export const resolveSignedAssetUrls = async (items, key = 'image_url', expiresIn) =>
  Promise.all(
    items.map(async (item) => ({
      ...item,
      [key]: await createSignedAssetUrl(item[key], expiresIn),
      [`${key}_storage_path`]: item[key] || null,
    }))
  );
