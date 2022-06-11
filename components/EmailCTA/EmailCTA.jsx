import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './EmailCTA.module.scss';
import Link from '../../components/Link/Link';
import ResponsiveImage from '../../components/ResponsiveImage/ResponsiveImage';

const cx = classnames.bind( styles );

const screenshotImageWidth = 220;
const screenshotImageHeight = 448;

const EmailCTA = ( {
	description,
	heading,
	linkText,
	linkUrl,
	screenshotAlt,
	screenshotUrl,
	subheading,
} ) => (
	<div className={cx( 'container' )}>
		<div>
			<h2 className={cx( 'heading' )}>{heading}</h2>
			<h3 className={cx( 'subheading' )}>{subheading}</h3>
			<p className={cx( 'description' )}>{description}</p>
			<p className={cx( 'link' )}><Link to={linkUrl}>{linkText}</Link></p>
		</div>
		<div className={cx( 'screenshot-container' )}>
			<Link to={linkUrl}>
				<ResponsiveImage
					src={screenshotUrl}
					alt={screenshotAlt}
					aspectRatio={screenshotImageWidth / screenshotImageHeight}
					className={cx( 'screenshot' )}
					sources={[
						/*
							Using ResponsiveImage even though the image doesn't
							change size because we get retina sizes for free
						*/
						{
							breakpoint: 'phone-only',
							width: screenshotImageWidth,
							height: screenshotImageHeight,
						},
					]}
				/>
			</Link>
		</div>
	</div>
);

EmailCTA.propTypes = {
	description: PropTypes.node.isRequired,
	heading: PropTypes.string.isRequired,
	linkText: PropTypes.string.isRequired,
	linkUrl: PropTypes.string.isRequired,
	screenshotAlt: PropTypes.string,
	screenshotUrl: PropTypes.string.isRequired,
	subheading: PropTypes.string.isRequired,
};

export default EmailCTA;
