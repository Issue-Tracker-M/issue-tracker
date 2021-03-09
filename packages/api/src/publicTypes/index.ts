import { InvitationTokenPopulatedDocument } from "../components/auth/models/InvitationToken";
import { TaskDocument } from "../components/tasks/model";
import { UserDocument } from "../components/users/model";
import { WorkspaceDocument } from "../components/workspaces/model";
import { JSONify } from "../utils/typeUtils";

export type getInviteData = JSONify<InvitationTokenPopulatedDocument>;

export type UserJSON = JSONify<UserDocument>;
export type WorkspaceJSON = JSONify<WorkspaceDocument>;
export type TaskJSON = JSONify<TaskDocument>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace ApiResponses {
  export type AuthResponse = {
    token: string;
    user: UserJSON;
  };
}
