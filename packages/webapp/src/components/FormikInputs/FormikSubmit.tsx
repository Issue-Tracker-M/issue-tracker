import { Button, ButtonProps } from '@chakra-ui/react'
import { FormikErrors, useFormikContext } from 'formik'
import React from 'react'

type IProps = ButtonProps

const anyErrors = (errors: FormikErrors<unknown>) => {
  return Object.values(errors).some(Boolean)
}

export const FormikSubmit = <FormValues extends unknown>(
  props: Omit<IProps, 'type'>
) => {
  const { errors, dirty, isSubmitting } = useFormikContext<FormValues>()
  return (
    <Button
      isLoading={isSubmitting}
      type="submit"
      isDisabled={anyErrors(errors) || !dirty}
      {...props}
    />
  )
}
