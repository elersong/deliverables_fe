export type Stars = 1 | 2 | 3 | 4 | 5;

export interface Track {
    id: string;
    title: string;
    audioUrl: string;
    isVisible: boolean;
    createdAt: string;
}

export interface Rating {
    trackId: string;
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
}
