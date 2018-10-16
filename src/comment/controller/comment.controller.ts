import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { Observable } from 'rxjs';

import { CRUDVar } from '../../shared/constant/constant';
import { COMMENT, REPLY } from '../constant/constant';
import { CommentDeleteDto, CommentDto, EnjoyCommentDto } from '../dto/comment.dto';
import { ReplyDto } from '../dto/comment.reply.dto';
import { CommentHttpExceptionFilter } from '../filter/comment.http.exception.filter';
import { IsNotEnjoySelfCommentGuard, IsOwnerOrAdminGuard, LoggedGuard } from '../guard/comment.guard';
import {
    AddCommentResult,
    CommentQueryResult,
    DeleteCommentResult,
    EnjoyCommentResult,
    UpdateCommentResult,
} from '../interface/comment.interface';
import { CommentService } from '../service/comment.service';
import { API } from '../../shared/constant/constant';

@Controller(API + '/' + COMMENT)
@ApiUseTags(COMMENT)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get(':articleId')
    @UseFilters(CommentHttpExceptionFilter)
    getComment(@Param('articleId', new ParseIntPipe()) id: number): Observable<CommentQueryResult> {
        return this.commentService.getCommentAndReplies(id);
    }

    @Post(CRUDVar.CREATE)
    @UseFilters(CommentHttpExceptionFilter)
    @UseGuards(LoggedGuard)
    async addComment(@Body() comment: CommentDto): Promise<AddCommentResult> {
        return this.commentService.addComment(comment);
    }

    @Post(REPLY + '/' + CRUDVar.CREATE)
    @UseFilters(CommentHttpExceptionFilter)
    @UseGuards(LoggedGuard)
    async addReply(@Body() reply: ReplyDto): Promise<UpdateCommentResult> {
        return this.commentService.addReply(reply);
    }

    @Delete(CRUDVar.DELETE)
    @UseFilters(CommentHttpExceptionFilter)
    @UseGuards(LoggedGuard, IsOwnerOrAdminGuard)
    async deleteComment(@Body() info: CommentDeleteDto): Promise<DeleteCommentResult> {
        return this.commentService.deleteComment(info.id);
    }

    @Put(CRUDVar.UPDATE)
    @UseFilters(CommentHttpExceptionFilter)
    @UseGuards(LoggedGuard, IsNotEnjoySelfCommentGuard)
    async enjoyComment(@Body() enjoy: EnjoyCommentDto): Promise<EnjoyCommentResult> {
        return this.commentService.updateComment(enjoy);
    }
}
