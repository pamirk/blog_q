import React from 'react';
import Avatar from '../../svgs/avatar-logged-out';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './SettingsSection.module.scss';
import { Button } from '../../@quartz/interface';

const cx = classnames.bind( styles );

export const SettingsField = ( {
	buttonCTA,
	disabled,
	fieldDescription,
	Icon,
	onClick,
	id,
} ) => (
	<li className={cx( 'field' )} data-cy={id}>
		<div className={cx( 'info' )}>
			<Icon className={cx( 'icon' )} />
			<p className={cx( 'description' )}>{fieldDescription}</p>
		</div>
		{
			onClick &&
			<Button
				disabled={disabled}
				inline={true}
				onClick={onClick}
			>{buttonCTA}</Button>
		}
	</li>
);

SettingsField.propTypes = {
	Icon: PropTypes.oneOfType( [ PropTypes.string, PropTypes.func ] ).isRequired,
	buttonCTA: PropTypes.string,
	disabled: PropTypes.bool,
	fieldDescription: PropTypes.oneOfType( [ PropTypes.string.isRequired, PropTypes.array.isRequired ] ),
	id: PropTypes.string,
	onClick: PropTypes.func,
};

SettingsField.defaultProps = {
	buttonVariant: 'primary',
	cta: 'Manage',
	disabled: false,
	Icon: Avatar,
};

export const SettingsSection = ( { title, subtitle, children } ) => (
	<div className={cx( 'container' )}>
		<h2 className={cx( 'title' )}>{title}</h2>
		<p className={cx( 'subtitle' )}>{subtitle}</p>
		<ul className={cx( 'fields' )}>{children}</ul>
	</div>
);

SettingsSection.propTypes = {
	children: PropTypes.node,
	subtitle: PropTypes.oneOfType( [ PropTypes.string.isRequired, PropTypes.array.isRequired ] ),
	title: PropTypes.string,
};

export default SettingsSection;
