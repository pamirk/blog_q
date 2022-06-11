import React, { useState } from 'react';
import { useTrackingOnMount } from 'helpers/hooks/useTracking';
import { trackFormView } from 'helpers/tracking/actions';
import FormHeader from 'components/Forms/FormHeader/FormHeader';
import Form from 'components/Form/Form';
import FormActions from 'components/FormActions/FormActions';
import styles from './NewsletterStep.module.scss';
import { Button, Hed, Kicker } from '@quartz/interface';
import emails, { emailList, EmailListSlug } from 'config/emails';
import Toggle from 'components/Toggle/Toggle';
import useClientSideUserData from 'helpers/hooks/useClientSideUserData';
import { USER_EMAIL } from 'helpers/types/account';
import EmojiList from 'components/EmojiList/EmojiList';
import { getUtmQueryParams } from 'helpers/queryParams';

const utmQueryParams = getUtmQueryParams();

// Format identifying info about the request to
// save in Sendgrid on the contact's custom fields.
// Only pass these if they're present.
const customFields = [ 'utm_campaign', 'utm_source' ].reduce( ( acc, key ) => {
	if ( utmQueryParams[ key ] ) {
		return { ...acc, [ key ]: utmQueryParams[ key ] };
	}
	return acc;
}, {} );

interface CustomFields {
	utm_campaign?: string,
	utm_source?: string,
}

function subscribeUserToEmailLists ( userEmail: string, listNames: EmailListSlug[], customFields: CustomFields ) : Promise<any> {
	// No emails were provided, do nothing
	if ( ! listNames.length ) {
		return Promise.resolve();
	}

	const formPostVars = {
		method: 'POST',
		body: JSON.stringify( {
			email: userEmail,
			list_names: listNames,
			custom_fields: customFields,
		} ),
		headers: {
			'Content-Type': 'application/json',
		},
	};

	return fetch( '/api/email/subscribe', formPostVars );
}

function unsubscribeUserFromEmailLists ( userEmail: string, listNames: EmailListSlug[] ) : Promise<any> {
	// No emails were provided, do nothing
	if ( ! listNames.length ) {
		return Promise.resolve();
	}

	const formPostVars = {
		method: 'POST',
		body: JSON.stringify( {
			email: userEmail,
			list_names: listNames,
		} ),
		headers: {
			'Content-Type': 'application/json',
		},
	};

	return fetch( '/api/email/unsubscribe', formPostVars );
}

function sendUserAppDownloadEmail( userEmailAddress: string, confirm: boolean ) : Promise<any> {
	// User unchecked the 'Email me a download link' checkbox
	if ( ! confirm ) {
		return Promise.resolve();
	}

	const formPostVars = {
		method: 'POST',
		body: JSON.stringify( {
			email: userEmailAddress,
			templateName: 'app_download',
		} ),
		headers: {
			'Content-Type': 'application/json',
		},
	};

	return fetch( '/api/email/send', formPostVars );
}

const englishEmailListSlugs = emailList.filter( slug => 'quartz-japan' !== slug );

const emailListEmojiDictionary = {
	'africa-weekly-brief': '🌍',
	coronavirus: '🦠',
	'daily-brief': '☕️',
	'quartz-at-work': '🖋',
	'quartz-members': '📚',
	'quartz-obsession': '🕳',
	'space-business': '🚀',
	'quartz-weekend-brief': '📰',
	'quartz-company': '🏢',
	'quartz-forecast': '🔮',
	'quartz-how-to': '🔧',
	olympics: '🥇',
};

const sections = [
	{
		heading: 'Just for members',
		emails: [
			'quartz-forecast',
			'quartz-company',
			'quartz-how-to',
			'quartz-weekend-brief',
		],
	},
	{
		heading: 'Keep up with the news',
		emails: [
			'daily-brief',
			'africa-weekly-brief',
			'olympics',
			'coronavirus',
		],
	},
	{
		heading: 'Keeping it specific',
		emails: [
			'quartz-obsession',
			'space-business',
			'quartz-at-work',
		],
	},
];

function EmailPicker ( props: {
	checked: boolean,
	frequency: string,
	name: string,
	onToggle: ( checked: boolean ) => any,
	shortDescription: string,
} ) {
	const {
		checked,
		frequency,
		name,
		onToggle,
		shortDescription,
	} = props;

	return (
		<li className={styles.emailContainer}>
			<div className={styles.cardContainer}>
				<Hed size="small">{name}</Hed>
				<div className={styles.frequency}>{frequency}</div>
				<div className={styles.description}>{shortDescription}</div>
			</div>
			<Toggle
				ariaLabel={name}
				onToggle={onToggle}
				checked={checked}
			/>
		</li>
	);
}

export default function NewsletterStep( props: {
	description: string,
	handleNewsletterSubmit: () => any,
	primaryCTAText: string,
	title: string,
	trackingData,
} ) {
	const {
		description,
		handleNewsletterSubmit,
		primaryCTAText,
		title,
		trackingData,
	} = props;

	useTrackingOnMount( trackFormView, trackingData );
	// Array of slugs representing the checked email lists. Initial state
	// reflects that members are automatically signed up for the member
	// email and the Daily Brief.
	const [ checkedListSlugs, setCheckedListSlugs ] = useState<EmailListSlug[]>( [
		'daily-brief',
		'quartz-members',
		'quartz-weekend-brief',
		'quartz-company',
		'quartz-forecast',
		'quartz-how-to',
	] );
	// 'Send me an app download link' checked state
	const [ appEmailChecked, setAppEmailChecked ] = useState( true );
	// Error response from the API calls, if any
	const [ error, setError ] = useState( null );
	// Loading state for API calls
	const [ loading, setLoading ] = useState( false );
	// Hook into client-side user data so we can access user's email address
	const { getUserAttribute } = useClientSideUserData();
	const allTogglesChecked = checkedListSlugs.length === englishEmailListSlugs.length && appEmailChecked;

	const toggleAll = () => {
		if ( allTogglesChecked ) {
			// All toggles are on, turn them all off
			setCheckedListSlugs( [] );
			setAppEmailChecked( false );
		} else {
			// Some or all toggles are off, turn them all on
			setCheckedListSlugs( englishEmailListSlugs );
			setAppEmailChecked( true );
		}
	};

	const toggleEmailListCheckbox = ( slug: EmailListSlug ) => {
		if ( checkedListSlugs.includes( slug ) ) {
			setCheckedListSlugs( checkedListSlugs.filter( item => slug !== item ) );
		} else {
			setCheckedListSlugs( [ slug, ...checkedListSlugs ] );
		}
	};

	const toggleAppEmailCheckbox = () => setAppEmailChecked( ! appEmailChecked );

	const onSubmit = event => {
		event.preventDefault();
		setLoading( true );

		// Get the user's email in order to fulfil their requests
		const userEmailAddress = getUserAttribute( USER_EMAIL );

		// When the form is submitted we need to make up to three API calls.
		//
		// The first subscribes the user to any checked email lists using
		// the `/api/email/subscribe` endpoint.
		//
		// The second unsubscribes them from any unchecked emails lists
		// using the `/api/email/subscribe` endpoint.
		//
		// Finally, if the user has checked the `Email me a download link`
		// toggle, we make a call to `api/email/subscribe` requesting an
		// app download email be sent to the user immediately.
		Promise.all( [
			subscribeUserToEmailLists( userEmailAddress, checkedListSlugs, customFields ),
			unsubscribeUserFromEmailLists( userEmailAddress, englishEmailListSlugs.filter( item => ! checkedListSlugs.includes( item ) ) ),
			sendUserAppDownloadEmail( userEmailAddress, appEmailChecked ),
		] )
			// Once the API calls have succeeded, we run a callback function
			// to advance the user to the next step of the subscribe flow.
			// This differs from other subscribe flow steps, which look at
			// the user's profile to determine which step they should be on.
			//
			// This is because we do not propagate the completion status of
			// this step in the user profile.
			.then( () => handleNewsletterSubmit() )
			.catch( error => setError( error ) )
			.finally( () => setLoading( false ) );
	};


	return (
		<Form
			onSubmit={onSubmit}
			trackingData={{
				...trackingData,
				context: checkedListSlugs.join( '|' ),
			}}
		>
			<FormHeader title={title} description={description}/>
			<div className={styles.toggleAllButton}>
				<Button inline onClick={toggleAll}>{
					allTogglesChecked ? 'Turn all off' : 'Turn all on'
				}</Button>
			</div>
			{
				sections.map( section => (
					<div className={styles.section} key={section.heading}>
						<Kicker>
							<h2 className={styles.sectionHeading}>{section.heading}</h2>
						</Kicker>
						<EmojiList bullets={section.emails.map( slug => emailListEmojiDictionary[ slug ] )}>
							{
								// @ts-ignore
								section.emails.map( ( slug: EmailListSlug ) => {
									const emailConfig = emails[ slug ];

									if ( ! emailConfig ) {
										return null;
									}

									const {
										frequency,
										name,
										shortDescription,
									} = emailConfig;

									return (
										<EmailPicker
											checked={checkedListSlugs.includes( slug )}
											frequency={frequency}
											key={slug}
											name={name}
											onToggle={() => toggleEmailListCheckbox( slug )}
											shortDescription={shortDescription}
										/>
									);
								}	)
							}
						</EmojiList>
					</div>
				) )
			}
			<div className={styles.section}>
				<Kicker>
					<h2 className={styles.sectionHeading}>Download the iOS app</h2>
				</Kicker>
				<EmojiList bullets={[ '📲' ]}>
					<EmailPicker
						checked={appEmailChecked}
						frequency="One time"
						name="Email me a download link"
						onToggle={toggleAppEmailCheckbox}
						shortDescription="Get all of Quartz in your pocket"
					/>
				</EmojiList>
			</div>
			<FormActions
				error={error}
				loading={loading}
				submitText={primaryCTAText}
			/>
		</Form>
	);
}
