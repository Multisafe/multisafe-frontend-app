export type TxDetails = {
  transactionHash: string;
  transactionId: string;
  createdOn: string;
  transactionFees: number;
  status: FixMe;
  transactionMode: number;
  paidTeammates?: FixMe[];
  tokenValue?: number;
  tokenCurrency?: string;
  fiatValue?: number;
  origin: number;
  notes: string;
};
