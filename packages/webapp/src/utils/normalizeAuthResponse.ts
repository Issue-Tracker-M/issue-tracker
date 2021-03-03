import { normalize, NormalizedSchema, schema } from "normalizr";
import { EntityNames } from "../store/types";
import { User, UserAPIResponse } from "../store/user/types";
import { Workspace, WorkspaceStub } from "../store/display/types";

const workspaceEntity = new schema.Entity<WorkspaceStub | Workspace>(
  EntityNames.workspaces,
  {},
  {
    processStrategy: (workspace) => {
      const processedWorkspace = {
        ...workspace,
        loaded: workspace.users ? true : false,
      };
      if (processedWorkspace.loaded) return processedWorkspace as Workspace;
      return processedWorkspace as WorkspaceStub;
    },
    idAttribute: (w) => w._id.toString(),
  }
);
const userEntity = new schema.Entity<User>(
  EntityNames.users,
  {
    workspaces: [workspaceEntity],
  },
  {
    idAttribute: (user) => user._id.toString(),
    processStrategy(user) {
      if (user.createdAt) {
        user.loaded = true;
      }
      return user;
    },
  }
);

export default function normalizeAuthResponse(
  res: UserAPIResponse
): NormalizedSchema<
  {
    [EntityNames.users]: {
      [key: string]: User;
    };
    [EntityNames.workspaces]: {
      [key: string]: WorkspaceStub;
    };
  },
  string
> {
  return normalize(res, userEntity);
}

/* 
Get the api response
normalize it
get entities into the appropriate slices 
*/
