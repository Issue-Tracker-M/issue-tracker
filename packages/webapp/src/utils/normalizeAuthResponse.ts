import { normalize, schema } from 'normalizr'
import { EntityNames } from '../store/types'
import { User, UserAPIResponse } from '../store/user/types'
import { Workspace, WorkspaceStub } from '../store/workspace/types'

const workspaceEntity = new schema.Entity<WorkspaceStub | Workspace>(
  EntityNames.workspaces,
  {},
  {
    processStrategy: (workspace) => {
      const processedWorkspace = {
        ...workspace,
        loaded: workspace.users ? true : false
      }
      if (processedWorkspace.loaded) return processedWorkspace as Workspace
      return processedWorkspace as WorkspaceStub
    },
    idAttribute: (w) => w._id.toString()
  }
)
const userEntity = new schema.Entity<User>(
  EntityNames.users,
  {
    workspaces: [workspaceEntity]
  },
  { idAttribute: (user) => user._id.toString() }
)

interface normalizedAuthResponse {
  entities: {
    [EntityNames.users]: {
      [key: string]: User
    }
    [EntityNames.workspaces]: {
      [key: string]: WorkspaceStub
    }
  }
  result: string
}

export default function normalizeAuthResponse(res: UserAPIResponse) {
  return normalize(res, userEntity) as normalizedAuthResponse
}

/* 
Get the api response
normalize it
get entities into the appropriate slices 
*/
