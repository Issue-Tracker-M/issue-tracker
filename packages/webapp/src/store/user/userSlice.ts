import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from './types'
import {
  addWorkspace,
  authenticate,
  confirmEmail,
  getWorkspaces
} from '../thunks'

const initialState: User = {
  email: '',
  _id: '',
  username: '',
  workspaces: [],
  first_name: '',
  last_name: '',
  loaded: true
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      // this one just merges whatever updates you want into the user state
      return { ...state, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(authenticate.pending, (state, action) => {
      // This one is passed as an example, if you don't want to do anything with the dispatched action you can just leave it out of the reducer
    })
    builder.addCase(authenticate.fulfilled, (state, action) => {
      // here, because i'm expecting the payload to have a whole new user object, i'm returning that as the new state
      return action.payload.entities.users[action.payload.result]
    })
    // I'm not including authenticate.rejected, because it doesn't affect the state in any way.
    builder.addCase(confirmEmail.fulfilled, (state, action) => {
      return action.payload.entities.users[action.payload.result]
    })
    builder.addCase(getWorkspaces.fulfilled, (state, action) => {
      state.workspaces = action.payload.result
    })
    builder.addCase(addWorkspace.fulfilled, (state, action) => {
      state.workspaces.push(action.payload._id)
    })
  }
})
/* returns an object that look like this: 
{
  name: "user",
  reducer: (state, action) => newState,
  actions: {
    authenticateUserSucccess: (payload) => ({type: "user/authenticateUserSucccess", payload})
    authenticateUserFailed: (payload) => ({type: "user/authenticateUserFailed", payload})
    updateUser: (payload) => ({type: "user/updateUser", payload})
  },
  caseReducers: {
    authenticateUserSucccess: (state, action) => newState,
    authenticateUserFailed: (state, action) => newState,
    updateUser: (state, action) => newState,
  }
} */
export const { updateUser } = userSlice.actions

export default userSlice.reducer
