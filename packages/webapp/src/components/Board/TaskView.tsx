import {
  AddIcon,
  AtSignIcon,
  ChevronDownIcon,
  HamburgerIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { BsTextLeft } from "react-icons/bs";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { useThunkDispatch } from "../../hooks/useThunkDispatch";
import { fetchTask, patchTask } from "../../store/thunks";
import MemberSelect from "../MemberSelect";
import MemberPreview from "./MemberPreview";
import TaskDatePicker from "./DatePicker";
import TaskViewItem from "./TaskViewItem";
import CommentInput from "./CommentInput";
import CommentView from "./CommentView";
import { AiOutlineCreditCard } from "react-icons/ai";
import { useEntity } from "../../hooks/useEntity";
import { useHistory, useParams } from "react-router-dom";
import useAsyncThunk from "../../hooks/useAsyncAction";
import Loading from "../Layout/Loading";
import { ListSelect } from "./ListSelect";

const TaskView: FC = () => {
  const dispatch = useThunkDispatch();
  const { taskId } = useParams<{ taskId: string }>();
  const task = useEntity("tasks", taskId)!;
  const history = useHistory();

  const { loading, error } = useAsyncThunk(
    fetchTask,
    { taskId, workspaceId: task?.workspace },
    () => task && !task.loaded
  );

  return (
    <Drawer
      isOpen
      placement="right"
      onClose={history.goBack}
      size="lg"
      closeOnEsc>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        {loading ? (
          <Loading />
        ) : (
          <>
            <DrawerHeader
              display="flex"
              justifyContent="flex-start"
              alignItems="center">
              <AiOutlineCreditCard color="gray" />
              <Editable
                paddingLeft="1rem"
                defaultValue={task.title}
                onSubmit={(value) => {
                  if (value !== task.title)
                    dispatch(
                      patchTask({
                        current: task,
                        update: {
                          _id: task._id,
                          workspace: task.workspace,
                          title: value,
                        },
                      })
                    );
                }}>
                <EditablePreview />
                <EditableInput />
              </Editable>
            </DrawerHeader>
            <DrawerBody>
              {task.loaded ? (
                <>
                  <TaskViewItem
                    title="List"
                    icon={<AtSignIcon color="gray.500" />}>
                    <ListSelect task={task} />
                  </TaskViewItem>
                  <TaskViewItem
                    title="Members"
                    icon={<AtSignIcon color="gray.500" />}>
                    <Box display="flex">
                      <MemberPreview members={task.users} />
                      <MemberSelect
                        taskId={task._id}
                        as={IconButton}
                        icon={<AddIcon />}
                        borderRadius="50%"
                        size="sm"
                      />
                    </Box>
                  </TaskViewItem>
                  <TaskViewItem
                    title="Description"
                    icon={<BsTextLeft color="gray.500" />}>
                    <Editable
                      defaultValue={task.description || ""}
                      placeholder="Add a more detailed description..."
                      onSubmit={(value) => {
                        if (value !== task.description)
                          dispatch(
                            patchTask({
                              current: task,
                              update: {
                                _id: task._id,
                                workspace: task.workspace,
                                description: value,
                              },
                            })
                          );
                      }}>
                      <EditablePreview
                        as={Text}
                        backgroundColor="gray.100"
                        padding=".5rem"
                        minH="100px"
                        width="100%"
                        wordBreak="normal"
                        overflowWrap="anywhere"
                      />
                      <EditableInput
                        as={Textarea}
                        padding=".5rem"
                        minH="100px"
                        width="100%"
                        onChange={(e) => {
                          const { target } = e;
                          target.style.height = "1px";
                          target.style.height = target.scrollHeight + 1 + "px";
                        }}
                        border="none"
                        transition="all 0.2s ease, height 0s"
                        wordBreak="normal"
                        overflowWrap="anywhere"
                      />
                    </Editable>
                  </TaskViewItem>
                  <TaskViewItem
                    title={"Due Date"}
                    icon={<TimeIcon color="gray.500" />}>
                    <TaskDatePicker task_id={task._id} />
                  </TaskViewItem>
                  <TaskViewItem
                    title="Comments"
                    icon={<HamburgerIcon color="gray.500" />}>
                    <CommentInput taskId={task._id} />
                  </TaskViewItem>
                  {task.comments.map((id) => (
                    <CommentView
                      commentId={(id as unknown) as string}
                      taskId={task._id}
                      key={(id as unknown) as string}
                    />
                  ))}
                </>
              ) : (
                <Loading />
              )}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default TaskView;
