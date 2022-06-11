import React from 'react';
import ImageLoader from 'components/ImageLoader/ImageLoader';
import Link from 'components/Link/Link';
import { ButtonLabel } from '@quartz/interface';
import useArticlesByGuide from 'data/hooks/useArticlesByGuide';
import useTracking, { useTrackingOnMount } from 'helpers/hooks/useTracking';
import { trackCtaClick, trackCtaView } from 'helpers/tracking/actions';
import { getSrcSet } from 'helpers/images';
import { resizeWPImage } from '@quartz/js-utils';
import styles from './GuidePromo.module.scss';

export default function GuidePromo ( props: {
	customText?: string,
	slug: string,
} ) {
	const { customText, slug } = props;
	const data = useArticlesByGuide( slug, 1, false );

	const trackingData = {
		context: slug,
		ctaName: 'guide promo',
	};

	const onClick = useTracking( trackCtaClick, trackingData );
	useTrackingOnMount( trackCtaView, trackingData );

	if ( ! data?.guide ) {
		return null;
	}

	const { guide: { description, featuredImage, link } } = data;

	if ( ! featuredImage?.sourceUrl ) {
		return null;
	}

	const imageSrcSetParams = [ [ 150, 210 ], [ 192, 270 ] ];
	const imageSrcSet = getSrcSet( featuredImage.sourceUrl, imageSrcSetParams );

	return (
		<div className={styles.container}>
			<div className={styles.inner}>
				{
					featuredImage &&
						<figure className={styles.image}>
							<Link
								to={link}
								onClick={onClick}
							>
								<ImageLoader
									alt={featuredImage.altText || ''}
									height={featuredImage.mediaDetails?.height}
									width={featuredImage.mediaDetails?.width}
									lazyLoad
									src={resizeWPImage( featuredImage.sourceUrl, 192, 270 )}
									srcSet={imageSrcSet}
								/>
							</Link>
						</figure>
				}
				<Link
					to={link}
					onClick={onClick}
					className={styles['text-link']}
				>
					<div className={styles.text}>
						<p className={styles.kicker}>
							<span aria-label="Hole" role="img"> 🕳️</span> Take me down this rabbit hole
						</p>
						<p className={styles.paragraph}>
							{description}
						</p>
						{
							customText && (
								<p className={styles.paragraph}>{customText}</p>
							)
						}
					</div>
				</Link>
			</div>
			<Link to={link} onClick={onClick}>
				<ButtonLabel>Learn more</ButtonLabel>
			</Link>
		</div>
	);
}
