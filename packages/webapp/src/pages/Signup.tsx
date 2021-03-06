import React, { FC } from "react";
import { useHistory, Link as RouterLink, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import { object, string } from "yup";
import StringField from "../components/FormikInputs/FormikInput";
import AuthFormWrapper from "../components/Form/AuthFormWrapper";
import { FormikSubmit } from "../components/FormikInputs/FormikSubmit";
import { Box, Link, Text, useToast } from "@chakra-ui/react";
import Axios from "axios";
import { baseUrl } from "../config";
import { FormLayout } from "../components/Layout/FormLayout";

const validationSchema = object().shape({
  first_name: string().label("First Name").required(),
  last_name: string().label("Last Name").required(),
  email: string().label("Email").email().required(),
  password: string()
    .label("Password")
    .required("Please enter a password")
    .min(8, "At least 8 characters")
    .max(64, "Too long."),
  confirmPassword: string()
    .required("Please confirm your password")
    .label("Confirm Password")
    .test("passwords-match", "Password do not match", function (value) {
      return this.parent.password === value;
    }),
});
const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp: FC = () => {
  const history = useHistory();
  const location = useLocation<{ referrer: Location } | undefined>();
  const toast = useToast();
  console.log(location);
  return (
    <FormLayout>
      <AuthFormWrapper title="Sign up">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={({ first_name, last_name, email, password }, actions) => {
            actions.setSubmitting(true);
            Axios.post(`${baseUrl}/auth/register`, {
              first_name,
              last_name,
              email,
              password,
            })
              .then(() => {
                history.push(
                  location.state?.referrer ? location.pathname : "/"
                );
                toast({
                  title: "Account created!",
                  description: `We've sent a confirmation email to ${email}. If you dont confirm your email, your account will be disabled in a week.`,
                  status: "success",
                  duration: 15000,
                  isClosable: true,
                });
              })
              .catch((e) => console.error(e))
              .finally(() => actions.setSubmitting(false));
          }}>
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}>
            <StringField
              formik_name="first_name"
              labelText="First Name"
              type="text"
              placeholder="First Name"
              isRequired
            />
            <StringField
              formik_name="last_name"
              labelText="Last Name"
              type="text"
              placeholder="Last Name"
              isRequired
            />
            <StringField
              formik_name="email"
              labelText="Email"
              type="email"
              placeholder="Email"
              isRequired
            />
            <StringField
              formik_name="password"
              labelText="Password"
              type="password"
              placeholder="Password"
              isRequired
            />
            <StringField
              formik_name="confirmPassword"
              labelText="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              isRequired
            />
            <FormikSubmit mt={4} colorScheme="teal">
              Sign Up
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
            Already a member?{" "}
            <Link
              color="teal.500"
              as={RouterLink}
              to={{
                pathname: "/login",
                state: { errors: null, completed: false },
              }}>
              Sign in
            </Link>
          </Text>
        </Box>
      </AuthFormWrapper>
    </FormLayout>
  );
};

export default SignUp;
