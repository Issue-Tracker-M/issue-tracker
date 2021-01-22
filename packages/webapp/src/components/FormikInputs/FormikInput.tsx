import React, { ChangeEvent } from 'react'
import { Field, FieldProps } from 'formik'
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputProps
} from '@chakra-ui/react'

interface IProps<T> extends InputProps {
  helperText?: string
  labelText: string
  formik_name: T
  type?: 'text' | 'tel' | 'password' | 'email' | 'url'
}

export default function FormikInput<
  F extends {
    [key: string]: any
  }
>({
  helperText,
  formik_name,
  labelText,
  type,
  isRequired,
  isDisabled,
  ...rest
}: IProps<keyof F>) {
  const helperTextId = `${formik_name}-helper-text`
  return (
    <Field name={formik_name}>
      {({
        field: { onChange, name, ...f },
        form: { errors, isSubmitting, validateField, setFieldTouched, touched },
        meta
      }: FieldProps<string, F>) => (
        <FormControl
          isInvalid={!!errors[name] && !!touched[name]}
          isRequired={isRequired}
          isDisabled={isDisabled || isSubmitting}
        >
          <FormLabel htmlFor={name}>{labelText}</FormLabel>
          <Input
            {...rest}
            {...f}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              event.preventDefault()
              onChange(event)
              setFieldTouched(name, true, false)
            }}
            type={type}
            id={name}
            aria-describedby={helperTextId}
          />
          {helperText && (
            <FormHelperText id={helperTextId}>{helperText}</FormHelperText>
          )}
          <FormErrorMessage>{errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  )
}
