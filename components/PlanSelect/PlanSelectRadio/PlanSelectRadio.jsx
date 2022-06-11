import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './PlanSelectRadio.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

const CouponOriginalPrice = ( { text } ) => (
	<span className={cx( 'coupon-label-price' )}><del>{text}</del></span>
);

const CouponDiscount = ( { text } ) => (
	<span className={cx( 'coupon-label-discount' )}>{text}</span>
);

const FeaturedLabel = ( { text } ) => (
	<span className={cx( 'featured' )}>{text}</span>
);

CouponOriginalPrice.propTypes = {
	text: PropTypes.string.isRequired,
};

CouponDiscount.propTypes = {
	text: PropTypes.string.isRequired,
};

FeaturedLabel.propTypes = {
	text: PropTypes.string.isRequired,
};

export { CouponOriginalPrice, CouponDiscount, FeaturedLabel };

/**
 *
 * A controlled radio input.
 */
class PlanSelectRadio extends Component {
	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind( this );
	}

	onChange( event ) {
		this.props.handleChange( event.target.value );
	}

	render() {
		const {
			bannerText,
			checked,
			description,
			label,
			name,
			title,
			value,
		} = this.props;

		return (
			<label className={cx( 'label' )}>
				{
					bannerText &&
					<div className={cx( 'banner', { checked } )}>{bannerText}</div>
				}
				<input
					className={cx( 'radio' )}
					type="radio"
					value={value}
					name={name}
					onChange={this.onChange}
					checked={checked}
				/>
				<div className={cx( 'label-text' )}>
					<span className={cx( 'label-title' )}>{title}</span>
					<span className={cx( 'label-name' )}>{label}</span>
					<span className={cx( 'description' )}>{description}</span>
				</div>
			</label>
		);
	}
}

PlanSelectRadio.propTypes = {
	bannerText: PropTypes.string,
	checked: PropTypes.bool,
	description: PropTypes.node,
	handleChange: PropTypes.func.isRequired,
	label: PropTypes.node,
	name: PropTypes.string,
	title: PropTypes.string,
	value: PropTypes.string.isRequired,
};

export default PlanSelectRadio;
