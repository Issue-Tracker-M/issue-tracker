import { NextFunction, Response } from "express-serve-static-core";
import { AuthorizedRequest } from "../../src/controllers/auth/middleware";
import { UserDocument } from "../../src/models/User";
import { WorkspaceDocument } from "../../src/models/Workspace";

interface AuthorizedRouteHandler<P, B> {
  (req: AuthorizedRequest<P, B>, res: Response, next: NextFunction): any;
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request {
      user?: UserDocument;
      workspace?: WorkspaceDocument;
    }
  }
}

declare module "express-serve-static-core" {
  export interface IRouterMatcher<
    T,
    Method extends
      | "all"
      | "get"
      | "post"
      | "put"
      | "delete"
      | "patch"
      | "options"
      | "head" = any
  > {
    <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = any>(
      path: PathParams,
      ...handlers: Array<AuthorizedRouteHandler<P, ResBody>>
    ): T;
  }
}
