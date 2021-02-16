import { Center, Spinner } from "@chakra-ui/react";
import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, RouteProps, useLocation } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const dispatch = useThunkDispatch();
  const location = useLocation<{ referrer?: Location } | undefined>();
  useEffect(() => {
    let mounted = true;
    dispatch(refreshAuthToken()).then(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [dispatch]);
  return loading ? (
    <Loading />
  ) : (
    <Redirect
      to={
        location?.state?.referrer
          ? location
          : {
              pathname: "/login",
              state: { referrer: location },
            }
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
