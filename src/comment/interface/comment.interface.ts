import { CommentEntity } from '../entity/comment.entity';

export interface AddCommentResult {
    id: number;
    createdAt: string;
}

export interface CommentQueryResult  {
    comments: CommentEntity[];
    count: number;
}
