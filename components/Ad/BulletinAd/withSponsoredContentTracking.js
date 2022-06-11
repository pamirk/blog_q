import React from 'react';
import PropTypes from 'prop-types';
import {get, logImpression} from '../../../helpers/utils';

/**
 * A function that takes the post type ("article"/"chapter") and
 * the sponsored content field name ("bulletin"/"sponsor"), and returns an HOC
 * that provides tracking to a wrapped component.
 */
const withSponsoredContentTracking = ({elementName, elementAdName}) => WrappedComponent => {
    class SponsoredContentTracking extends React.Component {

        constructor(props) {
            super(props);

            this.onClick = this.onClick.bind(this);
        }

        /**
         * Fire 1st party click through url impression when bulletin is clicked on
         *
         * @return void
         */
        onClick() {
            const tracking = this.getTracking();
            logImpression(tracking.clickThroughUrl);
        }

        getTracking() {
            return get(this.props, `${elementName}.${elementAdName}.clientTracking`, {});
        }

        /**
         * Track the view impression url when this component mounts
         * Also track any third party view impressions
         *
         * @return void
         */
        componentDidMount() {
            const tracking = this.getTracking();
            const thirdPartyTracking = tracking.elsewhere;

            logImpression(tracking.viewImpressionUrl);

            thirdPartyTracking?.forEach((url) => {
                logImpression(url);
            });
        }

        render() {
            return <WrappedComponent {...this.props} onClick={this.onClick}/>;
        }
    }

    SponsoredContentTracking.propTypes = {
        [elementName]: PropTypes.shape({
            [elementAdName]: PropTypes.shape({
                clientTracking: PropTypes.shape({
                    elsewhere: PropTypes.array,
                }),
            }),
        }).isRequired,
    };

    return SponsoredContentTracking;
};

export default withSponsoredContentTracking;

export const withBulletinTracking = withSponsoredContentTracking({elementName: 'article', elementAdName: 'bulletin'});
