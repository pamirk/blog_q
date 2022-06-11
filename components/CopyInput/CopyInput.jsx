import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from '../../components/Input/Input';
import { Button } from '../../@quartz/interface';
import styles from './CopyInput.module.scss';

const CopyInput = ( { buttonText, buttonVariant, value } ) => {
	const [ showCopied, setShowCopied ] = useState( false );
	const inputRef = useRef( null );

	return (
		<div className={styles.container}>
			<div className={styles.input}>
				<Input
					id="copy-input"
					value={value}
					inputRef={inputRef}
					read-only
					handleClick={() => {
						inputRef.current.select();
					}}
				/>
			</div>
			<div className={styles.button}>
				<Button
					onClick={() => {
						setShowCopied( true );
						inputRef.current.select();
						document.execCommand( 'copy' );
						setTimeout( () => setShowCopied( false ), 3000 );
					}}
					variant={buttonVariant}
				>
					{showCopied ? '✓' : buttonText}
				</Button>
			</div>
		</div>
	);
};

CopyInput.propTypes = {
	buttonText: PropTypes.string.isRequired,
	buttonVariant: PropTypes.string,
	value: PropTypes.string,
};

CopyInput.defaultProps = {
	buttonText: 'Copy text',
};

export default CopyInput;
