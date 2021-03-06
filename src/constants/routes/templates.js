export const routeTemplates = {
  root: "/",
  login: "/",
  signup: "/signup",
  acceptInvite: "/accept-invite",
  delegateTransfer: "/delegate-transfer",
  adminStats: "/admin/stats",
  verifyUser: "/verify-user/:safeAddress",

  dashboard: {
    root: "/dashboard/:safeAddress",
    people: "/dashboard/:safeAddress/people",
    exchange: "/dashboard/:safeAddress/exchange",
    settings: "/dashboard/:safeAddress/settings",
    assets: "/dashboard/:safeAddress/assets",
    transactions: "/dashboard/:safeAddress/transactions",
    transactionById: "/dashboard/:safeAddress/transactions/:transactionId",
  },
};
