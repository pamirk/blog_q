import React from 'react';
import Link from '../../components/Link/Link';
import PropTypes from 'prop-types';
import styles from './Tips.module.scss';

const Tips = ( { customText } ) => {
	const body = customText ? customText : 'This story is from Quartz’s investigations team. Here’s how you can reach us with feedback or tips:';

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<p className={styles.header}>Let us know if you know more.</p>
				<p className={styles.description}>{body}</p>
				<ul className={styles.contact}>
					<li key="email"><strong>Email</strong> (insecure): <Link to="mailto:investigations@qz.com">investigations@qz.com</Link></li>
					<li key="signal"><strong>Signal</strong> (secure): +1 929 202 9229</li>
					<li key="tip-line"><strong>More options</strong>: <Link to="/tips/">qz.com/tips/</Link></li>
				</ul>
			</div>
		</div>
	);
};

Tips.propTypes = {
	customText: PropTypes.string,
};

export default Tips;
