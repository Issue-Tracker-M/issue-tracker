import bcrypt from "bcrypt";
import { Document, Model, Types, Schema, model } from "mongoose";
import { IBaseUser } from "@issue-tracker/types";
import { WorkspaceDocument } from "../workspaces/model";
import ConfirmationToken from "../auth/models/ConfirmationToken";
import generateToken from "../../utils/generateToken";
import { EMAIL_SECRET } from "../../config";
import sendMail from "../../utils/sendEmail";
import confirmEmailTemplate from "../../templates/confirmEmailTemplate";
import RefreshToken from "../auth/models/RefreshToken";

const UserSchema = new Schema<UserDocument>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
    },
    email: { type: String, required: true, unique: true, trim: true },
    is_verified: { type: Boolean, default: false },
    workspaces: [
      {
        type: Schema.Types.ObjectId,
        ref: "Workspaces",
      },
    ],
    provider_ids: {
      type: {
        google: { type: String, default: null },
      },
      required: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform(_, ret) {
        delete ret.password;
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);
// VIRTUALS
UserSchema.virtual("fullName").get(function (this: UserDocument) {
  return this.first_name + " " + this.last_name;
});
interface UserBaseDocument extends IBaseUser, Document<Types.ObjectId> {
  _id: Types.ObjectId;
  /**
   * Virtual path with full name of the user
   */
  fullName: string;
  workspaces: Types.ObjectId[] | WorkspaceDocument[];
  /**
   * Hashes and compares given string to the existing user password
   * @param password password to compare with currently saved password
   */
  comparePassword(password: string): Promise<boolean>;
  /**
   * Sends an email confirmation link to the user's email.
   */
  sendEmailConfirm(): Promise<void>;
  /**
   * Generates access token JWT for the user.
   */
  generateAccessToken(): string;
  /**
   * Generates refresh token JWT for the user and stores it in the RefreshToken collection.
   */
  generateRefreshToken(): Promise<string>;
}

export interface UserDocument extends UserBaseDocument {
  workspaces: Types.Array<WorkspaceDocument["_id"]>;
}

export interface UserPopulatedDocument extends UserBaseDocument {
  workspaces: Types.DocumentArray<WorkspaceDocument>;
}

// METHODS
UserSchema.methods.comparePassword = function (
  this: UserDocument,
  password: string
) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.sendEmailConfirm = async function (this: UserDocument) {
  const { token } = await ConfirmationToken.create({
    user_id: this.id,
    token: generateToken(this, EMAIL_SECRET),
  });
  return sendMail({
    subject: "Welcome to Issue Tracker!",
    to: this.email,
    html: confirmEmailTemplate(this.fullName, token),
  });
};

UserSchema.methods.generateAccessToken = function (this: UserDocument) {
  return generateToken(this);
};

UserSchema.methods.generateRefreshToken = async function (this: UserDocument) {
  const { token } = await RefreshToken.create({
    user_id: this.id,
  });
  return token;
};

// STATIC METHODS
export interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
}

UserSchema.statics.findByEmail = function (
  this: Model<UserDocument>,
  email: string
) {
  return this.findOne({ email }).exec();
};

//MIDDLEWARE
UserSchema.pre<UserDocument>("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const Users = model<UserDocument, UserModel>("Users", UserSchema);

export default Users;
