import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState, FC } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { AppLayout } from "../components/Layout/AppLayout";
import Loading from "../components/Layout/Loading";
import { useThunkDispatch } from "../hooks/useThunkDispatch";
import { confirmEmail } from "../store/thunks";

export const ConfirmEmail: FC = () => {
  const history = useHistory();
  const dispatch = useThunkDispatch();
  const {
    params: { token },
  } = useRouteMatch<{ token: string }>();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dispatch(confirmEmail(token))
      .then(() => {
        history.push("/home");
        toast({
          title: "Email confirmed!",
          description: `Your account now will have additional features available to it!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch(console.error)
      .finally(() => (mounted ? setLoading(false) : null));
    return () => {
      mounted = false;
    };
  }, [dispatch, history, toast, token]);
  return <AppLayout>{loading ? <Loading /> : null}</AppLayout>;
};

export default ConfirmEmail;
