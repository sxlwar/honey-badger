export type Category = 'angular' | 'rxjs' | 'typescript' | 'css' | 'javascript' | 'other';

export interface Article {
    id: number;
    author: string;
    createDate: string;
    updateDate: string;
    title: string;
    subtitle: string;
    content: string;
    isPublished: boolean;
    isDeleted: boolean;
    category: Category[];
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
