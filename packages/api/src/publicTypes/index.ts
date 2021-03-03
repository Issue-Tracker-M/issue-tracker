import { InvitationTokenPopulatedDocument } from "../components/auth/models/InvitationToken";
import { UserDocument } from "../components/users/model";
import { JSONify } from "../utils/typeUtils";

export type getInviteData = JSONify<InvitationTokenPopulatedDocument>;

export type AuthResponse = {
  token: string;
  user: JSONify<UserDocument>;
};
