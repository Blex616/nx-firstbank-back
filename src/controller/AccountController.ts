import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Account } from "../entity/Accounts";
import { AccountHistory } from "../entity/AccountsHistory";


export class AccountController {

    private accountRepository = getRepository(Account);
    private accountHistory = getRepository(AccountHistory);

    async accountsUser(request: Request, response: Response, next: NextFunction) {
        return this.accountRepository.find({ user: request.body.user });
    }

    async accountHistoryUser(request: Request, response: Response, next: NextFunction) {
        return this.accountHistory.find({ accountTransaction: request.body.account });
    }

    async transferThirdAccount(request: Request, response: Response, next: NextFunction) {
        const valueToTransfer = parseInt(request.body.valueToTransfer);
        let accountOrigin = await this.accountRepository.findOne({ relations: ['user'], where: { AcNumber: request.body.acOrigin } });
        let accountToSend = await this.accountRepository.findOne({ AcNumber: request.body.acSend });
        accountOrigin.balance -= valueToTransfer;
        accountToSend.balance += valueToTransfer;
        let historyOrigin = new AccountHistory();
        let historyToSend = new AccountHistory();
        let numberTransaction = this.getRandomInt(10000000, 100000000);

        historyOrigin.numberTransaction = numberTransaction;
        historyOrigin.typeTransaction = 'Rest';
        historyOrigin.accountTransaction = accountOrigin;
        historyOrigin.accountNumberSend = accountToSend.AcNumber;
        historyOrigin.description = request.body.description;
        historyOrigin.value = valueToTransfer;
        historyOrigin.description = request.body.description;

        historyToSend.numberTransaction = numberTransaction;
        historyToSend.typeTransaction = 'Add';
        historyToSend.accountTransaction = accountToSend;
        historyToSend.accountNumberSend = accountOrigin.AcNumber;
        historyToSend.description = request.body.description;
        historyToSend.value = valueToTransfer;

        const instanceOne = await this.accountRepository.save(accountOrigin);
        await this.accountRepository.save(accountToSend);
        await this.accountHistory.save(historyOrigin);
        await this.accountHistory.save(historyToSend);

        response.status(200);
        return {
            "numberTransaction": numberTransaction,
            "user": accountOrigin.user.id,
            "account": instanceOne.id
        }

    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}