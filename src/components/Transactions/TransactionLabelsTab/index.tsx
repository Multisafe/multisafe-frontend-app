import React, { useEffect } from "react";
import styled from "styled-components/macro";
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
import { selectLabels, selectLabelsLoading } from "store/multisig/selectors";
import Loading from "components/common/Loading";
import { ManagedLabel } from "./ManagedLabel";
import Img from "components/common/Img";
import NoTransactionLabels from "assets/icons/dashboard/empty/transaction-labels.svg";

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

const NoLabelsContainer = styled.div`
  padding: 8rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: #989898;
`;

export const TransactionLabelsTab = () => {
  const dispatch = useDispatch();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const labels = useSelector(selectLabels);
  const labelsLoading = useSelector(selectLabelsLoading);

  const { account: userAddress } = useActiveWeb3React();

  //@ts-ignore
  useInjectReducer({ key: MULTISIG_KEY, reducer: multisigReducer });
  //@ts-ignore
  useInjectSaga({ key: MULTISIG_KEY, saga: multisigSaga });

  useEffect(() => {
    dispatch(getLabels(safeAddress, userAddress));
  }, [dispatch, safeAddress, userAddress]);

  return (
    <PageContainer>
      <InfoCard>
        <div>
          <div className="title">Labels</div>
          <div className="subtitle">Manage transaction labels</div>
        </div>
        <AddEditLabel />
      </InfoCard>
      {labels?.length ? (
        <ListContainer>
          {labels.map((label: FixMe) => {
            return <ManagedLabel key={label.labelId} label={label} />;
          })}
        </ListContainer>
      ) : labelsLoading ? (
        <LoadingContainer>
          <Loading color="primary" width="3rem" height="3rem" />
        </LoadingContainer>
      ) : (
        <NoLabelsContainer>
          <Img src={NoTransactionLabels} alt="no-labels" width={100} />
          <div>No Labels</div>
        </NoLabelsContainer>
      )}
    </PageContainer>
  );
};
