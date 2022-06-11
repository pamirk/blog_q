import React, { Fragment } from 'react';
import PageContent from '../PageContent/PageContent';
import { usePageByUriQuery } from '@quartz/content';
import Link from 'components/Link/Link';
import { ButtonLabel } from '@quartz/interface';
import styles from './PartnerMenu.module.scss';

export default function About() {
	const page = usePageByUriQuery( { variables: { slug: '/creative/partner-menu/' } } ).data?.pageBy;

	return (
		<Fragment>
			<div className={styles.ctaContainer}>
				<div aria-hidden="true" className={styles.videoContainer}>
					{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
					<video
						width="100%"
						height="auto"
						autoPlay={true}
						controls={false}
						loop={true}
						muted={true}
						playsInline={true}
						preload="auto"
					>
						<source type="video/webm" src="https://cms.qz.com/wp-content/uploads/2020/12/QZC-PMAnimation-1080.webm" />
						<source type="video/mp4" src="https://cms.qz.com/wp-content/uploads/2021/01/QZC-PMAnimation-1080.mp4" />
					</video>
				</div>
				<Link className={styles.videoLink} to="https://cms.qz.com/wp-content/uploads/2020/12/PartnerMenu-Digital-Update1020.pdf"><span className={styles.emphasized}>Download</span> our<br />Q1 partner menu</Link>
			</div>
			<PageContent loading={!page}>
				<div dangerouslySetInnerHTML={{ __html: page?.content ?? '' }} />
				<Link className={styles.pdfLink} to="https://cms.qz.com/wp-content/uploads/2020/12/PartnerMenu-Digital-Update1020.pdf">
					<ButtonLabel>Download now</ButtonLabel>
				</Link>
			</PageContent>
		</Fragment>
	);
}
