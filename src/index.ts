import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { authenticateToken, checkRole } from "./middleware/JWT";
import { Routes } from "./routes";
import { User } from "./entity/User";

createConnection()
    .then(async (connection) => {
        const port = parseInt(process.env.PORT) || 8000;
        const app = express();
        const cors = require("cors");

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.set("trust proxy", true);
        app.use(cors());

        // register express routes from defined application routes
        Routes.forEach((route) => {
            (app as any)[route.method](
                route.route,
                route.roles.length > 0
                    ? [authenticateToken, checkRole(route.roles)]
                    : [],
                (req: Request, res: Response, next: Function) => {
                    const result = new (route.controller as any)()[route.action](
                        req,
                        res,
                        next
                    );
                    if (result instanceof Promise) {
                        result.then((result) =>
                            result !== null && result !== undefined
                                ? res.send(result)
                                : undefined
                        );
                    } else if (result !== null && result !== undefined) {
                        res.json(result);
                    }
                }
            );
        });

        // start express server
        app.listen(port, () => {
            console.log(`Servidor iniciado en el puerto ${port}`);
        });

        let userRepository = connection.getRepository(User);
        const user = new User();
        const userValidate = await userRepository.findOne({
            where: { identification: "115270707" },
        });
        if (!userValidate) {
            user.username = "Blex"
            user.identification = "1152";
            user.firstName = "Admin";
            user.lastName = "Admin";
            user.password = "2021";
            user.role = "ADMIN";
            await connection.manager.save(user);
        }
    })
    .catch((error) => console.log(error));
