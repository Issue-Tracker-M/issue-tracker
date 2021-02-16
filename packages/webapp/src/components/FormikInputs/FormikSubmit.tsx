import { Button, ButtonProps } from "@chakra-ui/react";
import { FormikErrors, useFormikContext } from "formik";
import React, { FC } from "react";

const anyErrors = (errors: FormikErrors<unknown>) => {
  return Object.values(errors).some(Boolean);
};

export const FormikSubmit: FC<Omit<ButtonProps, "type">> = (props) => {
  const { errors, dirty, isSubmitting } = useFormikContext();
  return (
    <Button
      isLoading={isSubmitting}
      type="submit"
      isDisabled={anyErrors(errors) || !dirty}
      {...props}
    />
  );
};
