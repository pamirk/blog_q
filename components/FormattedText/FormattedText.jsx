import React from 'react';
import PropTypes from 'prop-types';
import { relNoFollow } from '../../helpers/text';

// Takes plain text and breaks it up by newline, returning a series of paragraphs
const FormattedText = ( { className, noFollow, text } ) => text
	.split( '\n' )
	.filter( Boolean )
	.map( ( text, index ) => {
		const textWithRels = noFollow ? relNoFollow( text ) : text;
		return (
			<p
				className={className}
				dangerouslySetInnerHTML={{ __html: textWithRels }}
				key={index}
			/>
		);
	} );

FormattedText.propTypes = {
	className: PropTypes.string,
	noFollow: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired,
};

FormattedText.defaultProps = {
	noFollow: false,
};

export default FormattedText;
