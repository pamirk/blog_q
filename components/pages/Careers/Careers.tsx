import React from 'react';
import CareersHeader from 'components/CareersHeader/CareersHeader';
import CareersOpenings from 'components/CareersOpenings/CareersOpenings';
import CareersBenefits from 'components/CareersBenefits/CareersBenefits';
import CareersAbout from 'components/CareersAbout/CareersAbout';
import Page from 'components/Page/Page';
import PageSection from 'components/Page/PageSection/PageSection';
import styles from './Careers.module.scss';

export default function Careers () {
	return (
		<Page
			canonicalPath="/careers/"
			pageDescription="Join our global team of smart, curious, and kind colleagues who have embraced the opportunity to change the way news is consumed on the internet."
			pageTitle="Careers"
			pageType="careers"
			socialImage="https://cms.qz.com/wp-content/uploads/2018/06/staff.jpg?quality=80"
			socialTitle="Jobs at Quartz"
		>
			<div className={styles.header}>
				<PageSection
					background={"alt"}
					hideBottomPadding
					hideTopBorder
					hideTopPadding
				>
					<CareersHeader />
				</PageSection>
			</div>
			<PageSection
				background={"alt"}
				hideTopBorder
			>
				<CareersOpenings />
			</PageSection>
			<PageSection background={"alt"}>
				<CareersBenefits />
			</PageSection>
			<PageSection background={"alt"}>
				<CareersAbout />
			</PageSection>
		</Page>
	);
}
