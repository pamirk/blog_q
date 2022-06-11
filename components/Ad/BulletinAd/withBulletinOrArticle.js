import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BulletinAd from './BulletinAd.jsx';
import withApolloData from './withApolloData.js';

// takes an ArticleComponent template and returns a component that will render either
// the ArticleComponent with bulletin data, or the children component inside the component if no bulletin data is returned
// children component could be any component or null
// the component will be able to pass down its props to the ArticleComponent on render

let Index = (ArticleComponent) => {

    const BulletinComponent = withApolloData(ArticleComponent);

    class BulletinOrArticle extends Component {

        constructor(props) {
            super(props);

            this.handleBulletinData = this.handleBulletinData.bind(this);

            this.state = {
                hasMadeAdCall: false,
            };
        }

        handleBulletinData(bulletin) {
            this.setState({bulletin, hasMadeAdCall: true});
        }

        render() {
            const {id, targeting, path, dataProp, children} = this.props;
            const {bulletin, hasMadeAdCall} = this.state;

            const bulletinAdCall = (
                <BulletinAd
                    path={path}
                    id={id}
                    key={id}
                    onBulletinData={this.handleBulletinData}
                    targeting={targeting}
                />
            );

            const bulletinArticle = (
                <BulletinComponent
                    bulletin={bulletin}
                    dataProp={dataProp}
                    {...this.props}
                    key={`bulletin-${id}`}
                />
            );

            // if the user has not made an adCall, render the bulletinAdCall
            if (hasMadeAdCall) {

                // if the bulletin is truthy render the bulletin else render child component that was wrapped in this component
                if (bulletin) {
                    return bulletinArticle;
                }

                return children;
            }

            return bulletinAdCall;
        }
    }

    BulletinOrArticle.propTypes = {
        children: PropTypes.element,
        dataProp: PropTypes.string.isRequired, // the data article prop name for passed in bulletin component
        id: PropTypes.string.isRequired, // id for the bulletin ad slot, used as a key to key off a window post event
        path: PropTypes.string.isRequired,
        targeting: PropTypes.object.isRequired,
    };

    BulletinOrArticle.defaultProps = {
        targeting: {},
        children: null,
        dataProp: 'article',
    };

    return BulletinOrArticle;
};

export default Index