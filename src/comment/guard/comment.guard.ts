import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ReflectMetadata,
} from '@nestjs/common';

import { AuthService } from '../../auth/service/auth.service';
import { Observable } from 'rxjs';
import { RepositoryToken } from '../../shared/config/config.enum';
import { Repository } from 'typeorm';

import { CommentEntity } from '../entity/comment.entity';

@Injectable()
export class LoggedGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const isLogged = await this.authService.hasLogged(request.body.userId);

        if (!isLogged) {
            throw new UnauthorizedException();
        }

        return isLogged;
    }
}

@Injectable()
export class IsAdminGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        return this.authService.isAdmin(request.body.userId);
    }
}

@Injectable()
export class IsOwnerOrAdminGuard implements CanActivate {
    constructor(
        @Inject(RepositoryToken.CommentRepositoryToken) private readonly commentRepository: Repository<CommentEntity>,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { id, userId } = request.body;

        const isOwner = await this.commentRepository.findOne(id).then(comment => comment.userId === userId);

        if (isOwner) {
            return true;
        } else {
            return this.authService.isAdmin(id);
        }
    }
}

@Injectable()
export class IsNotEnjoySelfCommentGuard implements CanActivate {
    constructor(
        @Inject(RepositoryToken.CommentRepositoryToken) private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.body.userId;
        const id = request.body.commentId;
        const notSelf = await this.commentRepository.findOne({ id }).then(comment => comment.userId !== userId);

        if (!notSelf) {
            throw new BadRequestException();
        }

        return notSelf;
    }
}
