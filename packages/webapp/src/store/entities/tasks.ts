import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../rootReducer'
import { addComment, fetchTask, patchTask } from '../thunks'
import { EntityNames } from '../types'
import { Task, TaskStub } from '../workspace/types'
import { getCurrentWorkspace } from '../workspace/workspaceSlice'

export const taskAdapter = createEntityAdapter<Task | TaskStub>({
  selectId: (user) => user._id
})

const tasksSlice = createSlice({
  name: EntityNames.workspaces,
  initialState: taskAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getCurrentWorkspace.fulfilled,
      (state, { payload: { entities } }) => {
        taskAdapter.upsertMany(state, entities.tasks)
      }
    )
    builder.addCase(fetchTask.fulfilled, (state, { payload: { entities } }) => {
      taskAdapter.upsertMany(state, entities.tasks)
    })
    builder.addCase(patchTask.fulfilled, (state, { payload: { entities } }) => {
      taskAdapter.upsertMany(state, entities.tasks)
    })
    builder.addCase(addComment.fulfilled, (state, { payload }) => {
      const task = state.entities[payload.taskId]
      if (task?.loaded) task.comments.push(payload.comment._id as any)
    })
  }
})

export const taskSelectors = taskAdapter.getSelectors(
  (state: RootState) => state.tasks
)

export default tasksSlice.reducer
