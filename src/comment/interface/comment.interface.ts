import { CommentEntity } from '../entity/comment.entity';

export interface AddCommentResult {
    id: number;
    createdAt: string;
}

export interface CommentQueryResult {
    comments: CommentEntity[];
    count: number;
}

export interface DeleteCommentResult {
    isDeleted: boolean;
}

export interface EnjoyCommentResult {
    updated: boolean;
}

export interface UpdateCommentResult {
    updated: boolean;
}
