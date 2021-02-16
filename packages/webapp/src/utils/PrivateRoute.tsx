import { Center, Spinner } from "@chakra-ui/react";
import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Route,
  Redirect,
  RouteProps,
  useLocation,
  useHistory,
} from "react-router-dom";
import useAsyncThunk from "../hooks/useAsyncAction";
import { useThunkDispatch } from "../hooks/useThunkDispatch";
import { refreshAuthToken } from "../store/authSlice";

interface PrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: React.ComponentType<RouteProps>;
}

const Loading: FC = () => {
  return (
    <Center w="100vw" h="100vh">
      <Spinner size="xl" />
    </Center>
  );
};

const Refresh: FC = () => {
  // 1. User refreshes the page
  // 2. We try to refresh the JWT
  // 3. If succesfull => we need to resore the app state
  // 4. If unsuccessfull => remember the location we were at and redirect to login
  // 5. Once user has succesfully logged in => send the back to the location they were at
  const location = useLocation<{ referrer?: Location } | undefined>();
  const history = useHistory();
  console.log(history, history.action, history.location, document.cookie);
  const { loading, error } = useAsyncThunk(refreshAuthToken, undefined);
  // const dispatch = useThunkDispatch();
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   let mounted = true;
  //   dispatch(refreshAuthToken()).then(() => {
  //     if (mounted) setLoading(false);
  //   });
  //   return () => {
  //     mounted = false;
  //   };
  // }, [dispatch]);
  return loading ? (
    <Loading />
  ) : (
    <Redirect
      to={
        error
          ? {
              pathname: "/login",
              state: { referrer: location },
            }
          : location
      }
    />
  );
};

const PrivateRoute: FC<PrivateRouteProps> = (props) => {
  const { component: Component, ...rest } = props;
  const hasToken = !!useSelector((state) => state.auth.token);
  return (
    <Route
      {...rest}
      render={(props) => (hasToken ? <Component {...props} /> : <Refresh />)}
    />
  );
};

export default PrivateRoute;
