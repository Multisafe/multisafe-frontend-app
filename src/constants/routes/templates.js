export const routeTemplates = {
  root: "/",
  login: "/",
  signup: "/signup",
  acceptInvite: "/accept-invite",
  delegateTransfer: "/delegate-transfer",

  dashboard: {
    root: "/dashboard",
    people: {
      root: "/dashboard/people",
    },
    department: {
      new: "/dashboard/department/new",
    },
    settings: "/dashboard/settings",
    transactions: "/dashboard/transactions",
    transactionById: "/dashboard/transactions/:transactionId",
    assets: "/dashboard/assets",
  },
};
