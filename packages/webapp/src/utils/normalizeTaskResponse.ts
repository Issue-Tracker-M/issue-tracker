import { schema, normalize, NormalizedSchema } from "normalizr";
import { EntityNames } from "../store/types";
import { Comment, Task } from "../store/display/types";

const commentEntity = new schema.Entity<Comment>(
  EntityNames.comments,
  {},
  {
    idAttribute: (c) => c._id,
  }
);

const taskEntity = new schema.Entity<Task>(
  EntityNames.tasks,
  {
    comments: [commentEntity],
  },
  {
    idAttribute: (t) => t._id,
    processStrategy: (task) => ({ ...task, loaded: true }),
  }
);

const normalizeTaskResponse = (
  getTaskResponse: Task
): NormalizedSchema<
  {
    [EntityNames.tasks]: { [key: string]: Task };
    [EntityNames.comments]: { [key: string]: Comment };
  },
  string
> => normalize(getTaskResponse, taskEntity);

export default normalizeTaskResponse;
