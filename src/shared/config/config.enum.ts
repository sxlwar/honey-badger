export enum ConfigVar {
    PORT = 'PORT',
    HOST = 'HOST',
    MYSQL_URI = 'MYSQL_URI',
}

export enum RepositoryToken {
    DbConnectionToken = 'DbConnectionToke',
    ArticleRepositoryToken = 'ArticleRepositoryToken',
    ArticleStatisticsRepositoryToken = 'ArticleStatisticsRepositoryToken',
    CommentRepositoryToken = 'CommentRepositoryToken',
    CommentReplyRepositoryToken = 'CommentReplyRepositoryToken',
    AuthRepositoryToken = 'AuthRepositoryToken',
    SubscriptionToken = 'SubscriptionToken',
}

export enum GithubAuth {
    clientId = '54a9e9e065ccb8f11871',
    clientSecret = 'a1b780ca64f823fda42ea01d3e037672a61039fd',
    redirect = 'https://blog.chtoma.com',
}

export enum GithubAuthTest {
    clientId = 'd9cd51d2ac0a7386eb8e',
    clientSecret = '2d8b184a7e59a45131fbdddd1358c49cffd7f86a',
    redirect = 'http://localhost:3000',
}

export enum GithubAuthDev {
    clientId = '3eafb3aec84747984908',
    clientSecret = 'a7ed4cb9567a898b1a413355087a4f82ddebf7dc',
    redirect = 'http://localhost:4200',
}

/**
 * Update token below if domain changed;
 */
export enum QiniuToken {
    accessKey = 'Y7KtC0UrXL6JB1MaH1Z3VaVLgK-7XJEHkhWCC4xx',
    secretKey = '80nRC4OM7yANxQhp8iC722C7ybCyTuluzMXKxUnb',
    bucket = 'images',
}
