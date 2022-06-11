import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import StyledElement from '../../components/StyledElement/StyledElement';
import ArticleFootnote from '../../components/ArticleFootnote/ArticleFootnote';
import ArticleImage from '../../components/ArticleImage/ArticleImage';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import Audio from '../../components/Audio/Audio';
import blockFilters from './blockFilters';
import EmbeddedContent from '../../components/Embeds/EmbeddedContent';
import EndMatter from '../../components/EndMatter/EndMatter';
import FurtherReading from '../../components/FurtherReading/FurtherReading';
import Highlight from '../../components/Highlight/Highlight';
import { Inline } from '../../components/Ad/Ad';
import Instagram from '../../components/Instagram/Instagram';
import Interactive from '../../components/Interactive/Interactive';
import Loom from '../../components/Loom/Loom';
import PropTypes from 'prop-types';
import PullQuote from '../../components/PullQuote/PullQuote';
import Sponsor from '../../components/Ad/Sponsor/Sponsor';
import Tips from '../../components/Tips/Tips';
import Twitter from '../../components/Twitter/Twitter';
import GuidePromo from '../../components/GuidePromo/GuidePromo';
import Video from '../../components/Video/Video';
import { updateArticleScrollDepth } from '../../helpers/tracking/actions';
import { withProps } from '../../helpers/wrappers';
import {
	SHORTCODE_QZ_TIPS,
	SHORTCODE_QZ_GUIDE_PROMO,
	SHORTCODE_QZ_INTERACTIVE,
	AD,
	SHORTCODE_QZ_INLINE_AD,
	SPONSOR,
	SHORTCODE_PULLQUOTE,
	SHORTCODE_AUDIO,
	SHORTCODE_VIDEO,
	FOOTNOTE,
	highlight,
	HR,
	SHORTCODE_ENDMATTER,
	SHORTCODE_CAPTION,
	SHORTCODE_QZ_FURTHER_READING,
	EMBED_ATLAS,
	EMBED_DATAWRAPPER,
	EMBED_DOCUMENTCLOUD,
	EMBED_LOOM,
	EMBED_SCRIBD,
	EMBED_FACEBOOK_ALTERNATE,
	EMBED_FACEBOOK_ALTERNATE_VIDEO,
	EMBED_FACEBOOK_PHOTO,
	EMBED_FACEBOOK_VIDEO,
	EMBED_INSTAGRAM,
	EMBED_JETPACK_INSTAGRAM_ALTERNATE_FORMAT,
	EMBED_QZ_OBJECT,
	EMBED_REDDIT,
	EMBED_SOUNDCLOUD,
	EMBED_SPOTIFY,
	EMBED_TIKTOK,
	EMBED_TWITTER,
	EMBED_VIMEO,
	EMBED_WPCOM_VIMEO_EMBED_URL,
	EMBED_WPCOM_YOUTUBE_EMBED_CRAZY_URL,
	EMBED_YOUTUBE,
	SHORTCODE_GALLERY,
	SHORTCODE_INSTAGRAM,
	SHORTCODE_QZ_FACEBOOK_POST,
	SHORTCODE_QZ_FACEBOOK_VIDEO,
	SHORTCODE_QZ_ATLAS,
	SHORTCODE_QZ_DATAWRAPPER,
	SHORTCODE_SCRIBD,
	SHORTCODE_TWITTER_TIMELINE,
	SHORTCODE_YOUTUBE,
	P,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	EL,
	OL,
	UL,
	PRE,
	FIGURE,
	BLOCKQUOTE,
	TABLE,
} from '../../helpers/types/blocks';
import { Blockquote } from '../../@quartz/interface';
import useScrollDepth from '../../helpers/hooks/useScrollDepth';
import { useInnerHTMLArticleLinkTracking } from '../../helpers/tracking/segment/hooks/useInnerHTMLArticleLinkTracking';
import { stripInlineStyling } from '../../helpers/text';
import SponsoredEssentialStack from '../../components/Essentials/SponsoredEssential/SponsoredEssential';

export const ArticleContentBlocks = ( {
	ad,
	article: {
		blocks,
		bulletin,
		postId,
		suppressAds,
	},
	cx,
	footnoteTracker,
	isAmp,
	isPremium,
	isWorkGuide,
	paywallType,
	setFootnoteRef,
} ) => {
	const dispatch = useDispatch();
	const [ ref, milestone ] = useScrollDepth();
	const trackingRef = useInnerHTMLArticleLinkTracking();
	const {
		hasSponsoredEssential,
		sponsoredEssential,
	} = SponsoredEssentialStack( { ad } );

	useEffect( () => {
		dispatch( updateArticleScrollDepth( milestone ) );
	}, [ dispatch, milestone ] );

	// Keep track of the number of inline ads displayed.
	let tile = 0;

	const content = blocks.map( ( block, index ) => {
		const { attributes, blockProps, innerHtml, type } = block;

		switch ( type ) {
			case BLOCKQUOTE:
				return (
					<Blockquote key={index}>
						<div dangerouslySetInnerHTML={{ __html: stripInlineStyling( innerHtml ) }} />
					</Blockquote>
				);

			case SHORTCODE_QZ_TIPS:
				return <Tips key={index} customText={innerHtml} />;

			case SHORTCODE_QZ_GUIDE_PROMO:
				const { slug } = blockProps;
				return <GuidePromo key={index} customText={innerHtml} slug={slug} />;

			case SHORTCODE_QZ_INTERACTIVE: {
				const { size, url, title } = blockProps;

				return (
					<Interactive
						id={`${postId}-interactive-${index}`}
						key={index}
						sidebarVisible={false}
						size={size}
						src={url}
						title={title || `Interactive content ${index + 1}`}
					/>
				);
			}

			case AD:
			case SHORTCODE_QZ_INLINE_AD:
				if ( bulletin || suppressAds || paywallType ) {
					return null;
				}

				// add tile to existing targeting key/values
				tile++;

				const inlineAdProps = {
					id: `inline-${tile}`,
					path: ad.path,
					targeting: { ...ad.targeting, tile },
					className: 'article-content-ad',
				};

				// if we have a sponsored essential stack, it will override the 2nd inline slot
				return (
					<Fragment key={index}>
						{
							tile === 1 ?
								<>
									{!hasSponsoredEssential &&
										<Inline {...inlineAdProps} />
									}
									{sponsoredEssential}
								</> : <Inline {...inlineAdProps} />
						}
					</Fragment>
				);

			case SPONSOR:
				return (
					<Sponsor
						path={ad.path}
						key={index}
						render={
							( { messages } ) => {
								if ( !messages.length ) {
									return null;
								}

								return <p className={cx( 'sponsor-message' )}>{messages[0].text}</p>;
							}
						}
						targeting={ad.targeting}
					/>
				);

			case SHORTCODE_PULLQUOTE:
				return (
					<PullQuote
						key={index}
						isPremium={isPremium}
						{...block}
					/>
				);

			case SHORTCODE_AUDIO:
				const {
					loop: loopAudio,
					ogg,
					m4a,
					mp3,
					src: audioSrc,
					wav,
					wma,
					...audioProps
				} = blockProps;

				return (
					<Audio
						key={index}
						loop={loopAudio}
						src={audioSrc || m4a || mp3 || ogg || wav || wma}
						{...audioProps}
					/>
				);

			case SHORTCODE_VIDEO:
				const {
					autoplay,
					controls,
					loop: loopVideo,
					mp4,
					src: videoSrc,
					...videoProps
				} = blockProps;

				return (
					<Video
						innerHtml={innerHtml}
						key={index}
						autoplay={'on' === autoplay}
						controls={'on' === controls || 'on' !== autoplay}
						loop={'on' === loopVideo}
						src={mp4 || videoSrc}
						{...videoProps}
					/>
				);

			case FOOTNOTE:
				return (
					<ArticleFootnote
						key={index}
						block={block}
						show={footnoteTracker[ block.footnoteIndex ]}
						setRef={setFootnoteRef}
					/>
				);

			case highlight:
				return <Highlight key={index} {...block} />;

			case SHORTCODE_ENDMATTER:
				return <EndMatter key={index} {...block} />;

			case SHORTCODE_CAPTION:
				// Ensure height and width are numbers (block attributes are not
				// schema'd and are always strings).
				blockProps.height = parseInt( blockProps.height, 10 ) || 1;
				blockProps.width = parseInt( blockProps.width, 10 ) || 1;

				return (
					<ArticleImage
						key={index}
						isPremium={isPremium}
						{...blockProps}
					/>
				);

			case SHORTCODE_QZ_FURTHER_READING:
				return <FurtherReading key={index} {...blockProps} />;

			case EMBED_TWITTER:
			case SHORTCODE_TWITTER_TIMELINE:
				return <Twitter isAmp={isAmp} key={index} postId={postId} url={blockProps.url} />;

			case EMBED_LOOM:
				return <Loom isAmp={isAmp} key={index} postId={postId} url={blockProps.url} />;

			case SHORTCODE_INSTAGRAM:
			case EMBED_INSTAGRAM:
			case EMBED_JETPACK_INSTAGRAM_ALTERNATE_FORMAT:
				return <Instagram isAmp={isAmp} key={index} postId={postId} url={blockProps.url} />;

			case EMBED_ATLAS:
			case EMBED_DATAWRAPPER:
			case EMBED_DOCUMENTCLOUD:
			case EMBED_SCRIBD:
			case EMBED_FACEBOOK_ALTERNATE:
			case EMBED_FACEBOOK_ALTERNATE_VIDEO:
			case EMBED_FACEBOOK_PHOTO:
			case EMBED_FACEBOOK_VIDEO:
			case EMBED_QZ_OBJECT:
			case EMBED_REDDIT:
			case EMBED_SOUNDCLOUD:
			case EMBED_SPOTIFY:
			case EMBED_TIKTOK:
			case EMBED_VIMEO:
			case EMBED_WPCOM_VIMEO_EMBED_URL:
			case EMBED_WPCOM_YOUTUBE_EMBED_CRAZY_URL:
			case EMBED_YOUTUBE:
			case SHORTCODE_GALLERY:
			case SHORTCODE_QZ_FACEBOOK_POST:
			case SHORTCODE_QZ_FACEBOOK_VIDEO:
			case SHORTCODE_QZ_ATLAS:
			case SHORTCODE_QZ_DATAWRAPPER:
			case SHORTCODE_SCRIBD:
			case SHORTCODE_YOUTUBE:
				// force width and height to be ints instead of strings
				[ 'width', 'height' ].forEach( attr => {
					if ( blockProps[attr] ) {
						blockProps[attr] = parseInt( blockProps[attr], 10 );
					}
				} );

				// The Scribd embed shortcode accepts an attribute called 'key', which is a
				// reserved prop name. We will rename it to access_key instead
				if ( 'undefined' !== typeof blockProps.key ) {
					blockProps.access_key = blockProps.key;
					delete blockProps.key;
				}

				return <EmbeddedContent isAmp={isAmp} key={index} type={type} {...blockProps} />;

			case P:
			case H1:
			case H2:
			case H3:
			case H4:
			case H5:
			case H6:
			case HR:
			case EL:
			case OL:
			case UL:
			case PRE:
			case FIGURE:
			case TABLE:
				const element = (
					<StyledElement
						attributes={attributes || []}
						innerHtml={innerHtml}
						isWorkGuide={isWorkGuide}
						key={index}
						tagName={type.toLowerCase()}
					/>
				);

				if ( type === 'TABLE' ) {
					return (
						<div key={index} className={cx( 'scrollable-container' )}>
							{element}
						</div>
					);
				}

				return element;

			default:
				return null;
		}
	} ).filter( Boolean );

	return (
		<div id="article-content" ref={ref}>
			<div ref={trackingRef}>
				{content}
			</div>
		</div>
	);
};

ArticleContentBlocks.propTypes = {
	ad: articlePropTypes.ad,
	article: PropTypes.shape( articlePropTypes ).isRequired,
	cx: PropTypes.func.isRequired,
	footnoteTracker: PropTypes.arrayOf( PropTypes.bool ),
	isAmp: PropTypes.bool.isRequired,
	isPremium: PropTypes.bool.isRequired,
	isWorkGuide: PropTypes.bool.isRequired,
	paywallType: PropTypes.string,
	setFootnoteRef: PropTypes.func.isRequired,
};

// Filters allow us to conditionally add blocks (e.g., inline ads) based on the
// articles props.
const addBlocks = props => ( {
	article: {
		...props.article,
		blocks: blockFilters.reduce( ( newBlocks, filter ) => filter( newBlocks, props ), props.article.blocks ),
	},
} );

export default withProps( addBlocks )( ArticleContentBlocks );
