import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { LayoutContainer, Main } from "./styles";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import layoutReducer from "store/layout/reducer";
import NotificationSidebar from "./NotificationSidebar";
import PeopleDetailsSidebar from "components/People/PeopleDetailsSidebar";
import { getTokenList } from "store/tokens/actions";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

const layoutKey = "layout";
const tokensKey = "tokens";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useInjectReducer({ key: layoutKey, reducer: layoutReducer });
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();

  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (safeAddress) dispatch(getTokenList(safeAddress));
  }, [dispatch, safeAddress]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <React.Fragment>
      <LayoutContainer>
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <Navbar isSidebarOpen={isSidebarOpen} openSidebar={openSidebar} />
        <Main>{children}</Main>
      </LayoutContainer>
      <NotificationSidebar />
      <PeopleDetailsSidebar />
    </React.Fragment>
  );
}
