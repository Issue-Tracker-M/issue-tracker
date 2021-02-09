import { createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { schema, normalize } from "normalizr";
import { AppDispatch } from "..";
import { createWorkspaceObject } from "../../components/Modals/createWorkspaceModal";
import { baseUrl } from "../../config";
import { AtLeastOne } from "../../globals";
import { setToken } from "../../helpers";
import normalizeAuthResponse from "../../utils/normalizeAuthResponse";
import normalizeTaskResponse from "../../utils/normalizeTaskResponse";
import { axiosWithAuth } from "../../utils/withAuth";
import { RootState } from "../rootReducer";
import { EntityNames } from "../types";
import { loginCredentials, succesfullAuthObject } from "../user/types";
import {
  Comment,
  List,
  Task,
  Workspace,
  WorkspaceStub,
} from "../workspace/types";

// This creates an async action creator which later can be used like regular action
export const authenticate = createAsyncThunk(
  "user/authenticate",
  async (credentials: loginCredentials) => {
    const res = await Axios.post<succesfullAuthObject>(
      `${baseUrl}/auth/login`,
      credentials
    );
    setToken(res.data.token);
    return normalizeAuthResponse(res.data.user);
    /*
     */
  }
);

export const confirmEmail = createAsyncThunk(
  "user/confirmEmail",
  async (token: string) => {
    const res = await Axios.post<succesfullAuthObject>(
      `${baseUrl}/auth/confirm_email`,
      {
        token,
      }
    );
    setToken(res.data.token);
    return normalizeAuthResponse(res.data.user);
  }
);

export const getWorkspaces = createAsyncThunk(
  "user/getWorkspaces",
  async () => {
    const response = await axiosWithAuth().get<WorkspaceStub[]>(
      `${baseUrl}/workspaces/`
    );
    return normalize(response.data, [
      new schema.Entity<WorkspaceStub>(
        EntityNames.workspaces,
        {},
        { idAttribute: (w) => w._id }
      ),
    ]);
  }
);

export const addWorkspace = createAsyncThunk(
  "user/addWorkspace",
  async (workspace: createWorkspaceObject) => {
    const response = await axiosWithAuth().post<Workspace>(
      `${baseUrl}/workspaces/`,
      workspace
    );
    return response.data;
  }
);

type ThunkConfig = {
  state: RootState;
  dispatch: AppDispatch;
};

export const fetchTask = createAsyncThunk<
  ReturnType<typeof normalizeTaskResponse>,
  { taskId: string; workspaceId: string },
  ThunkConfig
>(`${EntityNames.tasks}/fetchTask`, async ({ taskId, workspaceId }) => {
  const res = await axiosWithAuth().get<Task>(
    `${baseUrl}/workspaces/${workspaceId}/tasks/${taskId}`
  );
  console.log(res.data, normalizeTaskResponse(res.data));
  return normalizeTaskResponse(res.data);
});

/**
 * Performs a partial update on the task.
 * Requires the task id and at least one other property
 */
export const patchTask = createAsyncThunk(
  `${EntityNames.tasks}/patchTask`,
  async (
    data: AtLeastOne<Omit<Task, "_id" | "loaded" | "workspace">> &
      Pick<Task, "_id" | "workspace">
  ) => {
    const { _id, workspace, ...rest } = data;
    const res = await axiosWithAuth().patch<Task>(
      `${baseUrl}/workspaces/${workspace}/tasks/${_id}`,
      rest
    );
    return normalizeTaskResponse(res.data);
  }
);

export const addComment = createAsyncThunk(
  `${EntityNames.comments}/addComment`,
  async (data: { taskId: Task["_id"]; content: Comment["content"] }) => {
    const { taskId, content } = data;
    const res = await axiosWithAuth().post<Comment>(
      `${baseUrl}/tasks/${taskId}/comment`,
      { content }
    );
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
    await axiosWithAuth().delete(
      `${baseUrl}/tasks/${taskId}/comment/${commentId}`
    );
  }
);

export const addList = createAsyncThunk(
  `${EntityNames.comments}/addList`,
  async ({ workspaceId, name }: { workspaceId: string; name: string }) => {
    const res = await axiosWithAuth().post<List>(
      `${baseUrl}/workspaces/${workspaceId}/lists`,
      { name }
    );
    const newList = res.data;
    return newList;
  }
);
