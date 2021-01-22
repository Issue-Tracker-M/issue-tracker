import { schema, normalize } from 'normalizr'
import { EntityNames } from '../store/types'
import { UserStub } from '../store/user/types'
import {
  getWorkspaceResponse,
  TaskStub,
  Workspace,
  Stage
} from '../store/workspace/types'

const userEntity = new schema.Entity<UserStub>(
  EntityNames.users,
  {},
  {
    idAttribute: (u) => u._id,
    processStrategy: (user) => ({ ...user, loaded: false })
  }
)

const taskEntity = new schema.Entity<TaskStub>(
  EntityNames.tasks,
  {},
  {
    idAttribute: (t) => t._id,
    processStrategy: (task) => ({ ...task, loaded: false })
  }
)

const workspaceEntity = new schema.Entity<Workspace>(
  EntityNames.workspaces,
  {
    admin: userEntity,
    users: [userEntity],
    [Stage.todo]: [taskEntity],
    [Stage.in_progress]: [taskEntity],
    [Stage.completed]: [taskEntity]
  },
  {
    processStrategy: (workspace) => {
      return {
        ...workspace,
        loaded: true
      } as Workspace
    },
    idAttribute: (w) => w._id
  }
)

const normalizeWorkspaceResponse = (workspaceResponse: getWorkspaceResponse) =>
  normalize<
    getWorkspaceResponse,
    {
      [EntityNames.workspaces]: { [key: string]: Workspace }
      [EntityNames.users]: { [key: string]: UserStub }
      [EntityNames.tasks]: { [key: string]: TaskStub }
    }
  >(workspaceResponse, workspaceEntity)

export default normalizeWorkspaceResponse
