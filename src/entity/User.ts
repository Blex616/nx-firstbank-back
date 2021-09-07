import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, OneToMany } from "typeorm";
import { Account } from '../entity/Accounts'
import { ThirdPartyAccounts } from '../entity/ThirdPartyAccounts'
import { Length } from "class-validator";
import * as bcrypt from "bcrypt";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    identification: string;

    @Column({
        unique: true,
    })
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    role: string;

    @Column()
    @Length(4, 100)
    password: string;


    @OneToMany(() => Account, account => account.id)
    account: Account;

    @OneToMany(() => ThirdPartyAccounts, thirdPartyAccounts => thirdPartyAccounts.id)
    thirdPartyAccounts: ThirdPartyAccounts;

    @BeforeInsert()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
