export type Category = 'angular' | 'rxjs' | 'typescript' | 'css' | 'javascript' | 'other';

export interface ArticleOverview {
    id: number;
    author: string;
    createdAt: string;
    title: string;
    category: Category[];
}

export interface Article extends ArticleOverview {
    updatedAt: string;
    subtitle: string;
    content: string;
    isPublished: boolean;
    isDeleted: boolean;
}

export interface ArticleUpdate {
    id: number;
    content: string;
}

export interface ArticleStatistics {
    id: number;
    enjoy?: number;
    view?: number;
    stored?: number;
}

export interface ArticleSearch {
    author?: string;
    title?: string;
    isPublished?: boolean;
    category?: string[];
    offset?: number;
    limit?: number;
}
