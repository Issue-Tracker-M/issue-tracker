import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import { Heading } from '@chakra-ui/react'
import StringField from '../components/FormikInputs/FormikInput'
import AuthFormWrapper from '../components/Form/AuthFormWrapper'
import Axios from 'axios'
import { baseUrl } from '../config'
import { useRouteMatch } from 'react-router-dom'
import { FormikSubmit } from '../components/FormikInputs/FormikSubmit'

const validationSchema = object().shape({
  password: string()
    .label('New Password')
    .required('Required')
    .min(8, 'At least 8 characters')
    .max(64, 'No more than 64 characters'),
  confirmPassword: string()
    .required('Required')
    .label('Confirm Password')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value
    })
})

export default function ResetPassword() {
  const {
    params: { token }
  } = useRouteMatch<{ token: string }>()
  const [state, setState] = useState<1 | 2 | 3>(3)

  switch (state) {
    case 1:
      return <Heading>Password successfully reset!</Heading>
    case 2:
      return <Heading>Failure :c</Heading>
    case 3:
    default:
      return (
        <AuthFormWrapper title="Forgot password?">
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              Axios.post(`${baseUrl}/auth/reset_password`, {
                ...values,
                token
              })
                .then(() => setState(1))
                .catch(() => setState(2))
                .finally(() => {
                  actions.setSubmitting(false)
                })
            }}
          >
            <Form>
              <StringField
                formik_name="password"
                labelText="Password"
                helperText="Enter your new password"
                type="password"
              />
              <StringField
                formik_name="confirmPassword"
                labelText="Confirm Password"
                helperText="Confirm new password."
                type="password"
              />
              <FormikSubmit mt={4} colorScheme="teal">
                Submit
              </FormikSubmit>
            </Form>
          </Formik>
        </AuthFormWrapper>
      )
  }
}
