import React from 'react';
import PropTypes from 'prop-types';

const Highlight = ( { text } ) => (
	<p dangerouslySetInnerHTML={{ __html: text }} />
);

Highlight.propTypes = {
	text: PropTypes.string.isRequired,
};

export default Highlight;
