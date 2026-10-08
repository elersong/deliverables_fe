export type Stars = 1 | 2 | 3 | 4 | 5;

export interface Track {
    id: string;
    title: string;
    audioUrl: string;
    isVisible: boolean;
    createdAt: string;
}

export interface Rating {
    id: string;
    trackId: string;
    votes: VoteDistribution;
}

export type VoteDistribution = Record<Stars, number>;