import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from '../entity/User'
import { AccountHistory } from '../entity/AccountsHistory'

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    AcNumber: string;

    @Column()
    type: string;

    @Column()
    balance: number;

    @ManyToOne(type => User, user => user.id)
    user: User;

    @OneToMany(() => AccountHistory, accountHistory => accountHistory.id)
    accountHistory: AccountHistory;

}
