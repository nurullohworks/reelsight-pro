/**
 * Modular service layer.
 *
 * Every external capability (video analysis, account analysis, third-party
 * analytics, prediction, recommendations, reports) is behind an interface so a
 * provider can be swapped without touching the UI. The default implementation
 * is a mock provider used until real credentials are configured through:
 *
 *   SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_SECRET_KEY, AI_API_KEY,
 *   INSTAGRAM_API_ID / INSTAGRAM_API_SECRET, THIRD_PARTY_ANALYTICS_API_KEY
 *
 * Secrets are never read in the browser — a real provider must call a server
 * function that reads them inside its handler.
 */
export * from "./video-analysis";
export * from "./account-analysis";
export * from "./prediction";
export * from "./recommendations";
export * from "./report";
export * from "./third-party-analytics";
export * from "./livedune";
export * from "./meta-algorithm";

