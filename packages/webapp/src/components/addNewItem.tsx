import React, { useState, FC } from "react";
import { Button } from "@chakra-ui/react";
import { NewItemForm } from "./Form/NewItemForm";

interface AddNewItemProps {
  onAdd(text: string): void;
  toggleButtonText: string;
  dark?: boolean;
}

export const AddNewitem: FC<AddNewItemProps> = (props) => {
  const [showForm, setShowForm] = useState(false);
  const { onAdd, toggleButtonText } = props;

  if (showForm) {
    return (
      <NewItemForm
        onAdd={(text) => {
          onAdd(text);
          setShowForm(false);
        }}
        setShowForm={setShowForm}
      />
    );
  }

  return <Button onClick={() => setShowForm(true)}>{toggleButtonText}</Button>;
};
