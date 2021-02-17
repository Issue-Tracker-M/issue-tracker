import { Search2Icon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { changeFilterText } from "../../store/workspace/workspaceSlice";

const FilterInput: FC = () => {
  const dispatch = useThunkDispatch();

  useEffect(
    () => () => {
      dispatch(changeFilterText(""));
    },
    [dispatch]
  );
  return (
    <InputGroup maxW="20rem" w="calc(100% - 4rem)" mr={2} size="sm">
      <InputLeftElement children={<Search2Icon />} />
      <Input
        rounded={2}
        placeholder="Filter tasks"
        onChange={(e) => dispatch(changeFilterText(e.target.value))}
      />
    </InputGroup>
  );
};

export default FilterInput;
