import { Box, Text, useDisclosure } from "@chakra-ui/react";
import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEntity } from "../../hooks/useEntity";
import { Task } from "../../store/display/types";
import TaskView from "./TaskView";

interface TaskPreviewProps {
  taskId: Task["_id"];
  stage: string;
}

const TaskPreview: FC<TaskPreviewProps> = ({ taskId }) => {
  const task = useEntity("tasks", taskId);
  const location = useLocation();
  if (!task) throw new Error("Task not found in the entities");
  return (
    <Link
      to={{
        pathname: `/t/${taskId}`,
        // This is the trick! This link sets
        // the `background` in location state.
        state: { background: location },
      }}>
      <Box
        cursor="pointer"
        mb="2"
        borderRadius="md"
        backgroundColor="white"
        minWidth="100%"
        shadow="md"
        padding=".375rem .5rem .125rem">
        <Text mb={2} fontSize="sm">
          {task.title}
        </Text>
      </Box>
    </Link>
  );
};

export default TaskPreview;
