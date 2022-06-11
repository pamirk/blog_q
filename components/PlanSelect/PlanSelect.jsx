import React from 'react';
import PropTypes from 'prop-types';
import PlanSelectRadio from './PlanSelectRadio/PlanSelectRadio';
import styles from './PlanSelect.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

const PlanSelect = ( { handleChange, label, options, id, value: radioGroupValue } ) => (
	<div className={cx( 'container' )}>
		{
			label &&
			<span className={cx( 'label' )} id={id}>{label}</span>
		}
		<div className={cx( 'inner' )} role="group" aria-labelledby={label && id}>
			{options.map( ( option, i ) => {
				if ( !option ) {
					return null;
				}

				const { value } = option;

				return (
					<PlanSelectRadio
						key={i}
						handleChange={handleChange}
						checked={value === radioGroupValue}
						name={id}
						{...option}
					/>
				);
			} )}
		</div>
	</div>
);

PlanSelect.propTypes = {
	handleChange: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.node,
	options: PropTypes.arrayOf( PropTypes.shape( {
		title: PropTypes.string,
		label: PropTypes.node,
		description: PropTypes.node,
		value: PropTypes.string.isRequired,
	} ) ),
	value: PropTypes.string.isRequired,
};

PlanSelect.defaultProps = {
	value: '',
};

export default PlanSelect;
