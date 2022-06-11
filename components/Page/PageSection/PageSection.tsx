import React from 'react';
import classnames from 'classnames/bind';
import styles from './PageSection.module.scss';

const cx = classnames.bind( styles );

const PageSection = ( props: {
	background?: 'alt' | 'default' | 'dark-overlay' | 'medium-dark-overlay' | 'none',
	children: React.ReactElement,
	className?: string,
	constrain?: boolean,
	leftGutter?: boolean,
	hideBottomPadding?: boolean,
	hideTopBorder?: boolean,
	hideTopPadding?: boolean,
	wrapperId?: string,
} ) => {
	const { background = 'default',
		children,
		className,
		constrain = true,
		leftGutter = false,
		hideBottomPadding = false,
		hideTopBorder = false,
		hideTopPadding,
		wrapperId } = props;

	return (
		<section
			className={cx( 'outer', `background-${background}`, { hideBottomPadding, hideTopBorder, hideTopPadding, leftGutter } )}
			id={wrapperId}
		>
			<div className={cx( 'inner', className, { constrain } )}>
				{children}
			</div>
		</section>
	);
};

export default PageSection;
