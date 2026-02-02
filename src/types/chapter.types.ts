// File: src/types/chapter.types.ts

export interface Chapter {
    id: string;
    name: string;
    description: string | null;
    orderIndex: number;
    grade: string;
    schoolCategoryId: string;
    modeId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChapterTopic {
    id: string;
    topicName: string;
    topicMode: string;
    cefrLevel: string;
    attachmentUrl: string | null;
    unlocksAt: string | null;
    grade: string | null;
    orderIndex: number | null;
    isCompleted: boolean;
}

export interface ChapterTopicsResponse {
    statusMessage: string;
    data: {
        chapter: Chapter;
        topics: ChapterTopic[];
    };
}

export interface TopicsOrChaptersResponse {
    statusMessage: string;
    data: {
        topics?: any[];
        chapters?: Chapter[];
        isChapterBased: boolean;
    };
}
