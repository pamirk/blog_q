import React from 'react';
import PropTypes from 'prop-types';
import styles from './CalloutCard.module.scss';

const CalloutCard = ( { children } ) => (
	<div className={styles.container}>
		{children}
	</div>
);

CalloutCard.propTypes = {
	/**
	 * Child nodes to be rendered as the inner content of the callout card.
	 */
	children: PropTypes.node.isRequired,
};

export default CalloutCard;
