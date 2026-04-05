import { eventsService as core } from './events';

/** Same as `eventsService` with `campaigns` alias for calendar hooks. */
export const eventsService = {
  ...core,
  campaigns: core.generateCampaigns,
};
