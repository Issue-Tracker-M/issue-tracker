import { Link, useColorMode } from "@chakra-ui/react";
import React, { FC } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEntity } from "../../hooks/useEntity";
import { Task } from "../../store/display/types";

interface TaskPreviewProps {
  taskId: Task["_id"];
  stage: string;
}

const TaskPreview: FC<TaskPreviewProps> = ({ taskId }) => {
  const task = useEntity("tasks", taskId);
  const location = useLocation();
  const { colorMode } = useColorMode();
  const colorProps =
    colorMode === "light" ? { bgColor: "gray.50" } : { bgColor: "gray.600" };
  if (!task) throw new Error("Task not found in the entities");
  return (
    <Link
      as={RouterLink}
      rounded="md"
      display="block"
      whiteSpace="normal"
      m=".5rem auto"
      shadow="md"
      padding=".375rem .5rem .375rem"
      fontSize="sm"
      to={{
        pathname: `/t/${taskId}`,
        // Set location state to keep rendering whetever it is we were rendering while changing the URL
        state: { background: location },
      }}
      {...colorProps}>
      {task.title}
    </Link>
  );
};

export default TaskPreview;
