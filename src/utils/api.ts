import type {Rating, Stars, Track} from "./types.ts";
import {AUDIO_BUCKET, supabaseClient, TRACKS_TABLE} from "./supabase.ts";

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


export async function getTracks(): Promise<Track[]> {
    const {data, error} = await supabaseClient.from(TRACKS_TABLE).select();
    if (error != null) throw new Error("Could not fetch track data.");
    return data.map((trackTableRow): Track => {
        return {
            id: trackTableRow.id,
            title: trackTableRow.title,
            audioUrl: supabaseClient
                .storage.from(AUDIO_BUCKET)
                .getPublicUrl(trackTableRow.storage_path).data.publicUrl,
            isVisible: trackTableRow.is_visible,
            createdAt: trackTableRow.created_at
        };
    });
}

export async function submitRating(trackId: string, rating: Stars): Promise<Rating> {
    const {data, error} = await supabaseClient.rpc("submit_rating", {
        p_track_id: trackId,
        p_stars: rating
    });

    if (error != null) throw new Error("Could not submit new rating.");

    return {
        trackId: data.track_id,
        star1: data.stars_1,
        star2: data.stars_2,
        star3: data.stars_3,
        star4: data.stars_4,
        star5: data.stars_5,
    };
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