import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { authenticateToken, checkRole } from "./middleware/JWT";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { Account } from "./entity/Accounts";


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
        let accountRepository = connection.getRepository(Account);
        const userOne = new User();
        const userTwo = new User();
        const accountOne = new Account();
        const accountTwo = new Account();
        const accountThree = new Account();
        const userValidateOne = await userRepository.findOne({
            where: { identification: "115270707" },
        });
        const userValidateTwo = await userRepository.findOne({
            where: { identification: "115270708" },
        });
        const accountValidateOne = await accountRepository.findOne({
            where: { AcNumber: "12345678900" },
        });
        const accountValidateTwo = await accountRepository.findOne({
            where: { AcNumber: "12345678901" },
        });
        const accountValidateThree = await accountRepository.findOne({
            where: { AcNumber: "12345678902" },
        });
        if (!userValidateOne) {
            userOne.username = "Blex"
            userOne.identification = "115270707";
            userOne.firstName = "Julian";
            userOne.lastName = "Iglesias Sanchez";
            userOne.password = "2021";
            userOne.role = "ADMIN";
            await connection.manager.save(userOne);
        }
        if (!userValidateTwo) {
            userTwo.username = "Cito"
            userTwo.identification = "115270708";
            userTwo.firstName = "Juan";
            userTwo.lastName = "Agudelo Duque";
            userTwo.password = "2021";
            userTwo.role = "ADMIN";
            await connection.manager.save(userTwo);
        }
        if (!accountValidateOne) {
            accountOne.balance = 100000
            accountOne.user = userOne
            accountOne.AcNumber = "12345678900";
            accountOne.type = "Ahorros";
            await connection.manager.save(accountOne);
        }
        if (!accountValidateTwo) {
            accountTwo.balance = 100000
            accountTwo.user = userOne
            accountTwo.AcNumber = "12345678901";
            accountTwo.type = "Corriente";
            await connection.manager.save(accountTwo);
        }
        if (!accountValidateThree) {
            accountThree.balance = 100000
            accountThree.user = userTwo
            accountThree.AcNumber = "12345678902";
            accountThree.type = "Ahorros";
            await connection.manager.save(accountThree);
        }
    })
    .catch((error) => console.log(error));
