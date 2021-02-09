import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaceResponse, Task, Workspace } from "./types";
import { baseUrl } from "../../config";
import { axiosWithAuth } from "../../utils/withAuth";
import { TaskInput } from "../../components/Board/column";
import { DbDocument } from "../types";
import normalizeWorkspaceResponse from "../../utils/normalizeWorkspaceResponse";

interface workspaceState {
  filterText: string;
}

const initialState: workspaceState = {
  filterText: "",
};

export const getCurrentWorkspace = createAsyncThunk(
  "workspace/getCurrentWorkspace",
  async (id: DbDocument["_id"]) => {
    const res = await axiosWithAuth().get<getWorkspaceResponse>(
      `${baseUrl}/workspaces/${id}`
    );
    const r = normalizeWorkspaceResponse(res.data);
    return r;
  }
);

export const createTask = createAsyncThunk(
  "workspace/createTask",
  async (taskInput: TaskInput) => {
    const { workspace } = taskInput;
    const response = await axiosWithAuth().post<Task>(
      `${baseUrl}/workspaces/${workspace}/tasks`,
      taskInput
    );
    const task = response.data;
    return task;
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    /* TODO */
    changeFilterText: (state, action) => {
      state.filterText = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getCurrentWorkspace.fulfilled, (state, action) => {
  //     state.currentWorkspaceId = action.payload.result;
  //   });
  // },
});

export default workspaceSlice.reducer;
