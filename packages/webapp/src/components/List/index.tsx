import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { FC, useRef, useEffect } from "react";
import { useCallback } from "react";
import { useEntity } from "../../hooks/useEntity";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import TaskPreview from "../Board/TaskPreview";
import ListHeader from "./ListHeader";
import { useSelector } from "react-redux";
import { Task } from "../../store/display/types";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import VerticalList from "@issue-tracker/components";
import { Formik } from "formik";
import StyledForm from "../FormikInputs/StyledForm";
import FormikInput from "../FormikInputs/FormikInput";
import { useState } from "react";
import { createTask } from "../../store/display/displaySlice";
import { useParams } from "react-router-dom";

const NewTaskForm: FC<{ listId: string; workspaceId: string }> = ({
  listId,
  workspaceId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useThunkDispatch();
  const openButtonRef = useRef<any>();
  const inputRef = useRef<any>();
  const [hasFocus, setHasFocus] = useState(false);
  useEffect(() => {
    if (hasFocus)
      isOpen ? inputRef.current?.focus() : openButtonRef.current?.focus();
  }, [hasFocus, isOpen]);
  return (
    <Box flex="0 0 auto" pt="2">
      {isOpen ? (
        <Formik
          initialValues={{ title: "" }}
          onSubmit={({ title }, actions) => {
            dispatch(
              createTask({ title, list: listId, workspace: workspaceId })
            ).finally(() => {
              actions.resetForm();
            });
          }}>
          <StyledForm w="100%">
            <FormikInput
              formik_name="title"
              labelText="Task title"
              bgColor="white"
              isRequired
              size="sm"
              rounded="sm"
              ref={inputRef}
            />
            <ButtonGroup size="sm" spacing="2" pt="2" pb="1">
              <Button type="submit" colorScheme="teal">
                Create
              </Button>
              <IconButton
                aria-label="Close form"
                icon={<CloseIcon />}
                onClick={onClose}
              />
            </ButtonGroup>
          </StyledForm>
        </Formik>
      ) : (
        <Button
          size="sm"
          rightIcon={<AddIcon />}
          variant="solid"
          w="100%"
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          onClick={onOpen}
          ref={openButtonRef}>
          Add another task
        </Button>
      )}
    </Box>
  );
};

export const List: FC<{ listId: string }> = ({ listId }) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const list = useEntity("lists", listId);
  const dispatch = useThunkDispatch();
  const submitListName = useCallback(
    (value) => {
      if (value === list?.name) return;
      dispatch({ type: "CHANGE_LIST" });
    },
    [dispatch, list?.name]
  );
  const filterText = useSelector((state) => state.workspaceDisplay.filterText);
  const filteredTasks = useSelector((state) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!filterText) return list!.tasks;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return list!.tasks.filter((id) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const task = state.tasks.entities[id] as Task;
      return (
        task.title.includes(filterText) ||
        task.description?.includes(filterText)
      );
    });
  });
  if (!list) return <Heading>Couldn't find the given list entity!</Heading>;

  return (
    <VerticalList>
      <ListHeader listName={list.name} onNameSubmit={submitListName} />
      <Box w="100%" flex="1 1 auto" overflowY="auto" overflowX="hidden">
        {filteredTasks.map((taskId) => (
          <TaskPreview taskId={taskId} stage={list.name} key={taskId} />
        ))}
      </Box>
      <NewTaskForm listId={list._id} workspaceId={workspaceId} />
    </VerticalList>
  );
};

export default List;
