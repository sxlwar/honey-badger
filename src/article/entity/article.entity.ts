import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ArticleStatisticsEntity } from './article.statistics.entity';

@Entity()
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 10 })
    author: string;

    @Column({ readonly: true })
    createdAt: string;

    @Column({ nullable: true, default: null })
    updatedAt: string;

    @Column({ length: 100 })
    title: string;

    @Column({ length: 150, nullable: true })
    subtitle: string = '';

    @Column('text')
    content: string;

    @Column()
    isPublished: boolean;

    @Column()
    isOriginal: boolean;

    @Column({ default: false })
    isDeleted: boolean;

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
    category: string; // JSON parse to string[];

    @OneToOne(_type => ArticleStatisticsEntity, statistics => statistics.article, { cascade: true })
    @JoinColumn()
    statistics: ArticleStatisticsEntity;
}
