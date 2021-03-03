import { InvitationTokenPopulatedDocument } from "../components/auth/models/InvitationToken";
import { JSONify } from "../utils/typeUtils";

export type getInviteData = JSONify<InvitationTokenPopulatedDocument>;
