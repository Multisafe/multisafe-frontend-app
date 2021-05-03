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
    people: {
      viewByDepartment: ({ departmentId }) =>
        generatePath(routeTemplates.dashboard.people.viewByDepartment, {
          departmentId,
        }),
    },
    transactionById: ({ transactionId }) =>
      generatePath(routeTemplates.dashboard.transactionById, {
        transactionId,
      }),
  },
};
