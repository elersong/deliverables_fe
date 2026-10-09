import type {Rating, Stars, Track} from "./types.ts";
import {AUDIO_BUCKET, RATINGS_TABLE, supabaseClient, TRACKS_TABLE} from "./supabase.ts";

const integerWithin = (maxValue: number):number => Math.floor(Math.random()*maxValue);

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

export async function getRating(trackId: string): Promise<number> {
    const {data, error} = await supabaseClient.from(RATINGS_TABLE).select().eq("track_id", trackId);
    if (error != null) throw new Error("Could not fetch rating data.");

    const rating = data[0];
    const total: number =   rating.stars_1 + (rating.stars_2 * 2) + (rating.stars_3 * 3) +
                            (rating.stars_4 * 4) + (rating.stars_5 * 5);
    const count: number = rating.stars_1 + rating.stars_2 + rating.stars_3 + rating.stars_4 + rating.stars_5;
    return count == 0 ? 0 : total / count;
}

// admin function signatures

export async function uploadNewTrack(file: File, title: string): Promise<Track> {
    const extension = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${extension}`;

    // Send to storage bucket
    const {error: uploadError} = await supabaseClient.storage.from(AUDIO_BUCKET)
                                        .upload(filePath, file, { contentType: file.type, cacheControl: "31536000"});

    if (uploadError) throw new Error("Could not upload audio file to storage.");

    const {data, error: insertError} = await supabaseClient.from(TRACKS_TABLE)
        // all other fields have defaults in the db
        .insert({title, storage_path: filePath})
        .select().single(); // returns the created Track

    if (insertError) throw new Error("Could not save new audio record.");

    return {
        id: data.id,
        title: data.title,
        audioUrl: supabaseClient
            .storage.from(AUDIO_BUCKET)
            .getPublicUrl(data.storage_path).data.publicUrl,
        isVisible: data.is_visible,
        createdAt: data.created_at
    };
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