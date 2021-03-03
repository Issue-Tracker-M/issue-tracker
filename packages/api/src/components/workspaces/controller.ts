import Workspace, {
  WorkspaceDocument,
  WorkspacePopulatedDocument,
} from "./model";
import InvitationToken, {
  InvitationToken as IInvitationToken,
} from "../auth/models/InvitationToken";
import { NextFunction, RequestHandler, Response } from "express";
import { JSONed } from "../../utils/typeUtils";
import { WorkspaceInput } from "./validation";
import { AuthorizedRequest } from "../auth/middleware";
import Users from "../users/model";
import sendMail from "../../utils/sendEmail";
import { inviteTemplate } from "../../templates/inviteTemplate";

/**
 * @private
 * Creates a new workspace with a given name and assigns currently authorized user as it's admin
 * @param req - Needs to have a user document at req.user attached by previous middleware
 * @param res
 */
export const createWorkspace = async (
  req: AuthorizedRequest<unknown, WorkspaceInput>,
  res: Response
): Promise<void> => {
  const { name } = req.body;
  const { _id } = req.user;
  try {
    const newWorkSpace = await new Workspace({
      name,
      users: [_id],
      admin: _id,
    }).save();
    req.user.workspaces.push(newWorkSpace.id);
    await req.user.save();
    // await User.findOneAndUpdate(
    //   { _id },
    //   { $push: { workspaces: newWorkSpace.id } },
    //   { new: true }
    // );
    res.status(201).json(newWorkSpace);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * @private
 * Deletes workspace with the id given in the request params, authorized user has to be the workspace admin to delete it.
 * @param req - Needs to have a user document at req.user attached by previous middleware
 * @param res
 */
export const deleteWorkspace: RequestHandler = async (req, res, next) => {
  const { workspace, user } = req;
  if (!workspace) throw new Error("Expected workspace document");
  if (!user) throw new Error("Expected user document");
  try {
    user.workspaces.pull(workspace._id);
    const p = await workspace.populate("users").execPopulate();
    await Promise.all(
      ((p as unknown) as WorkspacePopulatedDocument).users.map(async (u) => {
        u.workspaces.pull(workspace._id);
        await u.save();
      })
    );
    await workspace.remove();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/**
 * @private
 * Patches the workspace with given id, authorized user has to be a member of the workspace
 * @param req - Needs to have a user document at req.user attached by previous middleware
 * @param res
 */
export const editWorkspace = async (
  req: AuthorizedRequest<{ workspace_id: string }, JSONed<WorkspaceDocument>>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { workspace, user } = req;
  try {
    if (!workspace) throw "Expected a workspace document";
    if (!user) throw "Expected a user document";
    await workspace.updateOne(req.body).exec();

    res.status(200).json({ message: "Workspace updated" });
  } catch (err) {
    next(err);
  }
};

/**
 * Returns { _id, name } of all of the workspaces associated with currently authenticated user.
 * @param req
 * @param res
 * @param next
 */
export const getWorkspaces: RequestHandler = async (req, res, next) => {
  const { user } = req;
  try {
    if (!user) throw "Expected a user document";
    await user
      .populate({ path: "workspaces", select: ["name"] })
      .execPopulate();
    return res.status(200).json(user.workspaces);
  } catch (err) {
    next(err);
  }
};

/**
 * Returns a workspace with given id with partially populated data about it's associated tasks & users.
 * @param req
 * @param res
 * @param next
 */
export const getWorkspaceById = async (
  req: AuthorizedRequest<{ workspace_id: string }, void>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workspace = await Workspace.findById(req.params.workspace_id)
      .populate({
        path: "lists.tasks",
        select: ["title", "labels", "workspace", "list"],
      })
      .populate({
        path: "users",
        select: ["username", "first_name", "last_name"],
      })
      .exec();
    if (!workspace) {
      res.status(404).json({ message: "Workspace with id doesnt exist" });
      return;
    }
    res.status(200).json(workspace);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * Sends an invitation to a workspace to a given email.
 * @param req
 * @param res
 * @param next
 */
export const inviteToWorkspace: RequestHandler<
  { workspaceId: string },
  any,
  { email: string }
> = async (req, res, next) => {
  const { workspace, user } = req;
  if (!workspace) throw "Expected a workspace document";
  if (!user) throw "Expected a user document";
  const { email } = req.body;
  try {
    const invitee = await Users.findOne({ email }).exec();
    if (invitee?.workspaces.includes(workspace.id))
      return res
        .status(401)
        .json({ message: "User already a part of the workspace" });
    const invitation_data: Omit<IInvitationToken, "token"> = {
      invited_by: user.id,
      invited_to: workspace.id,
      user_id: invitee ? invitee.id : null,
      email,
    };
    const { token } = await new InvitationToken(invitation_data).save();
    await sendMail({
      subject: `${user.fullName} has invited you to a new workspace!`,
      to: email,
      html: inviteTemplate(
        user.fullName,
        workspace.name,
        token,
        invitee?.fullName
      ),
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
