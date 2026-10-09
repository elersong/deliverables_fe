import type {Track} from "../utils/types.ts";
import {type UseMutationResult, useQuery} from "@tanstack/react-query";
import {getRating} from "../utils/api.ts";

interface AdminTrackTableRowProps {
    track: Track;
    visibility: UseMutationResult<Track, Error, {
            track: Track;
            isVisible: boolean;
        }, unknown>;
    remove: UseMutationResult<void, Error, {
            track: Track;
        }, unknown>;
}

export const AdminTrackTableRow = ({track, visibility, remove}: AdminTrackTableRowProps) => {
    const { data, isFetching, isError } = useQuery({
        queryKey: ['fetch-rating', track.id],
        queryFn: () => getRating(track.id),
    })


    return (
        <tr key={track.id}>
            <td>
                <input
                    type="checkbox"
                    aria-label={`Visibility for ${track.title}`}
                    checked={track.isVisible}
                    disabled={visibility.isPending}
                    onChange={(event) => visibility.mutate({track, isVisible: event.target.checked})}
                />
            </td>
            <td><label>{track.title}</label></td>
            <td>
                {isFetching && <p>Loading</p>}
                {isError && 'N/A'}
                {data?.average.toFixed(2)}
            </td>
            <td>
                {isFetching && <p>Loading</p>}
                {isError && 0}
                {data?.totalCount}
            </td>
            <td>
                <button type="button" onClick={() => remove.mutate({track})}>
                    Delete
                </button>
            </td>
        </tr>
    );
}