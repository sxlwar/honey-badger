import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommentEntity } from './comment.entity';

@Entity()
export class CommentReplyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ readonly: true })
    createdAt: string;

    @Column('text')
    content: string;

    @Column()
    fromUser: string;

    @Column()
    userId: number; // from user's user id;

    @Column()
    toUser: string;

    @ManyToOne(_type => CommentEntity, comment => comment.replies)
    comment: CommentEntity;
}
