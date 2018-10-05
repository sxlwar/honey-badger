import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    account: string;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    avatar: string; // avatar url;

    @Column({ default: false })
    isAdmin: boolean;
}
