import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  PropsOf,
} from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { changeFilterText } from "../../store/display/displaySlice";

const FilterInput: FC<PropsOf<typeof InputGroup>> = (props) => {
  const dispatch = useThunkDispatch();
  const filterText = useSelector((state) => state.workspaceDisplay.filterText);

  // Clear filter text on unmount
  useEffect(
    () => () => {
      dispatch(changeFilterText(""));
    },
    [dispatch]
  );
  return (
    <InputGroup size="sm" {...props}>
      <InputLeftElement children={<Search2Icon />} />
      <Input
        rounded={2}
        placeholder="Filter tasks"
        value={filterText}
        onChange={(e) => dispatch(changeFilterText(e.target.value))}
      />
      <InputRightElement
        children={
          filterText ? (
            <IconButton
              onClick={() => dispatch(changeFilterText(""))}
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
