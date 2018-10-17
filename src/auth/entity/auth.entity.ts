import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from 'article/entity/article.entity';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    githubId: number;

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

    @OneToMany(_type => ArticleEntity, article => article.user)
    articles: ArticleEntity[];
}
