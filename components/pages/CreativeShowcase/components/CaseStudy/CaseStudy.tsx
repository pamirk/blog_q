import React, { Fragment } from 'react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './CaseStudy.module.scss';
import Link from 'components/Link/Link';
import PlusMinusToggle from 'svgs/plus-minus-toggle';
import ResponsiveImage from 'components/ResponsiveImage/ResponsiveImage';
import RightArrowIcon from 'svgs/right-arrow';

const cx = classnames.bind( styles );

const heroImageSizes = [
	{
		breakpoint: 'phone-only',
		width: 712,
	},
	{
		breakpoint: 'tablet-portrait-up',
		width: 344,
	},
	{
		breakpoint: 'tablet-landscape-up',
		width: 472,
	},
	{
		breakpoint: 'desktop-up',
		width: 800,
	},
];

const HeroImage = ( props: { alt?: string, src: string } ) => (
	<ResponsiveImage
		alt={props.alt || ''}
		aspectRatio={16 / 9}
		className={cx( 'featured-image' )}
		src={props.src}
		sources={heroImageSizes}
	/>
);

const CaseStudyTitle = ( props: { title: string } ) => {
	/*
		We expect project titles to match the format 'x for y', so we can
		split this into two parts and style each one differently.
	*/
	const titleParts = props.title.split( ' for ' );
	const [ projectName, client ] = titleParts;

	return (
		<h2 className={cx( 'title' )}>
			<span className={cx( 'emphasized' )}>{projectName}</span>
			{
				client &&
				<span>{` for ${client}`}</span>
			}
		</h2>
	);
};

interface CaseStudyPropTypes {
	content?: string,
	description: string,
	featuredImage: {
		altText?: string,
		sourceUrl: string,
	},
	isFeatured: boolean,
	link: string,
	tabName: string,
	title: string,
}

const CaseStudy = ( props: CaseStudyPropTypes ) => {
	const {
		content,
		description,
		featuredImage,
		isFeatured = true,
		link,
		tabName,
		title,
	} = props;
	return (
		<Fragment>
			<div className={cx( 'container', { isFeatured } )}>
				{
					featuredImage &&
						<div className={cx( 'featured-image-container' )}>
							<HeroImage
								alt={featuredImage.altText}
								src={featuredImage.sourceUrl}
							/>
						</div>
				}
				<div className={cx( 'text-container' )}>
					{
						isFeatured &&
						<div className={cx( 'title-container' )}>
							{'insights' === tabName ? ( // for insights, we expect links to be pdfs
								<a href={link} target="_blank" rel="noreferrer" className={cx( 'cta' )}>
									<CaseStudyTitle title={title} />
									<RightArrowIcon aria-hidden={true} className={cx( 'cta-icon' )} />
								</a>
							) : (
								<Link to={link} className={cx( 'cta' )} target="_blank">
									<CaseStudyTitle title={title} />
									<RightArrowIcon aria-hidden={true} className={cx( 'cta-icon' )} />
								</Link>
							)}
						</div>
					}
					<span className={cx( 'heading', { isFeatured } )}>{description}</span>
					<div className={cx( 'content' )} dangerouslySetInnerHTML={{ __html: content || '' }} />
					{
						! isFeatured &&
						<Link to={link} className={cx( 'cta' )} target="_blank">
							<span>{`Launch ${'display' === tabName ? 'ads' : 'project'}`}</span>
							<RightArrowIcon aria-hidden={true} className={cx( 'ctaIcon' )} />
						</Link>
					}
				</div>
			</div>
		</Fragment>
	);
};

const ExpandableCaseStudy = ( props: CaseStudyPropTypes ) => (
	<details className={cx( 'expandable' )}>
		<summary className={cx( 'summary' )}>
			<div className={cx( 'summary-contents' )}>
				<div className={cx( 'summary-heading-container' )}>
					<CaseStudyTitle title={props.title} />
					<span className={cx( 'summaryHeading' )}>{props.description}</span>
				</div>
				<PlusMinusToggle aria-hidden={true} className={cx( 'toggle-icon' )} />
			</div>
		</summary>
		<CaseStudy {...props} isFeatured={false} />
	</details>
);

ExpandableCaseStudy.propTypes = {
	description: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export { ExpandableCaseStudy };
export default CaseStudy;
