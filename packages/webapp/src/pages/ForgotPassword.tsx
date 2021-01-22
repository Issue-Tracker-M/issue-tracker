import React from 'react'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import AuthFormWrapper from '../components/Form/AuthFormWrapper'
import Axios from 'axios'
import { baseUrl } from '../config'
import FormikInput from '../components/FormikInputs/FormikInput'
import { FormikSubmit } from '../components/FormikInputs/FormikSubmit'

const validationSchema = object().shape({
  email: string().label('Email').email().required()
})

export default function ForgotPassword() {
  return (
    <AuthFormWrapper title="Forgot password?">
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          Axios.post(`${baseUrl}/auth/forgot_password`, values)
            .then((res) => {
              console.log(res)
            })
            .catch(console.error)
            .finally(() => setSubmitting(false))
        }}
      >
        <Form>
          <FormikInput
            formik_name="email"
            labelText="Email"
            helperText="Password reset link will be sent to this email."
            type="email"
          />
          <FormikSubmit mt={4} colorScheme="teal">
            Submit
          </FormikSubmit>
        </Form>
      </Formik>
    </AuthFormWrapper>
  )
}
