import { UserController } from "./controller/UserController";
import { AccountController } from "./controller/AccountController";
import { ThirdPartyAccountsController } from "./controller/ThirdPartyAccountsController";

export const Routes = [

    // User
    {
        method: "post",
        route: "/api/user/login",
        controller: UserController,
        action: "login",
        roles: []
    },
    {
        method: "post",
        route: "/api/user/getUser",
        controller: UserController,
        action: "getUserOne",
        roles: ["USER", "ADMIN"]
    },
    // Account
    {
        method: "post",
        route: "/api/account/accountUser",
        controller: AccountController,
        action: "accountsUser",
        roles: ["USER", "ADMIN"]
    },
    {
        method: "post",
        route: "/api/account/transfer",
        controller: AccountController,
        action: "transferThirdAccount",
        roles: ["USER", "ADMIN"]
    },
    {
        method: "post",
        route: "/api/accountHistory/accountUserHistory",
        controller: AccountController,
        action: "accountHistoryUser",
        roles: ["USER", "ADMIN"]
    },
    // ThirdPartyAccounts
    {
        method: "post",
        route: "/api/thirdPartyAccounts/save",
        controller: ThirdPartyAccountsController,
        action: "save",
        roles: ["USER", "ADMIN"]
    },
    {
        method: "post",
        route: "/api/thirdPartyAccounts/accountsUser",
        controller: ThirdPartyAccountsController,
        action: "thirdPartyAccountsUser",
        roles: ["USER", "ADMIN"]
    },

];