import React from 'react';
import styles from './PageSectionFooter.module.scss';
import Link from 'components/Link/Link';
import RightArrow from 'svgs/expand-arrow-right';

const PageSectionFooter = ( props: {
	hideTop?: boolean,
	text: string,
	url: string,
	} ) => (
	<Link to={props.url} className={`${styles.link} ${props.hideTop && styles.hideTop}`}>
		<p className={styles.text}>{props.text}</p>
		<RightArrow className={styles.rightArrow} />
	</Link>
);

PageSectionFooter.defaultProps = {
	hideTop: false,
};

export default PageSectionFooter;
