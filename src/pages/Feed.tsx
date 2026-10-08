import {useQuery} from "@tanstack/react-query";
import {getTracks} from "../api.ts";
import TrackCard from "../components/TrackCard.tsx";


const Feed = () => {
    const {data} = useQuery({
        queryKey: ['tracks-for-feed', true],
        queryFn: () => getTracks(true)
    });

    return (
        <>
            <h1>Deliverables</h1>
            {data?.map((track) => {
                return <TrackCard track={track} key={track.id} />
            })}
        </>
    );
}

export default Feed;