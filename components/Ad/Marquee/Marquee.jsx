import {withRouter} from 'next/router';
import {connect} from 'react-redux';
import {activateMarquee, clearMarquee, fetchMarquee, renderMarquee} from './action';

import MarqueePlacement from './components/MarqueePlacement.jsx';
import MarqueeDefinition from './components/MarqueeDefinition.jsx';

const mapStateToProps = (state) => ({
    path: state.marquee.path,
    targeting: state.marquee.targeting,
});

const mapMarqueePlacementDispatchToProps = (dispatch) => ({
    onRouteChange: () => {
        dispatch(clearMarquee());
    },
    onRenderMarquee: () => {
        dispatch(renderMarquee());
    },
    onActivateMarquee: () => {
        dispatch(activateMarquee());
    },
});

export const MarqueeAd = connect(mapStateToProps, mapMarqueePlacementDispatchToProps)(withRouter(MarqueePlacement));

const mapMarqueeDefinitionDispatchToProps = (dispatch) => ({
    onFetchMarquee: ({path, targeting}) => {
        dispatch(fetchMarquee({path, targeting}));
    },
});

export const MarqueeUnit = connect(undefined, mapMarqueeDefinitionDispatchToProps)(MarqueeDefinition);
