import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticateToken = (req: Request, response: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (token == null) return response.sendStatus(401);
    jwt.verify(token, "U5624F3ED6", (err, decoded) => {
        if (err) return response.sendStatus(403);
        req.user = decoded;
        next();
    });
};

export const checkRole = (roles: Array<string>) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        const userId = request.user && request.user.identification;
        if (userId == null) return response.sendStatus(401);
        try {
            if (roles.indexOf(request.user.role) > -1) {
                next();
            } else {
                response.sendStatus(401);
            }
        } catch {
            response.sendStatus(401);
        }
    };
};

export const generateAccessToken = (user) => {
    return jwt.sign(user, "U5624F3ED6");
};

