import React from 'react';
import styles from './TabBar.module.scss';
import useUserRole from '../../helpers/hooks/useUserRole';
import { useRouter as useLocation } from 'next/router'
import { withTracking } from '../../helpers/wrappers';
import { trackTabClick } from '../../helpers/tracking/actions';
import Link from '../../components/Link/Link';
import { SUBSCRIBE_EMAIL_STEP } from '../../config/membership';
import DiscoverIcon from '../../svgs/discover';
import EmailIcon from '../../svgs/email-at-symbol';
import LatestIcon from '../../svgs/clock';
import MembershipIcon from '../../svgs/membership-badge-icon';
import ObsessionsIcon from '../../svgs/obsessions';

const TrackedLink = withTracking( { onClick: trackTabClick } )( Link );

function TabBar () {
	const { isMember } = useUserRole();
	const { pathname } = useLocation();
	const isCurrentLink = pattern => !! pathname.replace( /^\/(africa|india|japan|work)/, '' ).match( pattern );

	return (
		<nav className={styles.container} id="tab-bar">
			<ul className={styles.tabs}>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/discover\// )}
						to="/discover/"
					>
						<DiscoverIcon aria-hidden={true} className={styles.icon} />
						<span>Discover</span>
					</TrackedLink>
				</li>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/latest\// )}
						to="/latest/"
					>
						<LatestIcon aria-hidden={true} className={styles.icon} />
						<span>Latest</span>
					</TrackedLink>
				</li>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/(obsessions|on)\// )}
						to="/obsessions/"
					>
						<ObsessionsIcon aria-hidden={true} className={styles.icon} />
						<span>Obsessions</span>
					</TrackedLink>
				</li>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/emails\// )}
						to="/emails/"
					>
						<EmailIcon aria-hidden={true} className={styles.icon} />
						<span>Emails</span>
					</TrackedLink>
				</li>
				<li className={styles.tab}>
					<TrackedLink
						className={styles.link}
						current={isCurrentLink( /^\/guides?\// )}
						to="/guides/"
					>w
						<MembershipIcon aria-hidden={true} className={styles.icon} />
						<span>Field guides</span>
					</TrackedLink>
					{/*{*/}
					{/*	! isMember &&*/}
					{/*	<TrackedLink*/}
					{/*		className={styles.link}*/}
					{/*		current={isCurrentLink( /^\/subscribe\// )}*/}
					{/*		to={SUBSCRIBE_EMAIL_STEP}*/}
					{/*	>*/}
					{/*		<MembershipIcon aria-hidden={true} className={styles.icon} />*/}
					{/*		<span>Subscribe</span>*/}
					{/*	</TrackedLink>*/}
					{/*}*/}
				</li>
			</ul>
		</nav>
	);
}

export default TabBar;
