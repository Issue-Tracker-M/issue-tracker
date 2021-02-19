import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { changeFilterText } from "../../store/workspace/workspaceSlice";

const FilterInput: FC = () => {
  const dispatch = useThunkDispatch();
  const filterText = useSelector((state) => state.workspaceDisplay.filterText);

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
        value={filterText}
        onChange={(e) => dispatch(changeFilterText(e.target.value))}
      />
      <InputRightElement
        onClick={() => dispatch(changeFilterText(""))}
        children={
          filterText ? (
            <IconButton
              aria-label="Clear filter"
              size="sm"
              variant="ghost"
              icon={<CloseIcon />}
            />
          ) : null
        }
      />
    </InputGroup>
  );
};

export default FilterInput;
