const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.fermionroastery.com";

export const siteUrl = configuredSiteUrl
  .replace(/^http:\/\//, "https://")
  .replace("https://fermionroastery.com", "https://www.fermionroastery.com")
  .replace(/\/$/, "");
