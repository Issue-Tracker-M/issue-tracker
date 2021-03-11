import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  UseEditableProps,
} from "@chakra-ui/react";
import React from "react";
import { FC } from "react";

const ListHeader: FC<{
  listName: string;
  onNameSubmit: UseEditableProps["onSubmit"];
}> = ({ listName, onNameSubmit }) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      flex="0 0 auto"
      borderBottom="1px solid gray">
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
    </HStack>
  );
};

export default React.memo(ListHeader);
