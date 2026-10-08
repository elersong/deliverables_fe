import {Rating} from "@fluentui/react-rating";
import {CircleFilled, CircleRegular} from "@fluentui/react-icons";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {submitRating} from "../utils/api.ts";
import type {Stars} from "../utils/types.ts";
import {useEffect, useState} from "react";

interface StarInputProps {
    trackId: string
}

const StarInput = ({trackId}: StarInputProps) => {
    const queryClient = useQueryClient();

    const [currentRatingValue, setCurrentRatingValue] = useState(0);

    const mutation = useMutation({
        mutationFn: (ratingValue: Stars) => submitRating(trackId, ratingValue),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fetch-rating', trackId],})
    });

    useEffect(() => {
        if (currentRatingValue == 0) return;
        mutation.mutate(currentRatingValue as Stars);

        // Show the new rating for 2s before resetting field for the next user
        const newTimeoutId: number = window.setTimeout(() => setCurrentRatingValue(0), 2000);
        return () => window.clearTimeout(newTimeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRatingValue]);

    return (
        <div className="ratingInline">
            <p>Rate the worker's performance on the task from 1-5: </p>
            <Rating
                iconFilled={CircleFilled}
                iconOutline={CircleRegular}
                value={currentRatingValue}
                onChange={(_, data) => setCurrentRatingValue(data.value)}
            />
        </div>
    )
}

export default StarInput;