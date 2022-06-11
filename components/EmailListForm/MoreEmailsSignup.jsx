import React from 'react';
import PropTypes from 'prop-types';
import EmailsSection from '../../components/EmailsSection/EmailsSection';
import PageSection from '../../components/Page/PageSection/PageSection';
import PageSectionHeader from '../../components/Page/PageSectionHeader/PageSectionHeader';

const MoreEmailsSignup = ( {
	excludeSlug,
	firstOnPage,
	fieldState: {
		error,
		value,
	},
	handleFieldChange,
	primaryTitle,
	primarySubtitle,
	showErrors,
} ) => {

	const handleCheckboxChange = ( slug, checked ) => {
		let newList;

		if ( checked && !value.includes( slug ) ) {
			newList = [ slug, ...value ];

		} else {
			newList = value.filter( slug => slug !== slug );
		}

		handleFieldChange( {
			value: newList,
			error: !newList.length ? 'Please select an email above or click "No thanks"' : '',
		} );
	};

	return (
		<PageSection background={firstOnPage ? 'alt' : 'default'} hideBottomPadding>
			<PageSectionHeader
				title={primaryTitle}
				description={primarySubtitle}
				fullWidth
			/>
			<EmailsSection
				excludeSlug={excludeSlug}
				hasError={showErrors && !!error}
				hideTopBorder
				hideBottomPadding
				handleChange={handleCheckboxChange}
			/>
		</PageSection>
	);
};

MoreEmailsSignup.propTypes = {
	excludeSlug: PropTypes.string,
	fieldState: PropTypes.object,
	firstOnPage: PropTypes.bool.isRequired,
	handleFieldChange: PropTypes.func.isRequired,
	primarySubtitle: PropTypes.string,
	primaryTitle: PropTypes.string.isRequired,
	showErrors: PropTypes.bool.isRequired,
};

export default MoreEmailsSignup;
