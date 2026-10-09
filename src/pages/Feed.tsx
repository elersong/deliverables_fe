import {useQuery} from "@tanstack/react-query";
import {getTracks} from "../utils/api.ts";
import TrackCard from "../components/TrackCard.tsx";


const Feed = () => {
    const {data} = useQuery({
        queryKey: ['tracks-for-feed'],
        queryFn: getTracks
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