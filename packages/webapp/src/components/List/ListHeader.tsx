import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  UseEditableProps,
} from "@chakra-ui/react";
import React from "react";
import { FC } from "react";

const ListHeader: FC<{
  listName: string;
  onNameSubmit: UseEditableProps["onSubmit"];
}> = ({ listName, onNameSubmit }) => {
  return (
    <Box
      display="flex"
      flexDir="row"
      alignItems="center"
      justifyContent="space-between">
      <Editable
        defaultValue={listName}
        h="10"
        padding=".375rem .5rem .125rem"
        onSubmit={onNameSubmit}
        fontSize="sm"
        fontWeight="600">
        <EditablePreview as="p" display="block" />
        <EditableInput backgroundColor="white" />
      </Editable>
      <HamburgerIcon />
    </Box>
  );
};

export default React.memo(ListHeader);
