import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
import { addComment, fetchTask, patchTask } from "../thunks";
import { EntityNames } from "../types";
import { Task, TaskStub } from "../display/types";
import { createTask, getCurrentWorkspace } from "../display/displaySlice";

export const taskAdapter = createEntityAdapter<Task | TaskStub>({
  selectId: (user) => user._id,
});

const tasksSlice = createSlice({
  name: EntityNames.workspaces,
  initialState: taskAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getCurrentWorkspace.fulfilled,
      (state, { payload: { entities } }) => {
        if (entities.tasks) taskAdapter.upsertMany(state, entities.tasks);
      }
    );
    builder.addCase(fetchTask.fulfilled, (state, { payload: { entities } }) => {
      taskAdapter.upsertMany(state, entities.tasks);
    });
    builder.addCase(patchTask.fulfilled, (state, { payload: { entities } }) => {
      taskAdapter.upsertMany(state, entities.tasks);
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      taskAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(addComment.fulfilled, (state, { payload }) => {
      const task = state.entities[payload.taskId];
      if (task?.loaded) task.comments.push(payload.comment._id);
    });
  },
});

export const taskSelectors = taskAdapter.getSelectors(
  (state: RootState) => state.tasks
);

export default tasksSlice.reducer;
