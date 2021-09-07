import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from '../entity/User'
import { Account } from '../entity/Accounts'

@Entity()
export class AccountHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    typeTransaction: string;

    @Column()
    value: number;

    @Column({
        nullable: true,
    })
    numberTransaction: number;

    @Column({
        nullable: true,
    })
    description: string;

    @Column({
        nullable: true,
    })
    accountNumberSend: string;

    @CreateDateColumn()
    dateTransaction: Date;

    @ManyToOne(type => Account, account => account.id)
    accountTransaction: Account;

}
