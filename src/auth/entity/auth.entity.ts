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

    @Column({ default: false })
    isLogout: boolean;

    @Column({
        transformer: {
            to: value => value,
            from: value => {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return value;
                }
            },
        },
    })
    storedArticles: string; // JSON parse to string[];
}
