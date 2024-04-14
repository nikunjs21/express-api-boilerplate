import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import roles from '../config/roles.js';
import { IUser } from '../models/user.model.js';

const { roleRights } = roles;

const verifyCallback =
  (req: any, resolve: any, reject: (error: ApiError) => void, requiredRights: string[]) =>
  async (err: Error | null, user: IUser | null, info: any): Promise<void> => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) || [];
      if (userRights && userRights.length) {
        const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight));
        if (!hasRequiredRights && req.params.userId !== user.id) {
          return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: any[]) =>
  async (req: any, res: any, next: Function) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
