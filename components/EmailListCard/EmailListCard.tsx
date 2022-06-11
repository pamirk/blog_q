import React, { useState } from 'react';
import styles from './EmailListCard.module.scss';
import classnames from 'classnames/bind';
import { Checkbox } from '@quartz/interface';
import EmailListFeaturedImage from 'components/EmailListFeaturedImage/EmailListFeaturedImage';
import ExternalLinkIcon from 'svgs/external-link';
import Link from 'components/Link/Link';
import { clickNewsletterCheckbox } from 'helpers/tracking/actions';
import { getRelativeLink } from 'helpers/urls';
import useTracking from 'helpers/hooks/useTracking';

const cx = classnames.bind( styles );

interface EmailListCardArgs {
	description?: string | null,
	emailId?: number | null,
	featuredImage?: {
		altText?: string | null,
		sourceUrl?: string | null,
	} | null,
	handleChange: ( slug: string, checked: boolean ) => any,
	hasError?: boolean,
	isPrivate?: boolean | null,
	link?: string | null,
	name?: string | null,
	slug?: string | null,
	subtitle?: string | null,
}

const EmailListCard = ( {
	description,
	emailId,
	featuredImage = {
		sourceUrl: '/public/images/sign_up_phone.png',
		altText: 'phone',
	},
	handleChange,
	hasError = false,
	isPrivate,
	link,
	name,
	slug,
	subtitle = 'Delivered to your inbox whenever we see fit.',
}: EmailListCardArgs ) => {
	const trackCheckboxClick = useTracking( clickNewsletterCheckbox, { listSlug: slug } );

	const [ checked, setChecked ] = useState( false );
	const [ checkedOnce, setCheckedOnce ] = useState( false );

	const clickTrack = ( eventChecked ) => {
		if ( !checkedOnce && eventChecked ) {
			trackCheckboxClick();
			setCheckedOnce( true );
		}
	};

	const handleCheckAndChange = ( event ) => {
		const { checked: eventChecked } = event.target;

		clickTrack( eventChecked );

		setChecked( eventChecked );

		if ( handleChange && slug ) {
			handleChange( slug, eventChecked );
		}
	};

	const previewContent = <EmailListFeaturedImage image={featuredImage} />;
	const to = getRelativeLink( link ?? '' ) || '';

	// if it's Quartz Japan or a private email, don't let users add it to the list of checked emails
	const selectable = ! ( isPrivate || 'quartz-japan' === slug );
	// if we have the latest email and it's a public list (or it's Quartz Japan, which is flagged private but we want exposed)
	const hasLatestEmail = emailId && ( !isPrivate || 'quartz-japan' === slug );

	// if it's Quartz Japan, the preview will be a link
	let preview =  'quartz-japan' === slug  ? (
		<Link to={to}>{previewContent}</Link>
	) : (
		<div className={cx( 'preview-content' )}>
			{previewContent}
		</div>
	);

	// In form mode the title and preview act as the checkbox label.
	if ( selectable ) {
		preview = <label htmlFor={`email-select-${slug}`}>{previewContent}</label>;
	}

	const titleContent = <h3 className={cx( 'title' )}>{name}</h3>;

	let title = (
		<Link to={to}>
			{titleContent}
		</Link>
	);

	if ( selectable ) {
		title = (
			<label htmlFor={`email-select-${slug}`} className={cx( 'title', 'label', { hasError } )}>
				{name}
			</label>
		);
	}

	const ctaIcon = selectable
		? (
			<Checkbox
				ariaDescribedBy={`email-subtitle-${slug} email-description-${slug}`}
				checked={checked}
				id={`email-select-${slug}`}
				invalid={hasError}
				onChange={handleCheckAndChange}
				size="large"
			/>
		) : (
			<Link to={to} label="Email signup">
				<ExternalLinkIcon classNzame={cx( 'external-link' )} />
			</Link>
		);

	return (
		<div className={cx( 'container' )}>
			<div className={cx( 'preview' )}>
				{preview}
			</div>
			<div className={cx( 'signup' )}>
				<div className={cx( 'icon-container' )}>
					{ctaIcon}
				</div>
				<div className={cx( 'signup-text' )}>
					{title}
					<div className={cx( 'subtitle' )} id={`email-subtitle-${slug}`}>
						{subtitle}
					</div>
					<p className={cx( 'description' )} id={`email-description-${slug}`}>
						{description}
					</p>
					<div className={cx( 'preview-link' )}>
						<Link className={cx( 'sign-up' )} to={to}>Sign-up page</Link>
						{
							hasLatestEmail &&
								<Link
									className={cx( 'view-latest' )}
									to={`/emails/${slug}/${emailId}/`}
								>
									View latest
								</Link>
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EmailListCard;
