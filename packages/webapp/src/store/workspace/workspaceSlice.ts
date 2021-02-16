import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaceResponse, Task } from "./types";
import { baseUrl } from "../../config";
import { TaskInput } from "../../components/Board/column";
import { DbDocument } from "../types";
import normalizeWorkspaceResponse from "../../utils/normalizeWorkspaceResponse";
import axios from "axios";

interface workspaceState {
  filterText: string;
  isSidebarOpen: boolean;
}

const initialState: workspaceState = {
  filterText: "",
  isSidebarOpen: false,
};

export const getCurrentWorkspace = createAsyncThunk(
  "workspace/getCurrentWorkspace",
  async (id: DbDocument["_id"]) => {
    const res = await axios.get<getWorkspaceResponse>(
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
    const response = await axios.post<Task>(
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
    toggleSideBar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getCurrentWorkspace.fulfilled, (state, action) => {
  //     state.currentWorkspaceId = action.payload.result;
  //   });
  // },
});

export const { changeFilterText, toggleSideBar } = workspaceSlice.actions;

export default workspaceSlice.reducer;
