import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../rootReducer'
import { addComment, fetchTask, patchTask } from '../thunks'
import { EntityNames } from '../types'
import { Comment } from '../workspace/types'

export const commentAdapter = createEntityAdapter<Comment>({
  selectId: (comment) => comment._id
})

const commentSlice = createSlice({
  name: EntityNames.comments,
  initialState: commentAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTask.fulfilled, (state, { payload: { entities } }) => {
      if (entities.comments) commentAdapter.upsertMany(state, entities.comments)
    })
    builder.addCase(patchTask.fulfilled, (state, { payload: { entities } }) => {
      if (entities.comments) commentAdapter.upsertMany(state, entities.comments)
    })
    builder.addCase(addComment.fulfilled, (state, { payload, meta }) => {
      commentAdapter.upsertOne(state, payload.comment)
    })
  }
})

export const commentSelectors = commentAdapter.getSelectors(
  (state: RootState) => state.comments
)

export default commentSlice.reducer
