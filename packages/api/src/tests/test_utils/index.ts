import { registerInput } from "../../controllers/auth";
import { workspaceInput } from "../../controllers/workspace/createWorkspace";
import ConfirmationToken from "../../models/ConfirmationToken";
import PasswordResetToken from "../../models/PasswordResetToken";
import Tasks, { ITask, Priority, TaskDocument } from "../../models/Task";
import User, { UserDocument } from "../../models/User";
import Workspace, { WorkspaceDocument } from "../../models/Workspace";
import generateToken from "../../utils/generateToken";

export const newUser: registerInput = {
  first_name: "Max",
  last_name: "Plank",
  username: "mplank",
  email: "mplank@gmail.com",
  password: "6.626073",
  is_verified: false,
};

interface CreateUser {
  (userData: registerInput, verified: boolean): Promise<{
    user: UserDocument;
    token: string;
  }>;
  (userData: registerInput): Promise<{ user: UserDocument; token: string }>;
  (): Promise<{ user: UserDocument; token: string }>;
}
/**
 * Takes 2 optional params
 * @param {registerInput} [userData=] A minimum required data to create a User in the db
 * @param {boolean} [verified=] Whether the created user should have a verified email. True by default.
 * @returns a UserDocument and an access token.
 */
export const createUser: CreateUser = async (
  userData = newUser,
  verified = true
) => {
  userData.is_verified = verified;
  const user = await new User(userData).save();
  const token = generateToken(user);
  return { user, token };
};
export const clearUsers = async (): Promise<void> => {
  await User.deleteMany({});
};

export const newWorkspace: workspaceInput = {
  name: "testworkspace7",
  labels: [],
};

/**
 * Creates a new workspace for the given user.
 * @param user_id admin id for the new workspace
 */
export const createWorkspace = async (
  user_id: string
): Promise<WorkspaceDocument> => {
  const workspace = await new Workspace({
    name: "testworkspace7",
    labels: [],
    users: [user_id],
    admin: user_id,
    tasks: [],
    history: [],
  }).save();

  await User.findByIdAndUpdate(
    user_id,
    { $push: { workspaces: workspace.id } },
    { new: true, runValidators: true }
  );

  return workspace;
};

interface CreateTask {
  (workspace_id: string, task: ITask): Promise<TaskDocument>;
  (workspace_id: string): Promise<TaskDocument>;
}

/**
 * Creates a new task within the given workspace
 * @param workspace_id
 */
export const createTask: CreateTask = async (
  workspace_id: string,
  task: ITask = {
    title: "Test Task",
    description: "Test description",
    workspace: workspace_id,
    comments: [],
    users: [],
    labels: [],
  }
): Promise<TaskDocument> => {
  const new_task = await new Tasks(task).save();

  return new_task;
};

export const clearWorkspaces = async (): Promise<void> => {
  await Workspace.deleteMany({});
};

export const clearTokens = async (): Promise<void> => {
  await Promise.all([
    ConfirmationToken.deleteMany({}),
    PasswordResetToken.deleteMany({}),
  ]);
};

export const clearTasks = async (): Promise<void> => {
  await Tasks.deleteMany({});
};
export const clearDB = async (): Promise<void> => {
  await Promise.all([
    clearTokens(),
    clearUsers(),
    clearWorkspaces(),
    clearTasks(),
  ]);
};
