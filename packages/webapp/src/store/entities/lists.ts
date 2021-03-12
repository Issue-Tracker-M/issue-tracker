import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
import { addList, patchTask } from "../thunks";
import { EntityNames } from "../types";
import { List } from "../display/types";
import { getCurrentWorkspace } from "../display/displaySlice";
import { createTask } from "./tasks";

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
    builder.addCase(patchTask.pending, (state, action) => {
      // Optimistically update the state
      if (action.meta.arg.update.list) {
        const oldListID = action.meta.arg.current.list;
        (state.entities[oldListID] as any).tasks = state.entities[
          oldListID
        ]?.tasks.filter((id) => id !== action.meta.arg.current._id);
        state.entities[action.meta.arg.update.list]?.tasks.push(
          action.meta.arg.current._id
        );
      }
    });
    builder.addCase(patchTask.fulfilled, (state, action) => {
      // Special case for updating a list to which the task belongs, as we need to sync task and list entities
      if (action.meta.arg.update.list) {
        const oldListID = action.meta.arg.current.list;
        (state.entities[oldListID] as any).tasks = state.entities[
          oldListID
        ]?.tasks.filter((id) => id !== action.meta.arg.current._id);
        state.entities[action.meta.arg.update.list]?.tasks.push(
          action.payload.result
        );
      }
      return;
    });
    builder.addCase(patchTask.rejected, (state, action) => {
      // Revert back the state changes
      if (action.meta.arg.update.list) {
        const oldListID = action.meta.arg.current.list;
        (state.entities[oldListID] as any).tasks = state.entities[
          oldListID
        ]?.tasks.push(action.meta.arg.current._id);
        state.entities[action.meta.arg.update.list]?.tasks.filter(
          (id) => id !== action.meta.arg.current._id
        );
      }
    });
  },
});

export const listSelectors = listAdapter.getSelectors(
  (state: RootState) => state.lists
);

export default listSlice.reducer;
