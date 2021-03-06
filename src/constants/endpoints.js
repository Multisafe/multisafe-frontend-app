import { networkNames } from "./networks";

export const ROOT_BE_URL = process.env.REACT_APP_BE_URL;

// REGISTER
export const registerEndpoint = `${ROOT_BE_URL}/api/v1/users/create`;
export const createMetaTxEndpoint = `${ROOT_BE_URL}/api/v1/users/create/meta-tx`;
export const getVerificationStatusEndpoint = `${ROOT_BE_URL}/api/v1/users/getVerificationStatus`;

// LOGIN
export const fetchSafesEndpoint = `${ROOT_BE_URL}/api/v1/users/fetch-safes`;
export const getSafesEndpoint = `${ROOT_BE_URL}/api/v1/users/get-safes`;
export const getParcelSafesEndpoint = `${ROOT_BE_URL}/api/v1/users/get-parcel-safes`;
export const getSafeOwnersEndpoint = `${ROOT_BE_URL}/api/v1/users/get-safe-owners`;
export const loginEndpoint = `${ROOT_BE_URL}/api/v1/users/login`;

// PEOPLE
export const getAllPeopleEndpoint = `${ROOT_BE_URL}/api/v1/people/get`;
export const createPeopleEndpoint = `${ROOT_BE_URL}/api/v1/people/create`;
export const createBulkPeopleEndpoint = `${ROOT_BE_URL}/api/v1/people/add-multiple`;
export const getPeopleByTeamIdEndpoint = `${ROOT_BE_URL}/api/v1/people/getByDepartment`;
export const editPeopleEndpoint = `${ROOT_BE_URL}/api/v1/people/update`;
export const deletePeopleEndpoint = `${ROOT_BE_URL}/api/v1/people/remove`;

// DEPARTMENT
export const createDepartmentEndpoint = `${ROOT_BE_URL}/api/v1/departments/create`;
export const getAllDepartmentsEndpoint = `${ROOT_BE_URL}/api/v1/departments/get`;
export const getDepartmentByIdEndpoint = `${ROOT_BE_URL}/api/v1/departments/getByDepartmentId`;
export const deleteDepartmentEndpoint = `${ROOT_BE_URL}/api/v1/departments/remove`;
export const updateDepartmentEndpoint = `${ROOT_BE_URL}/api/v1/departments/update`;

// TRANSACTIONS
export const createTransactionEndpoint = `${ROOT_BE_URL}/api/v1/transactions/create`;
export const getTransactionsEndpoint = `${ROOT_BE_URL}/api/v1/transactions/get`;
export const getTransactionByIdEndpoint = `${ROOT_BE_URL}/api/v1/transactions/getById`;
export const getMoneyInOutEndpoint = `${ROOT_BE_URL}/api/v1/transactions/getMoneyInMoneyOut`;

// MULTISIG
export const createMultisigTransactionEndpoint = `${ROOT_BE_URL}/api/v1/transactions/multisig/create`;
export const getMultisigTransactionEndpoint = `${ROOT_BE_URL}/api/v1/transactions/multisig/get`;
export const getMultisigTransactionByIdEndpoint = `${ROOT_BE_URL}/api/v1/transactions/multisig/getById`;
export const submitMultisigTransactionEndpoint = `${ROOT_BE_URL}/api/v1/transactions/multisig/submit`;
export const confirmMultisigTransactionEndpoint = `${ROOT_BE_URL}/api/v1/transactions/multisig/confirm`;

// COMMON TRANSACTIONS
export const createTransactionNote = `${ROOT_BE_URL}/api/v1/transactions/notes/create`;
export const updateTransactionNote = `${ROOT_BE_URL}/api/v1/transactions/notes/update`;

// METATX
export const getMetaTxLimitsEndpoint = `${ROOT_BE_URL}/api/v1/transactions/getMetaTxLimits`;

// INVITATION
export const getInvitationsEndpoint = `${ROOT_BE_URL}/api/v1/invitation/get`;
export const approveInvitationsEndpoint = `${ROOT_BE_URL}/api/v1/invitation/approve`;
export const acceptInvitationsEndpoint = `${ROOT_BE_URL}/api/v1/invitation/accept`;
export const createInvitationsEndpoint = `${ROOT_BE_URL}/api/v1/invitation/create`;

// TOKEN PRICES
export const getTokenPricesEndpoint = `${ROOT_BE_URL}/api/v1/tokenPrices/usd`;

// TOKENS
export const getTokensEndpoint = `${ROOT_BE_URL}/api/v1/tokens/get`;
export const addCustomTokenEndpoint = `${ROOT_BE_URL}/api/v1/tokens/add`;
export const getTokenListEndpoint = `${ROOT_BE_URL}/api/v1/tokens/getTokensList`;

// NOTIFICATIONS
export const getNotificationsEndpoint = `${ROOT_BE_URL}/api/v1/notifications/get`;
export const updateNotificationsEndpoint = `${ROOT_BE_URL}/api/v1/notifications/update`;

// SAFE
export const getSafeInfoEndpoint = `${ROOT_BE_URL}/api/v1/users/getSafeInfo`;
export const updateOwnerNameEndpoint = `${ROOT_BE_URL}/api/v1/users/updateOwnerDetails`;

// ORGANISATION
export const updateOrganisationNameEndpoint = `${ROOT_BE_URL}/api/v1/users/update/name`;
export const organisationPermissionsEndpoint = `${ROOT_BE_URL}/api/v1/users/permissions`;
export const portfolioHistoryEndpoint = `${ROOT_BE_URL}/api/v1/users/portfolio/history`;

// STATS
export const getAdminStatsEndpoint = `${ROOT_BE_URL}/api/v1/admin/stats/get`;

// GNOSIS
export const gnosisSafeTransactionEndpoint =
  process.env.REACT_APP_NETWORK_NAME === networkNames.MAINNET
    ? `https://safe-transaction.gnosis.io/api/v1/safes/`
    : `https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/`;
export const gnosisSafeTransactionV2Endpoint =
  process.env.REACT_APP_NETWORK_NAME === networkNames.MAINNET
    ? `https://safe-relay.gnosis.io/api/v2/safes/`
    : `https://safe-relay.rinkeby.gnosis.io/api/v2/safes/`;

// GAS PRICE
export const gasPriceEndpoint = `${ROOT_BE_URL}/api/v1/gasPrices`;
