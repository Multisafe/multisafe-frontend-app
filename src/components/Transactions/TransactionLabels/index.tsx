import React, { useEffect } from "react";
import styled from "styled-components";
import { InfoCard } from "components/People/styles";
import { AddEditLabel } from "./AddEditLabel";
import { useDispatch, useSelector } from "react-redux";
import { useActiveWeb3React } from "hooks";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { MULTISIG_KEY } from "store/multisig/constants";
import multisigReducer from "store/multisig/reducer";
import { useInjectSaga } from "utils/injectSaga";
import multisigSaga from "store/multisig/saga";
import { getLabels } from "store/multisig/actions";
import {
  selectLabels,
  selectLabelsLoading,
  selectLabelsError,
} from "store/multisig/selectors";
import Loading from "components/common/Loading";
import { ManagedLabel } from "./ManagedLabel";
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ListContainer = styled.div`
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
`;

export const TransactionLabels = () => {
  const dispatch = useDispatch();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const labels = useSelector(selectLabels);
  const labelsLoading = useSelector(selectLabelsLoading);
  const labelsError = useSelector(selectLabelsError);

  const { account: userAddress, chainId: networkId } = useActiveWeb3React();

  //@ts-ignore
  useInjectReducer({ key: MULTISIG_KEY, reducer: multisigReducer });
  //@ts-ignore
  useInjectSaga({ key: MULTISIG_KEY, saga: multisigSaga });

  useEffect(() => {
    dispatch(getLabels(networkId, safeAddress, userAddress));
  }, [dispatch, networkId, safeAddress, userAddress]);

  return (
    <PageContainer>
      <InfoCard>
        <div>
          <div className="title">Labels</div>
          <div className="subtitle">Manage transaction labels</div>
        </div>
        <AddEditLabel />
      </InfoCard>
      {labelsLoading ? (
        <LoadingContainer>
          <Loading color="primary" width="3rem" height="3rem" />
        </LoadingContainer>
      ) : null}
      <ListContainer>
        {labels?.length
          ? labels.map((label: FixMe) => {
              return <ManagedLabel key={label.labelId} label={label} />;
            })
          : null}
      </ListContainer>
    </PageContainer>
  );
};
