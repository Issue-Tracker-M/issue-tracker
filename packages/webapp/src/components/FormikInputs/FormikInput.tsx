import React, { ChangeEvent } from "react";
import { Field, FieldProps } from "formik";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  forwardRef,
  Input,
  PropsOf,
} from "@chakra-ui/react";

interface IProps extends PropsOf<typeof Input> {
  helperText?: string;
  labelText: string;
  formik_name: string;
  type?: "text" | "tel" | "password" | "email" | "url";
}

const FormikInput = forwardRef<IProps, "input">(
  (
    {
      helperText,
      formik_name,
      labelText,
      type,
      isRequired,
      isDisabled,
      ...rest
    },
    ref
  ) => {
    const helperTextId = `${formik_name}-helper-text`;
    return (
      <Field name={formik_name}>
        {({
          field: { onChange, name, ...f },
          form: { errors, isSubmitting, setFieldTouched, touched },
        }: FieldProps<string>) => (
          <FormControl
            isInvalid={!!errors[name] && !!touched[name]}
            isRequired={isRequired}
            isDisabled={isDisabled || isSubmitting}>
            <FormLabel htmlFor={name} fontSize="sm">
              {labelText}
            </FormLabel>
            <Input
              {...rest}
              {...f}
              ref={ref}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                onChange(event);
                setFieldTouched(name, true, false);
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
    );
  }
);

export default FormikInput;
