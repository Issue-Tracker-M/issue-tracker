import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { refreshAuthToken } from "../authSlice";
import { RootState } from "../rootReducer";
import { authenticate, createWorkspace } from "../thunks";
import { EntityNames } from "../types";
import { User, UserStub } from "../user/types";
import { getCurrentWorkspace } from "../display/displaySlice";

export const userAdapter = createEntityAdapter<User | UserStub>({
  selectId: (user) => user._id,
});

const usersSlice = createSlice({
  name: EntityNames.users,
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authenticate.fulfilled, (state, action) => {
      userAdapter.upsertMany(state, action.payload.entities.users);
    });
    builder.addCase(refreshAuthToken.fulfilled, (state, action) => {
      userAdapter.upsertMany(state, action.payload.entities.users);
    });
    builder.addCase(createWorkspace.fulfilled, (state, action) => {
      (state.entities[action.payload.admin] as User).workspaces.push(
        action.payload._id
      );
    });
    builder.addCase(getCurrentWorkspace.fulfilled, (state, action) => {
      const {
        payload: { entities },
      } = action;
      userAdapter.upsertMany(state, entities.users);
    });
  },
});

export const userSelectors = userAdapter.getSelectors(
  (state: RootState) => state.users
);

export default usersSlice.reducer;
