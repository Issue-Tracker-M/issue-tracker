import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
import { addList } from "../thunks";
import { EntityNames } from "../types";
import { List } from "../workspace/types";
import { createTask, getCurrentWorkspace } from "../workspace/workspaceSlice";

export const listAdapter = createEntityAdapter<List>({
  selectId: (list) => list._id,
});

const listSlice = createSlice({
  name: EntityNames.lists,
  initialState: listAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createTask.fulfilled, (state, action) => {
      const list = state.entities[action.meta.arg.list];
      if (!list) throw new Error("List entity not found");
      list.tasks.push(action.payload._id);
    });
    builder.addCase(addList.fulfilled, (state, { payload }) => {
      listAdapter.upsertOne(state, payload);
    });
    builder.addCase(getCurrentWorkspace.fulfilled, (state, action) => {
      listAdapter.upsertMany(state, action.payload.entities.lists);
    });
  },
});

export const listSelectors = listAdapter.getSelectors(
  (state: RootState) => state.lists
);

export default listSlice.reducer;
