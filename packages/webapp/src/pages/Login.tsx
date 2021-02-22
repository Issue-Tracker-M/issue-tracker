import React from "react";
import { Formik, Form } from "formik";
import {
  NavLink,
  useHistory,
  useLocation,
  Link as RouterLink,
} from "react-router-dom";
import { Box, Text, Link } from "@chakra-ui/react";
import { object, string } from "yup";
import AuthFormWrapper from "../components/Form/AuthFormWrapper";
import { useThunkDispatch } from "../hooks/useThunkDispatch";
import FormikInput from "../components/FormikInputs/FormikInput";
import { FormikSubmit } from "../components/FormikInputs/FormikSubmit";
import { loginCredentials } from "../store/user/types";
import { authenticate } from "../store/thunks";
import { FC } from "react";
import { FormLayout } from "../components/Layout/FormLayout";

const validationSchema = object().shape({
  email: string().label("email").required(),
  password: string()
    .label("password")
    .required()
    .min(8, "Seems a bit short...")
    .max(24, "Too long."),
});
const initialValues: loginCredentials = {
  email: "",
  password: "",
};

const Login: FC = () => {
  const dispatch = useThunkDispatch();
  const history = useHistory();
  const location = useLocation<{ referrer: Location } | undefined>();
  return (
    <FormLayout>
      <AuthFormWrapper title="Login">
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            let mounted = true;
            setSubmitting(true);
            dispatch(authenticate(values))
              .then(() => {
                history.push(
                  location.state?.referrer ? location.state?.referrer : `/home`
                );
                mounted = false;
              })
              .catch((err: unknown) => {
                console.log(err);
              })
              .finally(() => (mounted ? setSubmitting(false) : undefined));
          }}
          validationSchema={validationSchema}>
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              height: "100%",
            }}>
            <FormikInput
              formik_name="email"
              labelText="Email"
              placeholder="Email"
              isRequired
            />
            <FormikInput
              formik_name="password"
              labelText="Password"
              placeholder="Password"
              type="password"
              isRequired
            />
            <FormikSubmit mt={4} colorScheme="teal">
              Sign In
            </FormikSubmit>
          </Form>
        </Formik>
        <Box textAlign="center">
          <Link
            color="teal.500"
            as={RouterLink}
            to={{ pathname: "/forgot_password" }}>
            Forgot password?
          </Link>
          <Text>
            Not a member?{" "}
            <Link
              color="teal.500"
              as={RouterLink}
              to={{
                pathname: "/signup",
                state: { errors: null, completed: false },
              }}>
              Sign up
            </Link>
          </Text>
        </Box>
      </AuthFormWrapper>
    </FormLayout>
  );
};

export default Login;
