export interface Receiver {
  name?: string;
  address: string;
  tokenValue: string | number;
  fiatValue?: string | number;
  departmentName?: string;
}

export interface Receivers extends Array<Receiver> {}

export interface PaidTeammate {
  id: number;
  batchName?: string;
  tokenName: string;
  receivers: Receivers;
  tokenTotal: string | number;
  count: number;
}

export interface PaidTeammates extends Array<PaidTeammate> {}
