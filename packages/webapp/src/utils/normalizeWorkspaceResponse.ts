import { ListDocument } from "@issue-tracker/api/src/components/workspaces/model";
import { schema, normalize, NormalizedSchema } from "normalizr";
import { EntityNames } from "../store/types";
import { UserStub } from "../store/user/types";
import {
  getWorkspaceResponse,
  List,
  TaskStub,
  Workspace,
} from "../store/workspace/types";

const userEntity = new schema.Entity<UserStub>(
  EntityNames.users,
  {},
  {
    idAttribute: (u) => u._id,
    processStrategy: (user) => ({ ...user, loaded: false }),
  }
);

const taskEntity = new schema.Entity<TaskStub>(
  EntityNames.tasks,
  {},
  {
    idAttribute: (t) => t._id,
    processStrategy: (task) => ({ ...task, loaded: false }),
  }
);

const listEntity = new schema.Entity<ListDocument>(
  EntityNames.lists,
  {
    tasks: [taskEntity],
  },
  {
    idAttribute: (t) => t._id,
  }
);
const workspaceEntity = new schema.Entity<Workspace>(
  EntityNames.workspaces,
  {
    admin: userEntity,
    users: [userEntity],
    lists: [listEntity],
  },
  {
    processStrategy: (workspace) => {
      return {
        ...workspace,
        loaded: true,
      } as Workspace;
    },
    idAttribute: (w) => w._id,
  }
);

const normalizeWorkspaceResponse = (
  workspaceResponse: getWorkspaceResponse
): NormalizedSchema<
  {
    [EntityNames.workspaces]: { [key: string]: Workspace };
    [EntityNames.users]: { [key: string]: UserStub };
    [EntityNames.tasks]: { [key: string]: TaskStub };
    [EntityNames.lists]: { [key: string]: List };
  },
  string
> => {
  return normalize(workspaceResponse, workspaceEntity);
};

export default normalizeWorkspaceResponse;
