/**
 * Types aligned with `api.json` (Hospitality Event Search API).
 * Used for requests to NEXT_PUBLIC_HOSPITALITY_API_URL (or shared API URL).
 */

export type HospitalityTimeframe = '2_weeks' | '1_month' | '3_months' | 'custom';

export interface HospitalityEventSearchRequest {
  timeframe: HospitalityTimeframe;
  custom_days?: number | null;
  categories?: string[] | null;
}

export interface HospitalityToken {
  access_token: string;
  token_type: string;
}
