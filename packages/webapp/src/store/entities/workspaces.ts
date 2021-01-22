import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../rootReducer'
import { addWorkspace, authenticate } from '../thunks'
import { EntityNames } from '../types'
import { Workspace, WorkspaceStub } from '../workspace/types'
import { getCurrentWorkspace } from '../workspace/workspaceSlice'

export const workspaceAdapter = createEntityAdapter<Workspace | WorkspaceStub>({
  selectId: (workspace) => workspace._id
})

const workspacesSlice = createSlice({
  name: EntityNames.workspaces,
  initialState: workspaceAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authenticate.fulfilled, (state, action) => {
      workspaceAdapter.upsertMany(state, action.payload.entities.workspaces)
    })
    builder.addCase(getCurrentWorkspace.fulfilled, (state, action) => {
      const {
        payload: { result, entities }
      } = action
      workspaceAdapter.upsertOne(state, entities.workspaces[result])
    })
    builder.addCase(addWorkspace.fulfilled, (state, action) => {
      workspaceAdapter.upsertOne(state, action.payload)
    })
  }
})

export const workspaceSelectors = workspaceAdapter.getSelectors(
  (state: RootState) => state.workspaces
)

export default workspacesSlice.reducer
