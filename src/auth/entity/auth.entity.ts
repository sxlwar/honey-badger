import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class AuthEntity {
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
}
