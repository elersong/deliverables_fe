import type {Stars, Track, VoteDistribution} from "./types.ts";
import {supabaseClient} from "./supabase.ts";

//const BASE = import.meta.env.VITE_API_URL;

const integerWithin = (maxValue: number):number => Math.floor(Math.random()*maxValue);

const generateTrack = (isFeed: boolean = true): Track => {
    const number = integerWithin(75);
    return {
        id: `${number}`,
        title: `track-${number}`,
        audioUrl: "src/assets/file_example_MP3_1MG.mp3",
        isVisible: isFeed ? true : (Math.random() > 0.5),
        createdAt: Date.UTC(2026, 9,23,integerWithin(24),integerWithin(60)).toString()
    }
}

const generateVoteDistribution = (): VoteDistribution => {
    return {
        1: integerWithin(15),
        2: integerWithin(15),
        3: integerWithin(15),
        4: integerWithin(15),
        5: integerWithin(15)
    }
}

export async function getTracks(): Promise<Track[]> {
    const {data, error} = await supabaseClient.from(import.meta.env.VITE_SUPABASE_TRACK_TABLE_NAME).select();
    if (error != null) throw new Error("Could not fetch track data.");
    console.log(data);
    return data.map((trackTableRow): Track => {
        return {
            id: trackTableRow.id,
            title: trackTableRow.title,
            audioUrl: supabaseClient
                .storage.from(import.meta.env.VITE_SUPABASE_AUDIO_STORAGE_NAME)
                .getPublicUrl(trackTableRow.storage_path).data.publicUrl,
            isVisible: trackTableRow.is_visible,
            createdAt: trackTableRow.created_at
        };
    });
}

export function submitRating(trackId: string, rating: Stars): Promise<VoteDistribution> {
    console.log(`New Rating Submitted for ${trackId} of ${rating} stars.`);
    return new Promise<VoteDistribution>((resolve) => {
        setTimeout(() => resolve(generateVoteDistribution()), integerWithin(500));
    });
}

export function getRating(trackId: string): Promise<number> {
    console.log(`Fetching rating for ${trackId}`);
    return new Promise<number>((resolve) => {
        setTimeout(() => resolve(Math.random() * 5), integerWithin(450));
    });
}

// admin function signatures

export function getAllTracks(): Promise<Track[]> {
    return getTracks();
}

export function uploadNewTrack(file: File, title: string): Promise<Track> {
    console.log(`New Track Upload named ${title} via ${file.name}`);
    return new Promise<Track>((resolve) => {
        setTimeout(() => resolve(generateTrack()), integerWithin(1000));
    });
}

export function deleteTrack(id: string): Promise<void> {
    console.log(`Deleted track with id: "${id}"`);
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), integerWithin(500));
    });
}

export function setVisibility(track: Track, newVisibility: boolean): Promise<Track> {
    track.isVisible = newVisibility
    return new Promise<Track>((resolve) => {
        setTimeout(() => resolve(track), integerWithin(750));
    });
}