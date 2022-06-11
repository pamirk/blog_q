import React from 'react';
import { nl2br } from '../../helpers/text';
import PropTypes from 'prop-types';
import styles from './TextArea.module.scss';

// eslint-disable-next-line react/display-name
export const TextArea = React.forwardRef( ( {
	disabled,
	name,
	onChange,
	onFocus,
	onKeyDown,
	placeholder,
	value,
}, ref ) => (
	<div className={styles.container}>
		<div
			aria-hidden={true}
			className={styles[ 'shadow-input' ]}
			dangerouslySetInnerHTML={( { __html: `${nl2br( value )}&nbsp;` } )}
		/>
		<textarea
			className={styles.input}
			name={name}
			disabled={disabled}
			onChange={onChange}
			onFocus={onFocus}
			onKeyDown={onKeyDown}
			placeholder={placeholder}
			ref={ref}
			value={value}
		/>
	</div>
) );

TextArea.propTypes = {
	disabled: PropTypes.bool.isRequired,
	name: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onKeyDown: PropTypes.func,
	placeholder: PropTypes.string,
	value: PropTypes.string,
};

TextArea.defaultProps = {
	disabled: false,
	onChange: () => {},
	onKeyDown: () => {},
	placeholder: '',
	setRef: () => {},
};

export default TextArea;
