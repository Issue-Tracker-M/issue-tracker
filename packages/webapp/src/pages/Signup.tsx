import React, { FC } from "react";
import { NavLink, useHistory, Link as RouterLink } from "react-router-dom";
import { Formik, Form } from "formik";
import { object, string } from "yup";
import StringField from "../components/FormikInputs/FormikInput";
import AuthFormWrapper from "../components/Form/AuthFormWrapper";
import { FormikSubmit } from "../components/FormikInputs/FormikSubmit";
import { Box, Link, Text } from "@chakra-ui/react";
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
  return (
    <FormLayout>
      <AuthFormWrapper title="Sign up">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            actions.setSubmitting(true);
            Axios.post(`${baseUrl}/auth/register`, {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              password: values.password,
            })
              .then(() => history.push("/dashboard"))
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
