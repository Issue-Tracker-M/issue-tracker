import { DbDocument, FullDocument, Stub } from '../types'
import { Workspace } from '../workspace/types'

interface UserBase extends DbDocument {
  readonly email: string
  readonly username: string
  readonly first_name: string
  readonly last_name: string
}

export interface UserAPIResponse extends UserBase {
  readonly workspaces: Pick<Workspace, '_id' | 'name'>
}

export interface UserStub
  extends Pick<User, '_id' | 'username' | 'first_name' | 'last_name'>,
    Stub {}

export interface User extends UserBase, FullDocument {
  readonly workspaces: Workspace['_id'][]
}

export interface loginCredentials {
  credential: string
  password: string
}

export interface succesfullAuthObject {
  token: string
  user: UserAPIResponse
}
