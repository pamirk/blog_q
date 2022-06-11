import {useContext} from 'react';
import {PianoContext} from 'pages/_app';

// Very basic helper to build on.
// All this does is share whether the Piano script has been loaded,
// plus the `tp` global.

declare global {
    interface Window {
        tp: any;
    }
}

export default function usePiano() {
    const pianoConfigured = useContext(PianoContext);

    if ('undefined' !== typeof window) {
        return {pianoConfigured, tp: window.tp};
    }

    return {tp: [], pianoConfigured};
}
