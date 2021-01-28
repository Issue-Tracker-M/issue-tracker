import { NextFunction, Response } from "express-serve-static-core";
import { AuthorizedRequest } from "../../src/components/auth/middleware";
import { TaskDocument } from "../../src/components/tasks/model";
import { UserDocument } from "../../src/components/users/model";
import { WorkspaceDocument } from "../../src/components/workspaces/model";

interface AuthorizedRouteHandler<P, B> {
  (req: AuthorizedRequest<P, B>, res: Response, next: NextFunction): any;
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request {
      user?: UserDocument;
      workspace?: WorkspaceDocument;
      task?: TaskDocument;
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
