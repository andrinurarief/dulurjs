import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

export type AuthOptions = {
    loginURL: string;
}

export function AuthChecker(options: AuthOptions) {
    return function (req: Request, res: Response, next: NextFunction) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.redirect(options.loginURL);
        }
    }
}

export function RolesChecker(options: AuthOptions, roles: string[], schema: 'allowed' | 'rejected') {
    return function (req: Request, res: Response, next: NextFunction) {
        if(req.isUnauthenticated()) {
            res.status(401).send();
        } else {
            if(_.intersection(req.user.roles, roles).length > 0) {
                if(schema == 'allowed')
                    return next();
                else
                    res.status(403).send();
            } else {
                res.status(403).send();
            }
        }
    }
}