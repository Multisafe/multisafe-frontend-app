import { Receivers } from "components/TransactionDetails/types";

export interface Batch {
  token: any;
  receivers: Receivers;
  departmentName?: string;
  isDisabled?: boolean;
}

export interface Batches extends Array<Batch> {}
