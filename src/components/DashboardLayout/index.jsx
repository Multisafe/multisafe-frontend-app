import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MaintenanceAlert from "components/common/MaintenanceAlert";
import PeopleDetailsSidebar from "components/People/PeopleDetailsSidebar";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import layoutReducer from "store/layout/reducer";
import { getTokenList, getTokens } from "store/tokens/actions";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import Navbar from "./Navbar";
import NotificationSidebar from "./NotificationSidebar";
import Sidebar from "./Sidebar";
import SwitchAccountSidebar from "./SwitchAccountSidebar";

import { differenceInSeconds } from "date-fns";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import { show } from "redux-modal";
import MigrateToV2 from "./MigrateToV2";
import MigrationInvitationModal, { MIGRATION_INVITATION_MODAL } from "./MigrationInvitationModal";
import { LayoutContainer, Main } from "./styles";

const layoutKey = "layout";
const tokensKey = "tokens";
const THREE_DAYS_IN_SECONDS =  3*24*60*60;

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { chainId } = useActiveWeb3React();

  useInjectReducer({ key: layoutKey, reducer: layoutReducer });
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (safeAddress) {
      dispatch(getTokenList(safeAddress));
      dispatch(getTokens(safeAddress, chainId));
    }
  }, [dispatch, safeAddress, chainId]);

  const [invitationLastShownTime, setInvitationLastShownTime] = useLocalStorage('invitationLastShownTime');

  useEffect(() => {

    setTimeout(() => {
      const currentDifference = differenceInSeconds(new Date(invitationLastShownTime), new Date());
      if((currentDifference  > THREE_DAYS_IN_SECONDS)){
  
        dispatch(show(MIGRATION_INVITATION_MODAL));
  
        setInvitationLastShownTime(Date.now())
    } else{
      dispatch(show(MIGRATION_INVITATION_MODAL));
      setInvitationLastShownTime(Date.now())


    }
    }, 2000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch,])

  useEffect(() => {

    setTimeout(() => {
    }, 2500)
  },[dispatch])

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <React.Fragment>
      <MigrateToV2 />
      <LayoutContainer>
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <Navbar isSidebarOpen={isSidebarOpen} openSidebar={openSidebar} />
        <Main>{children}</Main>
        <MaintenanceAlert />
      </LayoutContainer>
      <NotificationSidebar />
      <PeopleDetailsSidebar />
      <SwitchAccountSidebar />
      <MigrationInvitationModal />
    </React.Fragment>
  );
}

export default memo(DashboardLayout);
