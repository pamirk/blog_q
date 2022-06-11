import React, { Fragment } from 'react';
import classnames from 'classnames/bind';
import Link from '../../../../../components/Link/Link';
import styles from './About.module.scss';
import ClientList from '../ClientList/ClientList';
import { usePageByUriQuery } from '../../../../../@quartz/content';
import PageContent from '../PageContent/PageContent';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import EmailForm from '../EmailForm/EmailForm';

const cx = classnames.bind( styles );

const About = () => {
	const page = usePageByUriQuery( { variables: { slug: '/creative/about/' } } ).data?.pageBy;

	return (
		<Fragment>
			<VideoPlayer
				buttonLabel={<span><span className={cx( 'emphasized' )}>Watch</span> our brand video</span>}
				posterImageSrc="https://cms.qz.com/wp-content/uploads/2020/05/sizzle_poster.jpg?quality=80&strip=all"
				videoSrc="https://cms.qz.com/wp-content/uploads/2020/05/Were-Quartz-Creative.mp4"
			/>
			<PageContent loading={!page}>
				<div dangerouslySetInnerHTML={{ __html: page?.content }} />
				<div className={cx( 'client-list-container' )}>
					<h2>Our clients</h2>
					<ClientList />
				</div>
				<h2>Our offering</h2>
				<ul className={cx( 'links' )}>
					<li>Download our <Link to="https://cms.qz.com/wp-content/uploads/2020/12/PartnerMenu-Digital-Update1020.pdf">Partner Menu [PDF]</Link></li>
					<li>Follow us on <Link to="https://www.instagram.com/qzcreativestudio/">Instagram</Link></li>
					<li>Get in touch with our global sales team at <Link to="mailto:ads@qz.com">ads@qz.com</Link></li>
				</ul>
				<h2>Our newsletter</h2>
				<p>Sign up to receive The Mantle, a monthly email from Quartz Creative made with creative marketers in mind.</p>

				<EmailForm />
			</PageContent>
		</Fragment>
	);
};

export default About;
