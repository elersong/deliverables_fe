import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getTracks, setVisibility, uploadNewTrack} from "../utils/api.ts";
import type {Track} from "../utils/types.ts";
import type {SubmitEvent} from "react";
import {supabaseClient} from "../utils/supabase.ts";

export const AdminPanel = () => {
    const queryClient = useQueryClient();
    const tracks = useQuery({queryKey: ["tracks", "all"], queryFn: getTracks});

    const refreshTracks = () => queryClient.invalidateQueries({queryKey: ["tracks", "all"]});

    const upload = useMutation({
        mutationFn: ({file, title}: { file: File; title: string }) => uploadNewTrack(file, title),
        onSuccess: refreshTracks,
    });

    const visibility = useMutation({
        mutationFn: ({track, isVisible}: { track: Track; isVisible: boolean }) => setVisibility(track, isVisible),
        onSuccess: refreshTracks,
    });

    const handleUpload = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const file = data.get("file");
        const title = String(data.get("title") ?? "").trim();
        if (!(file instanceof File) || file.size === 0 || !title) return;
        upload.mutate({file, title}, {onSuccess: () => form.reset()});
    };

    return (
        <main>
            <h1>Admin</h1>
            <button type="button" onClick={() => supabaseClient.auth.signOut()}>Sign out</button>

            <section>
                <h2>Upload a track</h2>
                <form onSubmit={handleUpload}>
                    <label>Title <input name="title" type="text" required/></label>
                    <label>Audio file <input name="file" type="file" accept="audio/*" required/></label>
                    <button type="submit" disabled={upload.isPending}>
                        {upload.isPending ? "Uploading…" : "Upload track"}
                    </button>
                </form>
                {upload.isSuccess && <p role="status">Uploaded.</p>}
                {upload.isError && <p role="alert">Upload failed: {upload.error.message}</p>}
            </section>

            <section>
                <h2>Tracks</h2>
                {tracks.isPending && <p>Loading tracks…</p>}
                {tracks.isError && <p role="alert">Couldn't load tracks: {tracks.error.message}</p>}
                {tracks.data?.length === 0 && <p>No tracks yet. Upload one above.</p>}
                <ul>
                    {tracks.data?.map((track) => (
                        <li key={track.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={track.isVisible}
                                    disabled={visibility.isPending}
                                    onChange={(event) => visibility.mutate({track, isVisible: event.target.checked})}
                                />
                                {track.title}
                            </label>
                        </li>
                    ))}
                </ul>
                {visibility.isError && <p role="alert">Couldn't update: {visibility.error.message}</p>}
            </section>
        </main>
    );
};