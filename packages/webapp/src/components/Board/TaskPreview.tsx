import { Box, Text, useDisclosure } from "@chakra-ui/react";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { taskSelectors } from "../../store/entities/tasks";
import { Task } from "../../store/workspace/types";
import TaskView from "./TaskView";

interface TaskPreviewProps {
  taskId: Task["_id"];
  stage: string;
}

const TaskPreview: FC<TaskPreviewProps> = ({ taskId, stage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const task = useSelector((state) => taskSelectors.selectById(state, taskId));
  if (!task) throw new Error("Task not found in the entities");
  return (
    <Box
      cursor="pointer"
      mb="2"
      borderRadius="md"
      backgroundColor="white"
      minWidth="100%"
      shadow="md"
      padding=".375rem .5rem .125rem"
      onClick={onOpen}>
      <Text mb={2} fontSize="sm">
        {task.title}
      </Text>
      {isOpen && (
        <TaskView task={task} isOpen={isOpen} onClose={onClose} stage={stage} />
      )}
    </Box>
  );
};

export default TaskPreview;
