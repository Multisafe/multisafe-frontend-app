import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Info, Container } from "./styles";
import { makeSelectOwnerName } from "store/global/selectors";

import { SideNavContext } from "context/SideNavContext";
import AccountCard from "./AccountCard";
import PaymentsCard from "./PaymentsCard";
import QuickTransferCard from "./QuickTransferCard";
import CompleteSetup from "./CompleteSetup";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import invitationSaga from "store/invitation/saga";
import invitationReducer from "store/invitation/reducer";
import { getInvitations } from "store/invitation/actions";
import {
  makeSelectLoading,
  makeSelectIsSetupComplete,
} from "store/invitation/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { Card } from "components/common/Card";
import Loading from "components/common/Loading";

const invitationKey = "invitation";

export default function Dashboard() {
  const [toggled] = useContext(SideNavContext);
  const ownerName = useSelector(makeSelectOwnerName());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const isSetupComplete = useSelector(makeSelectIsSetupComplete());
  const loadingSetupStatus = useSelector(makeSelectLoading());

  const dispatch = useDispatch();

  // Reducers
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });

  // Sagas
  useInjectSaga({ key: invitationKey, saga: invitationSaga });

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  return (
    <div
      className="position-relative"
      style={{
        transition: "all 0.25s linear",
        minHeight: "100vh",
      }}
    >
      <Info>
        <div
          style={{
            maxWidth: toggled ? "900px" : "1200px",
            transition: "all 0.25s linear",
          }}
          className="mx-auto"
        >
          <div className="title">Hey {ownerName},</div>
          <div className="subtitle">
            We have a few things for you to look at
          </div>
        </div>
      </Info>
      <Container
        style={{
          maxWidth: toggled ? "900px" : "1200px",
          transition: "all 0.25s linear",
        }}
      >
        <AccountCard />
        {loadingSetupStatus && (
          <div className="status">
            <Card
              className="p-4 d-flex justify-content-center align-items-center"
              style={{ width: "33em" }}
            >
              <Loading color="primary" width="50px" height="50px" />
            </Card>
          </div>
        )}
        {!loadingSetupStatus &&
          (isSetupComplete ? <QuickTransferCard /> : <CompleteSetup />)}
        <PaymentsCard />
      </Container>
    </div>
  );
}
