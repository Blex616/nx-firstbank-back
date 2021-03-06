import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { ThirdPartyAccounts } from "../entity/ThirdPartyAccounts";
import { Account } from "../entity/Accounts";

export class ThirdPartyAccountsController {

    private thirdPartyAccounts = getRepository(ThirdPartyAccounts);
    private accountRepository = getRepository(Account);

    async thirdPartyAccountsUser(request: Request, response: Response, next: NextFunction) {
        return this.thirdPartyAccounts.find({ user: request.body.user });
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const account = await this.accountRepository.findOne({ AcNumber: request.body.accountNumber })
            const validateAccount = await this.thirdPartyAccounts.findOne({ user: request.body.user, accountNumber: request.body.accountNumber })
            if (validateAccount) {
                response.status(400);
                return { "message_error": `El número de cuenta ${request.body.accountNumber} ya existe con el alias ${validateAccount.alias}` }
            }
            if (!account) {
                response.status(400);
                return { "message_error": `El número de cuenta ${request.body.accountNumber} no existe en nuestra base de datos, no es posible registrarla` }
            }
            let thirdPartyAccountsUser = new ThirdPartyAccounts();
            thirdPartyAccountsUser.alias = request.body.alias;
            thirdPartyAccountsUser.entityBank = request.body.entityBank;
            thirdPartyAccountsUser.accountType = request.body.accountType;
            thirdPartyAccountsUser.accountNumber = request.body.accountNumber;
            thirdPartyAccountsUser.holderIdentification = request.body.holderIdentification;
            thirdPartyAccountsUser.coin = request.body.coin;
            thirdPartyAccountsUser.user = request.body.user;
            const instance = await this.thirdPartyAccounts.save(thirdPartyAccountsUser);
            response.status(200);
            return {
                "thirdPartyAccountUser": instance,
                "user": request.body.user
            };
        } catch (error) {
            response.status(500);
            return { "message_error": error }
        }
    }


}