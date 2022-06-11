import React from 'react';
import { Button } from '../../../../../@quartz/interface';
import PropTypes from 'prop-types';
import { withTracking } from '../../../../../helpers/wrappers';
import { makeTrackingAction } from '../../tracking';

const CancelMembershipButton = ( { loading, onClick, children } ) => (
	<Button
		variant="secondary"
		loading={loading}
		onClick={onClick}
	>
		{children}
	</Button>
);

CancelMembershipButton.propTypes = {
	children: PropTypes.node.isRequired,
	loading: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
};

CancelMembershipButton.defaultProps = {
	children: 'No thanks, I want to cancel',
};

const onClick = makeTrackingAction( { eventAction: 'Click cancel CTA' } );

export default withTracking( { onClick } )( CancelMembershipButton );
