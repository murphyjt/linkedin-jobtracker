const KEY = "applied_companies";

export type EventType = 'Start' | 'End';

export const EventType = {
  Start: 'Start' as EventType,
  End: 'End' as EventType,
  Progress: 'Progress' as EventType,
};

export async function loadCompanies() {
  const container = await chrome.storage.local.get({[KEY]: []});
  return new Set<string>(container[KEY]);
}

export async function saveCompanies(companies: Set<string>) {
  await chrome.storage.local.set({[KEY]: Array.from(companies)});
}
