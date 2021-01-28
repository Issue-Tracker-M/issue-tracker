import { Types } from "mongoose";
import app from "../../src/components/app";
import { registerInput } from "../../src/components/auth/controller";
import ConfirmationToken from "../../src/components/auth/models/ConfirmationToken";
import PasswordResetToken from "../../src/components/auth/models/PasswordResetToken";
import Tasks, { TaskDocument } from "../../src/components/tasks/model";
import Users, { UserDocument } from "../../src/components/users/model";
import Workspaces, {
  WorkspaceDocument,
} from "../../src/components/workspaces/model";
import { WorkspaceInput } from "../../src/components/workspaces/validation";
import generateToken from "../../src/utils/generateToken";
import { JSONify } from "../../src/utils/typeUtils";

export const newUser: registerInput = {
  first_name: "Max",
  last_name: "Plank",
  email: "mplank@gmail.com",
  password: "6.626073",
  is_verified: false,
};

interface CreateUser {
  (userData?: registerInput, verified?: boolean): Promise<{
    user: UserDocument;
    token: string;
  }>;
}

/**
 * @private
 * Takes 2 optional params
 * @param userData - A minimum required data to create a User in the db
 * @param verified - Whether the created user should have a verified email. True by default.
 * @returns a UserDocument and an access token.
 */
export const createUser: CreateUser = async (
  userData = newUser,
  verified = true
) => {
  userData.is_verified = verified;
  const user = await new Users(userData).save();
  const token = generateToken(user);
  return { user, token };
};
export const clearUsers = async (): Promise<void> => {
  await Users.deleteMany({});
};

export const newWorkspace: WorkspaceInput = {
  name: "testworkspace7",
};

/**
 * @private
 * Creates a new workspace for the given user.
 * @param user_id admin id for the new workspace
 */
export const createWorkspace = async (
  user_id: string | Types.ObjectId
): Promise<WorkspaceDocument> => {
  const workspace = await new Workspaces({
    name: "testworkspace7",
    labels: [],
    users: [user_id],
    admin: user_id,
    tasks: [],
    history: [],
  }).save();

  await Users.findByIdAndUpdate(
    user_id,
    { $push: { workspaces: workspace.id } },
    { new: true, runValidators: true }
  );

  return workspace;
};

interface CreateTask {
  (
    workspace_id: string | Types.ObjectId,
    list: string | Types.ObjectId,
    task?: Partial<JSONify<TaskDocument>>
  ): Promise<TaskDocument>;
}

/**
 * Creates a new task within the given workspace
 * @param workspace_id
 * @param task
 */
export const createTask: CreateTask = async (
  workspace_id: string,
  list: string,
  task: Partial<JSONify<TaskDocument>> = {
    title: "Test Task",
    workspace: workspace_id,
    list,
  }
): Promise<TaskDocument> => {
  const new_task = await new Tasks(task).save();

  return new_task;
};

export const clearWorkspaces = async (): Promise<void> => {
  await Workspaces.deleteMany({});
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

export const teardown = async (done) => {
  await clearDB();
  await app.get("db_connection").connection.dropDatabase();
  await app.get("db_connection").disconnect();
  done();
};
