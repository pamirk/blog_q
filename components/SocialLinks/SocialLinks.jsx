import React from 'react';
import classnames from 'classnames/bind';
import styles from './SocialLinks.module.scss';
import links from '../../config/links';
import { Icon } from '../../@quartz/interface';
import InstagramIcon from '../../svgs/instagram';
import YouTubeIcon from '../../svgs/youtube';
import MessengerIcon from '../../svgs/messenger';

const cx = classnames.bind( styles );

const socialSourceNames = {
	facebook: 'Facebook',
	facebookGroup: 'Facebook Group',
	instagram: 'Instagram',
	messenger: 'Messenger',
	twitter: 'Twitter',
	youtube: 'YouTube',
	linkedin: 'LinkedIn',
};

const getIcon = ( source ) => {
	switch ( source ) {
		case 'twitter':
			return <Icon name="twitter" className={cx( 'icon' )} />;
		case 'instagram':
			return <InstagramIcon className={cx( 'icon' )} />;
		case 'facebook':
		case 'facebookGroup':
			return <Icon name="facebook" className={cx( 'icon' )} />;
		case 'youtube':
			return <YouTubeIcon className={cx( 'icon', 'youtube' )} />;
		case 'linkedin':
			return <Icon name="linkedin" className={cx( 'icon' )} />;
		case 'messenger':
			return <MessengerIcon className={cx( 'icon' )} />;
		default:
			return null;
	}
};

const SocialLinks = () => {
	const editionLinks = links();
	const socialLinkKeys = Object.keys( editionLinks.social );

	return (
		<ul className={styles.container}>
			{
				socialLinkKeys.map( ( source, index ) => (
					<li className={styles.item} key={index}>
						<a href={editionLinks.social[source]}>
							<div aria-hidden={true}>{getIcon( source )}</div>
							<div className={styles.name}>{socialSourceNames[source]}</div>
						</a>
					</li>
				) )
			}
		</ul>
	);
};

export default SocialLinks;
