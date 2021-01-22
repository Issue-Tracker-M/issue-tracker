import { combineReducers } from '@reduxjs/toolkit'
import { EntityNames } from './types'
import userReducer from './user/userSlice'
import workspaceDisplayReducer from './workspace/workspaceSlice'
import workspacesReducer from './entities/workspaces'
import usersReducer from './entities/users'
import tasksReducer from './entities/tasks'
import commentsReducer from './entities/comments'

export const rootReducer = combineReducers({
  user: userReducer,
  workspaceDisplay: workspaceDisplayReducer,
  [EntityNames.workspaces]: workspacesReducer,
  [EntityNames.users]: usersReducer,
  [EntityNames.tasks]: tasksReducer,
  [EntityNames.comments]: commentsReducer
})

export type RootState = ReturnType<typeof rootReducer>
