import React from 'react';
import { useRouter } from 'next/router';
import styles from './CreativeShowcase.module.scss';
import About from './components/About/About';
import CaseStudies from './components/CaseStudies/CaseStudies';
import PartnerMenu from './components/PartnerMenu/PartnerMenu';
import Page from 'components/Page/Page';
import Link from 'components/Link/Link';
import QuartzCreativeLogo from 'svgs/quartz-creative-logo';

const pages = [
	{
		label: 'Content',
		path: '/creative/',
	},
	{
		label: 'Display',
		path: '/creative/display/',
	},
	{
		label: 'Partner Menu',
		path: '/creative/partner-menu/',
	},
	{
		label: 'About',
		path: '/creative/about/',
	},
];

function Nav ( props: { currentPath: string } ) {
	const { currentPath } = props;

	return (
		<nav>
			<ul className={styles.navList}>
				{
					pages.map( page => {
						const { label, path } = page;

						return (
							<li key={path} className={styles.navListItem}>
								<Link
									className={styles.navLink}
									current={path === currentPath}
									to={path}
								>{label}</Link>
							</li>
						);
					} )
				}
			</ul>
		</nav>
	);
}

function Header ( props: { currentPath: string } ) {
	return (
		<header className={styles.header}>
			<div className={styles.titleContainer}>
				<Link to="/creative/">
					<QuartzCreativeLogo
						aria-label="Quartz Creative"
						className={styles.logo}
						role="img"
					/>
				</Link>
				<h1 className={styles.heading}>Complex stories,<br />simply told.</h1>
				<p className={styles.tagline}>Welcome to brand storytelling for the digital age.</p>
				<p className={styles.intro}>We craft mobile-first experiences on behalf of our brand partners for our audience of next-generation business leaders.</p>
			</div>
			<Nav currentPath={props.currentPath} />
		</header>
	);
}

function Content ( props: { currentPath?: string } ) {
	switch ( props.currentPath ) {
		case '/creative/about/':
			return <About />;
		case '/creative/partner-menu/':
			return <PartnerMenu />;
		case '/creative/display/':
			return <CaseStudies tabName="display" />;
		default:
			return <CaseStudies tabName="case-studies" />;
	}
}

function CreativeShowcase () {
	const router = useRouter()
	const { subpage } = router.query;

	let canonicalPath = '/creative/';
	let pageTitle = 'Quartz Creative';

	if ( subpage ) {
		canonicalPath = `${canonicalPath}${subpage}/`;
		const { label } = pages.find( page => page.path === canonicalPath ) || {};
		pageTitle = `${label} — ${pageTitle}`;
	}

	return (
		<Page
			canonicalPath={canonicalPath}
			hideNavigation={true}
			pageDescription="As the creative studio for Quartz, we craft mobile-first experiences for brand partners and next-generation business leaders."
			pageTitle={pageTitle}
			pageType="quartz-creative"
			socialImage="https://cms.qz.com/wp-content/uploads/2020/05/QZC-Showcase.png"
		>
			<div className={styles.container}>
				<Header currentPath={canonicalPath} />
				<Content currentPath={canonicalPath} />
			</div>
		</Page>
	);
}

export default CreativeShowcase;
