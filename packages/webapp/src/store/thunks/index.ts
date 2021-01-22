import { createAsyncThunk } from '@reduxjs/toolkit'
import Axios from 'axios'
import { schema, normalize } from 'normalizr'
import { createWorkspaceObject } from '../../components/Modals/createWorkspaceModal'
import { baseUrl } from '../../config'
import { AtLeastOne } from '../../globals'
import { setToken } from '../../helpers'
import normalizeAuthResponse from '../../utils/normalizeAuthResponse'
import normalizeTaskResponse from '../../utils/normalizeTaskResponse'
import { axiosWithAuth } from '../../utils/withAuth'
import { EntityNames } from '../types'
import { loginCredentials, succesfullAuthObject } from '../user/types'
import { Comment, Task, Workspace, WorkspaceStub } from '../workspace/types'

// This creates an async action creator which later can be used like regular action
export const authenticate = createAsyncThunk(
  'user/authenticate',
  async (credentials: loginCredentials) => {
    const res = await Axios.post<succesfullAuthObject>(
      `${baseUrl}/auth/login`,
      credentials
    )
    setToken(res.data.token)
    return normalizeAuthResponse(res.data.user)
    /*
     */
  }
)

export const confirmEmail = createAsyncThunk(
  'user/confirmEmail',
  async (token: string) => {
    const res = await Axios.post<succesfullAuthObject>(
      `${baseUrl}/auth/confirm_email`,
      {
        token
      }
    )
    setToken(res.data.token)
    return normalizeAuthResponse(res.data.user)
  }
)

export const getWorkspaces = createAsyncThunk(
  'user/getWorkspaces',
  async () => {
    const response = await axiosWithAuth().get<WorkspaceStub[]>(
      `${baseUrl}/workspaces/`
    )
    return normalize(response.data, [
      new schema.Entity<WorkspaceStub>(
        EntityNames.workspaces,
        {},
        { idAttribute: (w) => w._id }
      )
    ])
  }
)

export const addWorkspace = createAsyncThunk(
  'user/addWorkspace',
  async (workspace: createWorkspaceObject) => {
    const response = await axiosWithAuth().post<Workspace>(
      `${baseUrl}/workspaces/`,
      workspace
    )
    return response.data
  }
)

export const fetchTask = createAsyncThunk(
  `${EntityNames.tasks}/fetchTask`,
  async (taskId: Task['_id']) => {
    const res = await axiosWithAuth().get<Task>(`${baseUrl}/tasks/${taskId}`)
    console.log(res.data, normalizeTaskResponse(res.data))
    return normalizeTaskResponse(res.data)
  }
)

/**
 * Performs a partial update on the task.
 * Requires the task id and at least one other property
 */
export const patchTask = createAsyncThunk(
  `${EntityNames.tasks}/patchTask`,
  async (
    data: AtLeastOne<Omit<Task, '_id' | 'loaded'>> & Pick<Task, '_id'>
  ) => {
    const { _id, ...rest } = data
    const res = await axiosWithAuth().patch<{ message: string; data: Task }>(
      `${baseUrl}/tasks/${_id}`,
      rest
    )
    return normalizeTaskResponse(res.data.data)
  }
)

export const addComment = createAsyncThunk(
  `${EntityNames.comments}/addComment`,
  async (data: { taskId: Task['_id']; content: Comment['content'] }) => {
    const { taskId, content } = data
    const res = await axiosWithAuth().post<Comment>(
      `${baseUrl}/tasks/${taskId}/comment`,
      { content }
    )
    return { taskId, comment: res.data }
  }
)

interface deleteCommentInput {
  taskId: Task['_id']
  commentId: Comment['_id']
}
export const deleteComment = createAsyncThunk(
  `${EntityNames.comments}/deleteComment`,
  async ({ taskId, commentId }: deleteCommentInput) => {
    await axiosWithAuth().delete(
      `${baseUrl}/tasks/${taskId}/comment/${commentId}`
    )
  }
)
