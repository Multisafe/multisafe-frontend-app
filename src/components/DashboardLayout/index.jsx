import React, { useState } from "react";

import { LayoutContainer, Main } from "./styles";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useInjectReducer } from "utils/injectReducer";
import layoutReducer from "store/layout/reducer";
import NotificationSidebar from "./NotificationSidebar";
import PeopleDetailsSidebar from "components/People/PeopleDetailsSidebar";

const layoutKey = "layout";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useInjectReducer({ key: layoutKey, reducer: layoutReducer });

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
