import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './Toggle.module.scss';

const cx = classnames.bind( styles );

class Toggle extends React.Component {
	constructor( props ) {
		super( props );
		this.handleChange = this.handleChange.bind( this );
		this.handleFocus = this.handleFocus.bind( this );
		this.handleBlur = this.handleBlur.bind( this );

		this.state = {};
	}

	handleChange () {
		this.props.onToggle( !this.props.checked );
	}

	handleFocus() {
		this.setState( { focused: true } );
	}

	handleBlur() {
		this.setState( { focused: false } );
	}

	render () {
		const { focused } = this.state;
		const { toggleClass, label, subLabel, className, disabled, ariaLabel, onIcon, offIcon, checked } = this.props;
		const toggleClasses = cx( toggleClass, {
			'toggle-checked': checked,
			'toggle-disabled': disabled,
			focused,
		}, className );

		return (
			<div className={cx( 'toggle-container' )}>
				<div className={cx( 'text', { hidden: !label && !subLabel } )}>
					{label && <h3 className={cx( 'label' )}>{label}</h3>}
					{subLabel && <h4 className={cx( 'sub-label' )}>{subLabel}</h4>}
				</div>
				<label className={toggleClasses}>
					<div className={cx( 'track', toggleClasses )}>
						<div className={cx( 'track-off' )}>
							{offIcon}
						</div>
						<div className={cx( 'track-on' )}>
							{onIcon}
						</div>
					</div>
					<div className={cx( 'thumb' )} />

					<input
						ref={ref => {
							this.input = ref;
						}}
						className={cx( 'toggle-screenreader-only' )}
						type="checkbox"
						aria-label={ariaLabel}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
						checked={checked}
						onChange={this.handleChange}
					/>
				</label>
			</div>
		);
	}
}

Toggle.defaultProps = {
	onIcon: <span>On</span>,
	offIcon: <span>Off</span>,
	toggleClass: 'toggle',
};

Toggle.propTypes = {
	ariaLabel: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	label: PropTypes.string,
	offIcon: PropTypes.node.isRequired,
	onIcon: PropTypes.node.isRequired,
	onToggle: PropTypes.func.isRequired,
	subLabel: PropTypes.string,
	toggleClass: PropTypes.string.isRequired,
};

export default Toggle;
