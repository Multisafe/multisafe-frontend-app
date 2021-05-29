export const routeTemplates = {
  root: "/",
  login: "/",
  signup: "/signup",
  acceptInvite: "/accept-invite",
  delegateTransfer: "/delegate-transfer",

  dashboard: {
    root: "/dashboard/:safeAddress",
    people: "/dashboard/:safeAddress/people",
    settings: "/dashboard/:safeAddress/settings",
    assets: "/dashboard/:safeAddress/assets",
    transactions: "/dashboard/:safeAddress/transactions",
    transactionById: "/dashboard/:safeAddress/transactions/:transactionId",
  },
};
