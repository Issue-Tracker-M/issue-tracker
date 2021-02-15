import { combineReducers } from "@reduxjs/toolkit";
import { EntityNames } from "./types";
import userReducer from "./user/userSlice";
import workspaceDisplayReducer from "./workspace/workspaceSlice";
import workspacesReducer from "./entities/workspaces";
import usersReducer from "./entities/users";
import tasksReducer from "./entities/tasks";
import commentsReducer from "./entities/comments";
import listsReducer from "./entities/lists";
import authReducer from "./authSlice";

export const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  workspaceDisplay: workspaceDisplayReducer,
  [EntityNames.workspaces]: workspacesReducer,
  [EntityNames.users]: usersReducer,
  [EntityNames.tasks]: tasksReducer,
  [EntityNames.comments]: commentsReducer,
  [EntityNames.lists]: listsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
