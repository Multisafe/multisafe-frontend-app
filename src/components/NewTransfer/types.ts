import { Receivers } from "components/TransactionDetails/types";

export type Batch = {
  token: any;
  receivers: Receivers;
  departmentName?: string;
  isDisabled?: boolean;
};

export type Batches = Array<Batch>;
