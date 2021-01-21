import { AuthorizedRequest } from "./controllers/auth/middleware";
import { UserDocument } from "./models/User";
import { NextFunction, Response } from "express";

interface AuthorizedRouteHandler<P, B> {
  (req: AuthorizedRequest<P, B>, res: Response, next: NextFunction): any;
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request {
      user?: UserDocument;
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
    <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(
      path: PathParams,
      ...handlers: Array<AuthorizedRouteHandler<P, ResBody>>
    ): T;
  }
}
