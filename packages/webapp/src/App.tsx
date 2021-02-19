import React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { Route, Switch, useLocation } from "react-router-dom";
import "./App.css";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmEmail from "./pages/ConfirmEmail";
import ResetPassword from "./pages/ResetPassword";
import { Workspaces } from "./pages/Workspaces";
import Home from "./pages/Home";

// Utils
import PrivateRoute from "./utils/PrivateRoute";
import TaskView from "./components/Board/TaskView";
import { FC } from "react";
import { Invite } from "./pages/Invite";

const App: FC = () => {
  const location = useLocation<{
    background?: ReturnType<typeof useLocation>;
  }>();
  const background = location?.state?.background;
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Switch location={background || location}>
        <Route path="/login" component={Login} />
        <Route path="/signup/:invite_token" component={Signup} />
        <Route path="/signup" component={Signup} />
        <Route path="/home" component={Home} />
        <Route path="/invite/:invite_token" component={Invite} />
        <Route path="/forgot_password" component={ForgotPassword} />
        <Route path="/reset/:token" component={ResetPassword} />
        <Route path="/confirm/:token" component={ConfirmEmail} />
        <PrivateRoute path="/w/:workspaceId" component={Dashboard} />
        <PrivateRoute path="/w" component={Workspaces} />
        <Route component={PageNotFound} />
      </Switch>
      <PrivateRoute path="/t/:taskId" component={TaskView} />
    </ChakraProvider>
  );
};

export default App;
