import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
import { addComment, fetchTask, patchTask } from "../thunks";
import { EntityNames } from "../types";
import { Task, TaskStub } from "../display/types";
import { getCurrentWorkspace } from "../display/displaySlice";
import axios from "axios";
import normalizeTaskResponse from "../../utils/normalizeTaskResponse";

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskInput: Pick<Task, "title" | "workspace" | "list">) => {
    const response = await axios.post<Task>(`/tasks`, taskInput);
    const task = response.data;
    return task;
  }
);

export const archiveTask = createAsyncThunk(
  "tasks/archiveTask",
  async (taskId: string, thunkAPI) => {
    try {
      const res = await axios.patch(`/tasks/${taskId}`, { archived: true });
      return normalizeTaskResponse(res.data);
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

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
