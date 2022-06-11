import React from 'react';
import { Button } from '../../../../../@quartz/interface';
import PropTypes from 'prop-types';

const AcceptDiscountButton = ( { loading, disabled, children } ) => (
	<Button type="submit" disabled={disabled} loading={loading}>
		{children}
	</Button>
);

AcceptDiscountButton.propTypes = {
	children: PropTypes.node.isRequired,
	disabled: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
};

AcceptDiscountButton.defaultProps = {
	children: 'Stick around and save 50%',
};

export default AcceptDiscountButton;
