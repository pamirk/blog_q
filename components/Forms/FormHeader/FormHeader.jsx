import React from 'react';
import PropTypes from 'prop-types';
import styles from '../Forms.module.scss';

const FormHeader = ( { description, title } ) => (
	<header className={styles.header}>
		<h1 className={styles.title}>{title}</h1>
		<div className={styles.description}>{description}</div>
	</header>
);

FormHeader.propTypes = {
	description: PropTypes.node,
	title: PropTypes.node,
};

export default FormHeader;
