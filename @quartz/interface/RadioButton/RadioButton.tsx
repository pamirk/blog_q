import React from 'react';
import classnames from 'classnames/bind';
import styles from './RadioButton.module.scss';

const cx = classnames.bind( styles );

function RadioButton ( props: {
	/**
	 * Toggle for the component’s checked state. Forwarded to the input
	 * element.
	 */
	checked: boolean,
	/**
	 * Child nodes to be rendered as the label for the radio button.
	 * Label/input HTML linking happens automatically.
	 */
	children: React.ReactNode,
	/**
	 * Whether the radio button is interactive. Forwarded to the input
	 * element.
	 */
	disabled?: boolean,
	/**
	 * Controls the DOM flow behavior of the component.
	 */
	display?: 'block' | 'inline',
	/**
	 * A string to combine multiple radio buttons in order to provide a
	 * multiple choice field. Forwarded to the input element.
	 */
	name: string,
	/**
	 * Function to run when the radio button is toggled. Forwarded to the
	 * input element.
	 */
	onChange: ( event: React.ChangeEvent ) => void,
	/**
	 * Indicates that the radio button must be checked by the user in
	 * order for the parent form to validate. Forwarded to the input
	 * element.
	 */
	required?: boolean,
} ) {
	const {
		disabled = false,
		display = 'inline',
		required = false,
	} = props;
	return (
		<label className={cx( 'container', display )}>
			<input
				checked={props.checked}
				className={cx( 'input', display )}
				disabled={disabled}
				name={props.name}
				onChange={props.onChange}
				required={required}
				type="radio"
			/>
			{props.children}
		</label>
	);
}

export default RadioButton;
