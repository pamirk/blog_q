import React from 'react';
import PropTypes from 'prop-types';
import EmailListCard from 'components/EmailListCard/EmailListCard';
import { emailList as emailListSlugs } from 'config/emails';
import styles from './EmailsSection.module.scss';
import { useEmailListsBySlugQuery } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

export default function EmailsSection ( props: {
	excludeSlug?: string,
	handleChange: ( slug: string, checked: boolean ) => any,
	hasError?: boolean,
} ) {
	const { excludeSlug, handleChange, hasError = false } = props;
	const filteredListSlugs = emailListSlugs.filter( slug => slug !== excludeSlug );
	const emailLists = useEmailListsBySlugQuery( { variables: { slug: filteredListSlugs, perPage: 15 } } ).data?.emailLists?.nodes;

	if ( ! emailLists ) {
		return null;
	}

	const listsToDisplay = filteredListSlugs
		.map( slug => {
			const list = emailLists.find( item => slug === item?.slug );

			if ( ! list ) {
				return;
			}

			if ( list.isPrivate && slug !== 'quartz-japan' ) {
				return;
			}

			return {
				...list,
				emailId: list?.emails?.nodes?.[0]?.emailId,
			};
		} )
		.filter( notUndefinedOrNull );

	return (
		<div className={styles.container}>
			{
				listsToDisplay?.map( ( emailList, i ) => (
					<EmailListCard
						key={i}
						handleChange={handleChange}
						hasError={hasError}
						{...emailList}
					/>
				) )
			}
		</div>
	);
}

EmailsSection.propTypes = {
	excludeSlug: PropTypes.string,
	handleChange: PropTypes.func,
	hasError: PropTypes.bool,
};

EmailsSection.defaultProps = {
	hasError: false,
};
