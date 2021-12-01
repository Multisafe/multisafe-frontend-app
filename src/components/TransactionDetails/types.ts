export type Receiver = {
  name?: string;
  address: string;
  tokenValue: string | number;
  fiatValue?: string | number;
  departmentName?: string;
};

export type Receivers = Array<Receiver>;

export type PaidTeammate = {
  id: number;
  batchName?: string;
  tokenName: string;
  receivers: Receivers;
  tokenTotal: string | number;
  count: number;
};

export type PaidTeammates = Array<PaidTeammate>;
