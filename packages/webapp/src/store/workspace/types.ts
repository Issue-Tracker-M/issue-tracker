import { DbDocument, FullDocument, Stub } from '../types'
import { User, UserStub } from '../user/types'

export enum Stage {
  todo = 'todo',
  in_progress = 'in_progress',
  completed = 'completed'
}

export interface TaskStub
  extends Pick<Task, '_id' | 'title' | 'labels'>,
    Stub {}

export interface List extends DbDocument {
  name: string
  tasks: Task['_id'][]
}

interface WorkspaceBase extends DbDocument {
  name: string
  admin: User['_id']
}

export interface getWorkspaceResponse extends WorkspaceBase, FullDocument {
  labels: Label[]
  users: UserStub[]
  [Stage.todo]: TaskStub[]
  [Stage.in_progress]: TaskStub[]
  [Stage.completed]: TaskStub[]
}

export interface WorkspaceStub extends Pick<Workspace, '_id' | 'name'>, Stub {}

export interface Workspace extends DbDocument, FullDocument {
  name: string
  labels: Label['_id'][]
  users: User['_id'][]
  admin: User['_id']
  [Stage.todo]: Task['_id'][]
  [Stage.in_progress]: Task['_id'][]
  [Stage.completed]: Task['_id'][]
  // tasks?: Task["_id"][];
}

export interface Label extends DbDocument {
  name: string
  color: string
}

export interface Task extends DbDocument, FullDocument {
  title: string
  description?: string
  workspace: Workspace['_id']
  due_date: Date | null
  complete?: boolean
  status: Stage
  labels: Label['_id'][]
  users: User['_id'][]
  comments: Comment[]
}

export interface Comment extends DbDocument {
  content: string
  author: User['_id']
}

export enum Priority {
  low = '0',
  high = '1',
  urgent = '2'
}
