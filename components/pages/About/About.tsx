import React from 'react';
import { Constrain } from '@quartz/interface';
import Page from 'components/Page/Page';
import PageSection from 'components/Page/PageSection/PageSection';
import AboutSubnav from 'components/AboutSubnav/AboutSubnav';
import AboutHeader from './components/AboutHeader/AboutHeader';
import AboutStaff from './components/AboutStaff/AboutStaff';
import AboutValues from './components/AboutValues/AboutValues';
import AboutCulture from './components/AboutCulture/AboutCulture';
import AboutContact from './components/AboutContact/AboutContact';
import styles from './About.module.scss';
import Video from 'components/Video/Video';

export default function About() {
	return (
		<Page
			canonicalPath="/about/"
			pageTitle="About"
			pageType="about"
		>
			<Constrain size="small">
				<div className={styles.videoHeader}>
					<Video
						src="https://cms.qz.com/wp-content/uploads/2021/03/MBB-Final-360-1.mp4"
						autoplay={false}
						poster="https://cms.qz.com/wp-content/uploads/2021/04/image.png"
					/>
				</div>
			</Constrain>
			<Constrain size="extra-large">
				<h1 className={styles.heading}>
					Our <span className={styles.decoration1}>mission</span> is to make business <span className={styles.decoration2}>better™.</span>
				</h1>
			</Constrain>
			<AboutSubnav entries={
				[
					{
						url: '/about/#staff',
						label: 'Staff',
					},
					{
						url: '/about/#values',
						label: 'Values',
					},
					{
						url: '/about/#culture',
						label: 'Culture',
					},
					{
						url: '/about/#contact',
						label: 'Contact',
					},
					{
						url: '/careers/',
						label: 'Careers',
					},
				]
			}
			/>
			<PageSection
				background={"alt"}
				leftGutter={true}
				hideTopBorder={true}
				hideTopPadding={true}
			>
				<AboutHeader />
			</PageSection>
			<PageSection leftGutter={true}>
				<AboutStaff />
			</PageSection>
			<PageSection background={"alt"} leftGutter={true}>
				<AboutValues />
			</PageSection>
			<div className={styles.culture}>
				<PageSection leftGutter={true}>
					<AboutCulture />
				</PageSection>
			</div>
			<PageSection background={"alt"} leftGutter={true}>
				<AboutContact />
			</PageSection>
		</Page>
	);
}
