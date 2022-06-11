import PropTypes from 'prop-types';

export let articlePropTypes = {
    title: PropTypes.any,
    kicker: PropTypes.any,
    featuredImageSize: PropTypes.any,
    authors: PropTypes.any,
    bulletin: PropTypes.any,
    dateGmt: PropTypes.any,
    featuredImage: PropTypes.any,
    authorLocation: PropTypes.any,
    video: {
        id: PropTypes.any,
        related: PropTypes.any,
    },
    guide: PropTypes.any,
    postId: PropTypes.any,
    series: PropTypes.any,
    ad: PropTypes.any

}
export default articlePropTypes