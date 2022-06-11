import React from 'react';
import PropTypes from 'prop-types';
import styles from './SeriesHeader.module.scss';
import classnames from 'classnames/bind';
import SponsorLogo from '../../components/Ad/SponsorLogo/SponsorLogo';
import SeriesHeaderMedia from './SeriesHeaderMedia';
import SeriesHeaderCredit from './SeriesHeaderCredit';

const cx = classnames.bind( styles );

const SeriesHeader = ( {
	description,
	headerImages,
	headerVideos,
	hideTitle,
	slug,
	name,
	taxonomy,
} ) => (
	<div className={cx( 'container' )}>
		<div className={cx( 'media-container' )}>
			<SeriesHeaderMedia
				headerImages={headerImages}
				headerVideos={headerVideos}
				name={name}
				slug={slug}
			/>
		</div>
		<h1 className={hideTitle ?  cx( 'sr-title' ) : cx( 'title' )}>{name}</h1>
		<div className={cx( 'sponsor' )}>
			<SponsorLogo
				path="list"
				context="term-header"
				targeting={{
					taxonomy,
					term: slug,
				}}
				sponsorText={'guide' === taxonomy ? 'Unlocked for you by' : undefined}
				renderWhenViewable={false}
			/>
		</div>
		<div className={cx( 'description' )} dangerouslySetInnerHTML={{ __html: description }} />
		<SeriesHeaderCredit headerVideos={headerVideos} headerImages={headerImages} />
	</div>
);

SeriesHeader.defaultProps = {
	taxonomy: 'series',
};

SeriesHeader.propTypes = {
	description: PropTypes.string,
	headerImages: PropTypes.arrayOf( PropTypes.object ),
	headerVideos: PropTypes.arrayOf( PropTypes.object ),
	hideTitle: PropTypes.bool,
	name: PropTypes.string,
	slug: PropTypes.string,
	taxonomy: PropTypes.string,
};

SeriesHeader.defaultProps = {
	hideTitle: true,
};

export default SeriesHeader;
