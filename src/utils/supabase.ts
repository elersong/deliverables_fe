import {createClient} from "@supabase/supabase-js";
import type {Database} from "./database.types.ts";

export const supabaseClient = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
);

export const TRACKS_TABLE = "tracks";
export const AUDIO_BUCKET = "audio";
export const RATINGS_TABLE = "track_ratings";