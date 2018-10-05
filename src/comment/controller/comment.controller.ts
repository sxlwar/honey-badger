import { Body, Controller, Get, Param, ParseIntPipe, Post, UseFilters, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { CRUDVar } from '../../shared/constant/constant';

import { COMMENT, REPLY } from '../constant/constant';
import { CommentDto, EnjoyCommentDto, CommentDeleteDto } from '../dto/comment.dto';
import { ReplyDto } from '../dto/comment.reply.dto';
import { CommentHttpExceptionFilter } from '../filter/comment.http.exception.filter';
import { AddCommentResult, CommentQueryResult } from '../interface/comment.interface';
import { CommentService } from '../service/comment.service';
import { Observable } from 'rxjs';
import { LoggedGuard, IsAdminGuard, IsNotEnjoySelfCommentGuard } from '../guard/comment.guard';

@Controller(COMMENT)
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
    async addReply(@Body() reply: ReplyDto): Promise<boolean> {
        return this.commentService.addReply(reply);
    }

    @Delete(CRUDVar.DELETE)
    @UseFilters(CommentHttpExceptionFilter)
    @UseGuards(LoggedGuard, IsAdminGuard)
    async deleteComment(@Body() info: CommentDeleteDto): Promise<boolean> {
        return this.commentService.deleteComment(info.id);
    }

    @Put(CRUDVar.UPDATE)
    @UseFilters(CommentHttpExceptionFilter)
    @UseGuards(LoggedGuard, IsNotEnjoySelfCommentGuard)
    async enjoyComment(@Body() enjoy: EnjoyCommentDto): Promise<boolean> {
        return this.commentService.updateComment(enjoy);
    }
}
