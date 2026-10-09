import type {Track} from "../utils/types.ts";
import {useQuery} from "@tanstack/react-query";
import {getRating} from "../utils/api.ts";

interface RatingWidgetProps {
    track: Track
}

const RatingWidget = ({track}:RatingWidgetProps) => {
    const {data} = useQuery({
        queryKey: ['fetch-rating', track.id],
        queryFn: () => getRating(track.id)
    });

    return (<p><span className={"ratingAvg"}>Current Performance Review: </span>{data?.average.toFixed(2)} / 5</p>);
}
export default RatingWidget;