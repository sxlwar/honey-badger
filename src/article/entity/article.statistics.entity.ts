import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity()
export class ArticleStatisticsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    enjoy: number = 0; // star数

    @Column('int')
    view: number = 0; // 被查看次数

    @Column('int')
    stored: number = 0; // 被收藏次数

    @OneToOne(_type => ArticleEntity, article => article.statistics)
    article: ArticleEntity;
}
