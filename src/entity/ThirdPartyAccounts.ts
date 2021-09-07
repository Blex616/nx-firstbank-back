import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from '../entity/User'

@Entity()
export class ThirdPartyAccounts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    alias: string;

    @Column()
    entityBank: string;

    @Column()
    accountType: string;

    @Column()
    accountNumber: string;

    @Column()
    holderIdentification: string;

    @Column()
    coin: string;

    @ManyToOne(type => User, user => user.id)
    user: User;

}
