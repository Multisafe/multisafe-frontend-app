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
  tokenCurrencies?: string[];
  labels: Label[];
};

export type Label = {
  labelId: string;
  active: boolean;
  name: string;
  colorCode: string;
  description?: string;
  createdBy: string;
  updatedBy: string;
  createdOn: string;
  updatedOn: string;
};
