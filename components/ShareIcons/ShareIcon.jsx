import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../components/Link/Link';
import useTracking from '../../helpers/hooks/useTracking';
import { trackCtaClick } from '../../helpers/tracking/actions';
import styles from './ShareIcon.module.scss';
import classnames from 'classnames/bind';
import { Icon } from '../../@quartz/interface';
import InstagramIcon from '../../svgs/instagram';
import ExternalLinkIcon from '../../svgs/external-link';
import WhatsAppIcon from '../../svgs/whatsapp';
import SMSIcon from '../../svgs/sms';

const cx = classnames.bind( styles );

const getIcon = ( service ) => {
	switch ( service ) {
		case 'email':
			return <Icon name="envelope" />;
		case 'facebook':
			return <Icon name="facebook" />;
		case 'instagram':
			return <InstagramIcon/>;
		case 'linkedin':
			return <Icon name="linkedin" />;
		case 'twitter':
			return <Icon name="twitter" />;
		case 'whatsapp':
			return <WhatsAppIcon/>;
		case 'sms':
			return <SMSIcon/>;
		default:
			return <ExternalLinkIcon />;
	}
};

export const ShareIcon = ( {
	service,
	title,
	trackingData,
	url,
} ) => {
	const onClick = useTracking( trackCtaClick, { ctaName: `Share Icon: ${service}`, ...trackingData } );
	return (
		<Link
			className={cx( 'container', service )}
			onClick={onClick}
			rel={service === 'email' ? null : 'noopener'}
			target={service === 'email' ? null : '_blank'}
			title={title || `Share via ${service}`}
			to={url}
		>
			{getIcon( service )}
		</Link>
	);
};

ShareIcon.propTypes = {
	service: PropTypes.string.isRequired,
	title: PropTypes.string,
	trackingData: PropTypes.object,
	url: PropTypes.string.isRequired,
};

export default ShareIcon;
