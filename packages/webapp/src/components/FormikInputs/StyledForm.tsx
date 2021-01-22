import { useFormikContext } from 'formik'
import React, { FC } from 'react'
import { chakra, HTMLChakraProps } from '@chakra-ui/react'

type IProps = HTMLChakraProps<'form'>

const StyledForm = (props: IProps) => {
  const { handleReset, handleSubmit } = useFormikContext()
  return (
    <chakra.form onReset={handleReset} onSubmit={handleSubmit} {...props} />
  )
}

export default StyledForm
