import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../rootReducer'
import { authenticate } from '../thunks'
import { DbDocument, EntityNames } from '../types'
import { User, UserStub } from '../user/types'
import { getCurrentWorkspace } from '../workspace/workspaceSlice'

export const userAdapter = createEntityAdapter<User | UserStub>({
  selectId: (user) => user._id
})

const usersSlice = createSlice({
  name: EntityNames.users,
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authenticate.fulfilled, (state, action) => {
      userAdapter.upsertMany(state, action.payload.entities.users)
    })
    builder.addCase(getCurrentWorkspace.fulfilled, (state, action) => {
      const {
        payload: { entities }
      } = action
      userAdapter.upsertMany(state, entities.users)
    })
  }
})

export const userSelectors = userAdapter.getSelectors(
  (state: RootState) => state.users
)

const selectByIds = (ids: DbDocument['_id'][]) => (state: RootState) => {
  return ids.map((id) => userSelectors.selectById(state, id))
}

export default usersSlice.reducer
