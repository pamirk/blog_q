import React, { Fragment } from 'react';
import styles from './InlineMembershipPromo.module.scss';
import { SubscribeLink } from 'components/AccountLink/AccountLink';
import useUserRole from 'helpers/hooks/useUserRole';

export default function InlineMembershipPromo( props: { promoText?: string; trackingContext?: string } ) {
	const { promoText, trackingContext = 'nug promo' } = props;
	const { isMember } = useUserRole();

	if ( isMember ) {
		return null;
	}

	return (
		<Fragment>
			{
				promoText &&
				<p className={styles.description}>
					{promoText}
				</p>
			}
			<SubscribeLink trackingContext={trackingContext} buttonVariant="primary">
				✨ Become a Quartz member ✨
			</SubscribeLink>
		</Fragment>
	);
}
