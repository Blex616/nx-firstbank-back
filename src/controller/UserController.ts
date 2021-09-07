import { getRepository, In } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "./../middleware/JWT";
import { User } from "../entity/User";

export class UserController {

    private userRepository = getRepository(User);

    async getUserOne(request: Request, response: Response, next: NextFunction) {
        let user = await this.userRepository.findOne({ username: request.body.username })
        delete user["password"];
        return user;
    }

    async login(request: Request, response: Response, next: NextFunction) {
        let { username, password } = request.body;
        if (!(username && password)) {
            response.status(400);
            return { "message_error": "Datos vacios" }
        }
        try {
            let userQ = await this.userRepository.findOne({ username: username });
            if (!userQ || !userQ.checkIfUnencryptedPasswordIsValid(password)) {
                response.status(401);
                return { "message_error": "Usuario o contraseña incorrecta" }
            }
            const userData = {
                "id": userQ.id,
                "identification": userQ.identification,
                "firstName": userQ.firstName,
                "lastName": userQ.lastName,
                "role": userQ.role,
                "username": userQ.username
            };
            const accessToken = generateAccessToken(userData);
            response.status(200);
            return { ...userData, "accessToken": accessToken }
        } catch (error) {
            response.status(500);
            return { "message_error": error }
        }
    }

}