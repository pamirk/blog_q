import React from 'react';
import PropTypes from 'prop-types';
import compose from '../../helpers/compose';
import styles from './SocialLogin.module.scss';
import classnames from 'classnames/bind';
import { Icon } from '../../@quartz/interface';
import {
	withAuth0,
	withNotifications,
	withUserApi,
} from '../../helpers/wrappers';

const cx = classnames.bind( styles );

export const ssoProviders = [
	{
		name: 'apple',
		displayName: 'Apple',
		Icon: ( props ) => <Icon name="apple" {...props} />,
	},
	{
		name: 'facebook',
		displayName: 'Facebook',
		Icon: ( props ) => <Icon name="facebook" {...props} />,
	},
	{
		name: 'twitter',
		displayName: 'Twitter',
		Icon: ( props ) => <Icon name="twitter" {...props} />,
	},
	{
		name: 'linkedin',
		displayName: 'LinkedIn',
		Icon: ( props ) => <Icon name="linkedin" {...props} />,
	},
];

export const SocialLogin = ( {
	auth0Ready,
	authorize,
	loginUserWithAuth0Token,
} ) => {
	const loginWithProvider = connection => {
		authorize( connection )
			.then( ( { idToken } ) => loginUserWithAuth0Token( { idToken } ) );
	};

	return (
		<div className={cx( 'container' )}>
			{
				ssoProviders.map( ( { name, displayName, Icon } ) => (
					<button
						type="button"
						key={name}
						className={cx( 'button' )}
						disabled={!auth0Ready}
						onClick={() => loginWithProvider( name )}
						title={`Log in with ${displayName}`}
					>
						<span className={cx( 'label' )}>{`Log in with ${displayName}`}</span>
						<Icon />
					</button>
				) )
			}
		</div>
	);
};

SocialLogin.propTypes = {
	auth0Ready: PropTypes.bool.isRequired,
	authorize: PropTypes.func.isRequired,
	loginUserWithAuth0Token: PropTypes.func.isRequired,
};

export default compose(
	withAuth0(),
	withNotifications,
	withUserApi()
) ( SocialLogin );
