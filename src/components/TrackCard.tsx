import type {Track} from "../types.ts";
import H5AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import RatingWidget from "./RatingWidget.tsx";
import StarInput from "./StarInput.tsx";

interface TrackCardProps {
    track: Track;
}

const TrackCard = ({ track }: TrackCardProps) => {
    return (
        <article className="trackCard">
            <h2>{track.title}</h2>

            <div className="audioPlayerContainer">
                <H5AudioPlayer
                    src={track.audioUrl}
                    layout={'horizontal'}
                />
            </div>

            <RatingWidget track={track} />
            <StarInput trackId={track.id} />

        </article>
    );
}

export default TrackCard;