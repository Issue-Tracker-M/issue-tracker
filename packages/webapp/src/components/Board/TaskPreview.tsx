import {
  Badge,
  HStack,
  Icon,
  Link,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AiOutlineRead } from "react-icons/ai";
import { useEntity } from "../../hooks/useEntity";
import { Task } from "../../store/display/types";
import { ChatIcon, CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

interface TaskPreviewProps {
  taskId: Task["_id"];
  stage: string;
}

const TaskPreview: FC<TaskPreviewProps> = ({ taskId }) => {
  const task = useEntity("tasks", taskId);
  if (!task || !task.loaded) throw new Error("Task not found in the entities");
  return <TaskPreviewDisplay {...task} />;
};

const DueDateBadge: FC<{ date: string; complete?: boolean }> = ({
  date,
  complete,
}) => {
  const d = new Date(date);
  const currentDate = new Date();
  if (complete)
    return (
      <Badge
        colorScheme="green"
        display="flex"
        alignItems="center"
        title="This task has been completed">
        <Icon>
          <CheckCircleIcon />
        </Icon>
        {d.toLocaleDateString()}
      </Badge>
    );
  if (d < currentDate)
    return (
      <Badge
        colorScheme="red"
        title="This task is past due."
        display="flex"
        alignItems="center">
        <WarningIcon />
        {d.toLocaleDateString()}
      </Badge>
    );
  // if due in less than a day
  if (
    !Math.floor(
      (((d as unknown) as number) - ((currentDate as unknown) as number)) /
        (1000 * 60 * 60 * 24)
    )
  )
    return (
      <Badge
        colorScheme="yellow"
        title="This task is due in less than 24 hours.">
        {d.toLocaleDateString()}
      </Badge>
    );
  return null;
};

const TaskPreviewDisplay: FC<Task> = ({
  _id,
  title,
  description,
  due_date,
  comments,
  complete,
}) => {
  const location = useLocation();
  const { colorMode } = useColorMode();
  const colorProps =
    colorMode === "light" ? { bgColor: "gray.50" } : { bgColor: "gray.600" };
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
        pathname: `/t/${_id}`,
        // Set location state to keep rendering whetever it is we were rendering while changing the URL
        state: { background: location },
      }}
      {...colorProps}>
      <Text>{title}</Text>
      <HStack>
        {description ? (
          <Icon as={AiOutlineRead} title="This task has a description" />
        ) : null}
        {due_date ? (
          <>
            <DueDateBadge date={due_date} complete={complete} />
          </>
        ) : null}
        {comments.length ? (
          <Icon>
            <title>This task has {comments.length} comments</title>
            <ChatIcon />
          </Icon>
        ) : null}
      </HStack>
    </Link>
  );
};

export default TaskPreview;
