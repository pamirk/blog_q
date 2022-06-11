import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import SponsoredObsessionAd from '../../components/Ad/SponsoredObsession/SponsoredObsession';
import {withApollo} from '../../data/apollo';
import {ArticlesByObsessionDocument} from '../../@quartz/content';

const ad = {
    path: 'list',
    targeting: {
        page: 'obsessions',
    },
};

const sponsoredObsessionRate = 2; // how many obsessions before inject a sponsored obsession
const sponsorObsessionStart = 2; // index of the first sponsored obsession
const maxSponsoredObsession = 1; // max number of sponsored obsessions in the list
const sponsoredObsessionTileStart = 1; // the tile number of the first sponsored obsession in the list, passed to GPT

const withSponsoredObsessionAds = ObsessionsComponent => {
    class ObsessionsWithAds extends PureComponent {
        constructor(props) {
            super(props);

            this.getSponsoredObsessionAds = this.getSponsoredObsessionAds.bind(this);
            this.handleSponsorObsessionData = this.handleSponsorObsessionData.bind(this);
            this.fetchSponsorObsessionData = this.fetchSponsorObsessionData.bind(this);
            this.parseAndSetSponsoredObsessions = this.parseAndSetSponsoredObsessions.bind(this);

            this.state = {
                sponsoredObsessions: [],
            };
        }

        getSponsoredObsessionAds(num) {
            const {path, targeting} = ad;
            const sponsoredObsessionAds = [];
            const sponsoredObsessionNum = Math.min(num, maxSponsoredObsession);

            for (let i = 0; i < sponsoredObsessionNum; i += 1) {
                const pos = i * (sponsoredObsessionRate + 1) + sponsorObsessionStart;
                const tile = i + sponsoredObsessionTileStart;

                // we need to use the name of the Obsessions component (ie Obsessions or ObsessionsNavMenu) in the id in order to distinguish ads from different components
                sponsoredObsessionAds.push(<SponsoredObsessionAd
                    key={`${ObsessionsComponent.name}-sponsored-obsession-${i}`} // Use component name to distinguish between Obsession item and nav menu Obsession
                    id={`${ObsessionsComponent.name}-sponsored-obsession-${i}`}
                    path={path}
                    targeting={{...targeting, tile}}
                    onSponsoredObsessionData={this.handleSponsorObsessionData.bind(this, pos)}
                />);
            }

            return sponsoredObsessionAds;
        }

        handleSponsorObsessionData(pos, adCallData) {
            this
                .fetchSponsorObsessionData(adCallData.slug)
                .then((queryData) => {
                    this.parseAndSetSponsoredObsessions(queryData.data.obsessions.nodes[0], pos, adCallData);
                });
        }

        fetchSponsorObsessionData(slug) {
            const {client} = this.props;
            return client.query({
                query: ArticlesByObsessionDocument,
                variables: {
                    slug,
                    perPage: 1,
                },
            });
        }

        parseAndSetSponsoredObsessions(post, pos, adCallData) {
            const {sponsoredObsessions} = this.state;
            const sponsoredObsessionWithTracking = {...post};

            // Merge ad call tracking data into GraphQL data
            sponsoredObsessionWithTracking.sponsor = {
                ...post.sponsor,
                clientTracking: {
                    clickThroughUrl: adCallData.clickThroughUrl,
                    viewImpressionUrl: adCallData.viewImpressionUrl,
                    elsewhere: [],
                },
            };

            const sortedObsessions = [...sponsoredObsessions, {
                data: sponsoredObsessionWithTracking,
                pos: pos
            }].sort((obsessionA, obsessionB) => obsessionA.pos > obsessionB.pos);

            this.setState({
                sponsoredObsessions: sortedObsessions,
            });
        }

        render() {
            const {items, ...props} = this.props;
            const {sponsoredObsessions} = this.state;

            const collectionOfObsessions = sponsoredObsessions.reduce((collection, obsession) => [...collection.slice(0, obsession.pos), obsession.data, ...collection.slice(obsession.pos)], items);

            // if no regular Obsessions have yet been loaded, don't pass down any items nor make any ad calls
            if (!collectionOfObsessions) {
                return (
                    <ObsessionsComponent
                        {...props}
                    />
                );
            }

            const numSponsoredObsession = Math.floor(collectionOfObsessions.length / sponsoredObsessionRate);
            const sponsoredObsessionAdCalls = this.getSponsoredObsessionAds(numSponsoredObsession);

            return (
                <Fragment>
                    <ObsessionsComponent
                        items={collectionOfObsessions}
                        {...props}
                    />
                    {sponsoredObsessionAdCalls}
                </Fragment>
            );
        }
    }

    ObsessionsWithAds.propTypes = {
        client: PropTypes.object.isRequired,
        items: PropTypes.arrayOf(PropTypes.object), // apollo client to do the sponsored obsession query
    };

    return withApollo(ObsessionsWithAds);
};

export default withSponsoredObsessionAds;
