import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import normalizeWorkspaceResponse from "../../utils/normalizeWorkspaceResponse";
import { refreshAuthToken } from "../authSlice";
import { RootState } from "../rootReducer";
import { createWorkspace, authenticate } from "../thunks";
import { EntityNames } from "../types";
import {
  getWorkspaceResponse,
  Workspace,
  WorkspaceStub,
} from "../display/types";
import { getCurrentWorkspace } from "../display/displaySlice";

export const workspaceAdapter = createEntityAdapter<Workspace | WorkspaceStub>({
  selectId: (workspace) => workspace._id,
});

export const fetchWorkspace = createAsyncThunk(
  "workspace/fetchWorkspace",
  async (id: string) => {
    const res = await axios.get<getWorkspaceResponse>(`/workspaces/${id}`);
    const r = normalizeWorkspaceResponse(res.data);
    return r;
  }
);

const workspacesSlice = createSlice({
  name: EntityNames.workspaces,
  initialState: workspaceAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authenticate.fulfilled, (state, action) => {
      workspaceAdapter.upsertMany(state, action.payload.entities.workspaces);
    });
    builder.addCase(refreshAuthToken.fulfilled, (state, action) => {
      if (action.payload.entities.workspaces)
        workspaceAdapter.upsertMany(state, action.payload.entities.workspaces);
    });
    builder.addCase(getCurrentWorkspace.fulfilled, (state, action) => {
      const {
        payload: { result, entities },
      } = action;
      workspaceAdapter.upsertOne(state, entities.workspaces[result]);
    });
    builder.addCase(fetchWorkspace.fulfilled, (state, action) => {
      const {
        payload: { result, entities },
      } = action;
      workspaceAdapter.upsertOne(state, entities.workspaces[result]);
    });
    builder.addCase(createWorkspace.fulfilled, (state, action) => {
      workspaceAdapter.upsertOne(state, action.payload);
    });
  },
});

export const workspaceSelectors = workspaceAdapter.getSelectors(
  (state: RootState) => state.workspaces
);

export default workspacesSlice.reducer;
