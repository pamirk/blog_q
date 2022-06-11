import React from 'react';
import styles from './PageSectionHeader.module.scss';
import classnames from 'classnames/bind';
import Link from 'components/Link/Link';

const cx = classnames.bind( styles );

const PageSectionHeader = ( props: {
	isBlock?: boolean,
	description?: string | JSX.Element,
	fullWidth?: boolean,
	id?: string,
	title: string | JSX.Element,
	titleTagName?: 'h1' | 'h2',
	url?: string,
} ) => {
	const {
		isBlock = false,
		description,
		fullWidth = false,
		id,
		title,
		titleTagName = 'h2',
		url,
	} = props;
	// If the section is nested as a block within a feed, we want to style the header differently
	const titleClass = isBlock ? 'title-block' : 'title';
	const titleContent = React.createElement( titleTagName || 'h2', { id, className: cx( titleClass ) }, title );

	return (
		<div className={cx( isBlock ? 'container block' : 'container' )}>
			{url ? (
				<Link to={url}>
					{titleContent}
				</Link>
			) : titleContent}
			{description && (
				<p className={cx( 'description', { fullWidth } )}>{description}</p>
			)}
		</div>
	);
};

export default PageSectionHeader;
