import React, { FC } from "react";
import { AppLayout } from "../components/Layout/AppLayout";
import Workspace from "../components/Workspace";

const Dashboard: FC = () => {
  return (
    <AppLayout>
      <Workspace />
    </AppLayout>
  );
};

export default Dashboard;
