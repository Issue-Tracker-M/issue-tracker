import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getWorkspaceResponse } from "./types";
import { baseUrl } from "../../config";
import { DbDocument } from "../types";
import normalizeWorkspaceResponse from "../../utils/normalizeWorkspaceResponse";
import axios from "axios";

interface displayState {
  filterText: string;
  isSidebarOpen: boolean;
  isWorkspaceListOpen: boolean;
}

const initialState: displayState = {
  filterText: "",
  isSidebarOpen: false,
  isWorkspaceListOpen: false,
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

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    changeFilterText: (state, action: PayloadAction<string>) => {
      state.filterText = action.payload;
    },
    toggleSideBar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleWorkspaceList: (state) => {
      state.isWorkspaceListOpen = !state.isWorkspaceListOpen;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getCurrentWorkspace.fulfilled, (state, action) => {
  //     state.currentWorkspaceId = action.payload.result;
  //   });
  // },
});

export const {
  changeFilterText,
  toggleSideBar,
  toggleWorkspaceList,
} = displaySlice.actions;

export default displaySlice.reducer;
