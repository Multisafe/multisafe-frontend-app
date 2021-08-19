import { routeTemplates } from "./templates";

export function generatePath(template, params = {}) {
  if (!template) return template;
  let result = template || "";
  for (var key in params) {
    result = result.replace(`:${key}?`, params[key]);
    result = result.replace(`:${key}`, params[key]);
  }
  return result;
}

export const routeGenerators = {
  dashboard: {
    root: ({ safeAddress }) =>
      generatePath(routeTemplates.dashboard.root, { safeAddress }),
    people: ({ safeAddress }) =>
      generatePath(routeTemplates.dashboard.people, { safeAddress }),
    settings: ({ safeAddress }) =>
      generatePath(routeTemplates.dashboard.settings, { safeAddress }),
    assets: ({ safeAddress }) =>
      generatePath(routeTemplates.dashboard.assets, { safeAddress }),
    transactions: ({ safeAddress }) =>
      generatePath(routeTemplates.dashboard.transactions, { safeAddress }),
    transactionById: ({ safeAddress, transactionId }) =>
      generatePath(routeTemplates.dashboard.transactionById, {
        safeAddress,
        transactionId,
      }),
  },
};
