import { getInviteData } from "@issue-tracker/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { schema, normalize } from "normalizr";
import { AppDispatch } from "..";
import { createWorkspaceObject } from "../../components/Modals/createWorkspaceModal";
import { AtLeastOne } from "../../globals";
import { setToken } from "../../helpers";
import normalizeAuthResponse from "../../utils/normalizeAuthResponse";
import normalizeTaskResponse from "../../utils/normalizeTaskResponse";
import { RootState } from "../rootReducer";
import { EntityNames } from "../types";
import { loginCredentials, succesfullAuthObject } from "../user/types";
import {
  Comment,
  List,
  Task,
  TaskStub,
  Workspace,
  WorkspaceStub,
} from "../display/types";

// This creates an async action creator which later can be used like regular action
export const authenticate = createAsyncThunk(
  "user/authenticate",
  async (credentials: loginCredentials) => {
    const {
      data: { user, token },
    } = await axios.post<succesfullAuthObject>(`/auth/login`, credentials);
    return { ...normalizeAuthResponse(user), token };
  }
);

export const confirmEmail = createAsyncThunk(
  "user/confirmEmail",
  async (token: string) => {
    const res = await axios.post<succesfullAuthObject>(`/auth/confirm_email`, {
      token,
    });
    setToken(res.data.token);
    return normalizeAuthResponse(res.data.user);
  }
);

export const getWorkspaces = createAsyncThunk(
  "user/getWorkspaces",
  async () => {
    const response = await axios.get<WorkspaceStub[]>(`/workspaces/`);
    return normalize(response.data, [
      new schema.Entity<WorkspaceStub>(
        EntityNames.workspaces,
        {},
        { idAttribute: (w) => w._id }
      ),
    ]);
  }
);

export const createWorkspace = createAsyncThunk(
  "createWorkspace",
  async (workspace: createWorkspaceObject) => {
    const response = await axios.post<Workspace>(`/workspaces/`, workspace);
    return response.data;
  }
);

type ThunkConfig = {
  state: RootState;
  dispatch: AppDispatch;
};

export const fetchTask = createAsyncThunk<
  ReturnType<typeof normalizeTaskResponse>,
  { taskId: string },
  ThunkConfig
>(`${EntityNames.tasks}/fetchTask`, async ({ taskId }) => {
  const res = await axios.get<Task>(`/tasks/${taskId}`);
  return normalizeTaskResponse(res.data);
});

interface IPatch {
  update: AtLeastOne<Task> & Pick<Task, "_id" | "workspace">;
  current: Task | TaskStub;
}
/**
 * Performs a partial update on the task.
 * Requires the task id and at least one other property
 */
export const patchTask = createAsyncThunk(
  `${EntityNames.tasks}/patchTask`,
  async (data: IPatch) => {
    const { _id, ...rest } = data.update;
    const res = await axios.patch<Task>(`/tasks/${_id}`, rest);
    return normalizeTaskResponse(res.data);
  }
);

export const addComment = createAsyncThunk(
  `${EntityNames.comments}/addComment`,
  async (data: { taskId: Task["_id"]; content: Comment["content"] }) => {
    const { taskId, content } = data;
    const res = await axios.post<Comment>(`/tasks/${taskId}/comments`, {
      content,
    });
    return { taskId, comment: res.data };
  }
);

interface deleteCommentInput {
  taskId: Task["_id"];
  commentId: Comment["_id"];
}
export const deleteComment = createAsyncThunk(
  `${EntityNames.comments}/deleteComment`,
  async ({ taskId, commentId }: deleteCommentInput) => {
    await axios.delete(`/tasks/${taskId}/comments/${commentId}`);
  }
);

export const addList = createAsyncThunk(
  `${EntityNames.lists}/addList`,
  async ({ workspaceId, name }: { workspaceId: string; name: string }) => {
    const res = await axios.post<List>(`/workspaces/${workspaceId}/lists`, {
      name,
    });
    const newList = res.data;
    return newList;
  }
);

export const fetchInvitationData = createAsyncThunk(
  "fetchInvitationData",
  async (token: string) => {
    const res = await axios.get<getInviteData>(`/auth/invite/${token}`);
    return res.data;
  }
);
