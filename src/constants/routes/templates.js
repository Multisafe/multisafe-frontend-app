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
      new: "/dashboard/people/new",
      view: "/dashboard/people/view",
      viewByDepartment: "/dashboard/people/view/:departmentId",
      edit: "/dashboard/people/edit",
    },
    department: {
      new: "/dashboard/department/new",
    },
    payments: "/dashboard/payments",
    transactions: "/dashboard/transactions",
    transactionById: "/dashboard/transactions/:transactionId",
    quickTransfer: "/dashboard/quick-transfer",
    account: "/dashboard/account",
    owners: "/dashboard/invite",
    spendingLimits: {
      root: "/dashboard/spending-limits",
      new: "/spending-limits/new",
    },
  },
};
