import React from 'react'
import { Formik, Form } from 'formik'
import { NavLink, useHistory } from 'react-router-dom'
import { Box, Text } from '@chakra-ui/react'
import { object, string } from 'yup'
import AuthFormWrapper from '../components/Form/AuthFormWrapper'
import { useThunkDispatch } from '../hooks/useThunkDispatch'
import FormikInput from '../components/FormikInputs/FormikInput'
import { FormikSubmit } from '../components/FormikInputs/FormikSubmit'
import { loginCredentials } from '../store/user/types'
import { authenticate } from '../store/thunks'

const validationSchema = object().shape({
  credential: string().label('credential').required(),
  password: string()
    .label('password')
    .required()
    .min(8, 'Seems a bit short...')
    .max(24, 'Too long.')
})
const initialValues: loginCredentials = {
  credential: '',
  password: ''
}

const Login = () => {
  const dispatch = useThunkDispatch()
  const history = useHistory()
  return (
    <AuthFormWrapper title="Login">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          let mounted = true
          setSubmitting(true)
          dispatch(authenticate(values))
            .then(() => {
              history.push(`/dashboard`)
              mounted = false
            })
            .catch((err: unknown) => {
              console.log(err)
            })
            .finally(() => (mounted ? setSubmitting(false) : undefined))
        }}
        validationSchema={validationSchema}
      >
        <Form
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '100%'
          }}
        >
          <FormikInput
            formik_name="credential"
            labelText="Credential"
            placeholder="Username or Email"
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
        <Text>Forgot password</Text>
        <Text>
          Not a member?{' '}
          <NavLink
            to={{
              pathname: '/signup',
              state: { errors: null, completed: false }
            }}
          >
            Sign up
          </NavLink>
        </Text>
      </Box>
    </AuthFormWrapper>
  )
}

export default Login
