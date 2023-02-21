import YouTube from 'react-youtube';
import { TMDBMovie } from '../../types';

const VideoPlayer = (props: { movie: TMDBMovie, options?: { height: string, width: string } }) => {
    const { height, width } = props.options || {};

    const ytPlayerOpts = {
        height: height ? height : '360',
        width: width ? width : '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
    };

    const _onReady = (event: any) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    return (
        <YouTube videoId={props.movie.key} opts={ytPlayerOpts} onReady={_onReady} />
    )
}

export default VideoPlayer