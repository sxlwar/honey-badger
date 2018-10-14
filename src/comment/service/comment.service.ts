import { Inject, Injectable } from '@nestjs/common';

import * as moment from 'moment';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepositoryToken } from '../../shared/config/config.enum';
import { Repository } from 'typeorm';

import { ConfigService } from '../../shared/config/config.service';
import { CommentDto, EnjoyCommentDto } from '../dto/comment.dto';
import { CommentEntity } from '../entity/comment.entity';
import {
    AddCommentResult,
    CommentQueryResult,
    DeleteCommentResult,
    UpdateCommentResult,
    EnjoyCommentResult,
} from '../interface/comment.interface';
import { ReplyDto } from '../dto/comment.reply.dto';
import { CommentReplyEntity } from '../entity/comment.reply.entity';

@Injectable()
export class CommentService {
    constructor(
        @Inject(RepositoryToken.CommentRepositoryToken) private readonly commentRepository: Repository<CommentEntity>,
        @Inject(RepositoryToken.CommentReplyRepositoryToken)
        private readonly replayRepository: Repository<CommentReplyEntity>,
        private readonly configService: ConfigService,
    ) {}

    async addComment(comment: CommentDto): Promise<AddCommentResult> {
        const data = this.commentRepository.create({
            ...comment,
            enjoy: 0,
            createdAt: moment().format(this.configService.dateFormat),
        });

        return this.commentRepository.save(data).then(({ id, createdAt }) => ({ id, createdAt }));
    }

    getCommentAndReplies(articleId: number): Observable<CommentQueryResult> {
        const data = this.commentRepository.findAndCount({
            where: { articleId, isDeleted: false },
            order: { createdAt: 'DESC' },
            relations: ['replies'],
        });

        return from(data).pipe(map(([comments, count]) => ({ comments, count })));
    }

    async updateComment(comment: EnjoyCommentDto): Promise<UpdateCommentResult> {
        const { commentId, enjoy } = comment;

        return this.commentRepository.update(commentId, { enjoy }).then(res => ({ updated: !!res }));
    }

    async deleteComment(id: number): Promise<DeleteCommentResult> {
        return this.commentRepository.update(id, { isDeleted: true }).then(res => ({ isDeleted: !!res }));
    }

    // =====================================================Reply==================================================

    async addReply(reply: ReplyDto): Promise<EnjoyCommentResult> {
        const { content, commentId, toUser, fromUser, userId } = reply;
        const comment = await this.commentRepository.findOne({ id: commentId });
        const data = this.replayRepository.create({
            fromUser,
            toUser,
            content,
            createdAt: moment().format(this.configService.dateFormat),
            comment,
            userId,
        });

        return this.replayRepository.save(data).then(result => ({ updated: !!result }));
    }
}
