import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CommentReplyEntity } from './comment.reply.entity';

@Entity()
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    userId: number;

    @Column({ readonly: true })
    createdAt: string;

    @Column('text')
    content: string;

    @Column()
    enjoy: number;

    @Column()
    articleId: number;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(_type => CommentReplyEntity, reply => reply.comment)
    replies: CommentReplyEntity[];
}
