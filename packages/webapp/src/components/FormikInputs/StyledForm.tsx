import { useFormikContext } from "formik";
import React, { FC } from "react";
import { chakra, PropsOf } from "@chakra-ui/react";

const chakraForm = chakra.form;

const StyledForm: FC<PropsOf<typeof chakraForm>> = (props) => {
  const { handleReset, handleSubmit } = useFormikContext();
  return (
    <chakra.form onReset={handleReset} onSubmit={handleSubmit} {...props} />
  );
};

export default StyledForm;
