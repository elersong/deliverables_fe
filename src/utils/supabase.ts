import {createClient} from "@supabase/supabase-js";

export const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
);

export const TRACKS_TABLE = "tracks";
export const AUDIO_BUCKET = "audio";