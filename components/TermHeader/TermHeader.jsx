import React from 'react';
import PropTypes from 'prop-types';
import { resizeWPImage } from '../../@quartz/js-utils';
import SponsorLogo from '../../components/Ad/SponsorLogo/SponsorLogo';
import styles from './TermHeader.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

export const TermHeader = ( { description, featuredImage, name, slug, type } ) => {
	// We are naively loading a single image size for all screen sizes. Another
	// way to handle this would be to create a reusable component to implement
	// this hack:
	//
	// https://aclaes.com/responsive-background-images-with-srcset-and-sizes/
	//
	// Component would accept an image URL and render prop to render children.
	const style = {};

	if ( featuredImage ) {
		const { sourceUrl } = featuredImage;
		const resizedImageUrl = resizeWPImage( sourceUrl, 1600, null, false, true );
		style.backgroundImage = `url(${resizedImageUrl})`;
	}

	const adTargeting = {
		taxonomy: type,
		term: slug,
	};

	return (
		<div className={cx( 'container', { hasImage: featuredImage } )}>
			<div className={cx( 'featured-image' )} style={style} />
			<div className={cx( 'header' )}>
				<h1 className={cx( 'title', { hasDescription: description } )}>{name}</h1>
				{
					description &&
					<p className={cx( 'description' )}>{description}</p>
				}
				<SponsorLogo
					path="list"
					context="term-header"
					targeting={adTargeting}
					renderWhenViewable={false}
				/>
				{
					featuredImage &&
					<div className={cx( 'credit' )}>{featuredImage.credit}</div>
				}
			</div>
		</div>
	);
};

TermHeader.propTypes = {
	description: PropTypes.string,
	featuredImage: PropTypes.object,
	name: PropTypes.string,
	slug: PropTypes.string,
	type: PropTypes.string.isRequired,
};

export default TermHeader;
