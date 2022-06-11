import React, { Fragment } from 'react';
import styles from './ConfirmationStep.module.scss';
import Link from 'components/Link/Link';
import { ButtonLabel } from '@quartz/interface';
import EmojiList from 'components/EmojiList/EmojiList';
import { useTrackingOnMount } from 'helpers/hooks/useTracking';
import { trackFormView } from 'helpers/tracking/actions';
import FormHeader from 'components/Forms/FormHeader/FormHeader';

const listItems = [
	{
		title: <Fragment>You’ve just <Link target="_blank" to="/">unlocked all stories</Link> and have unlimited access to all of Quartz.</Fragment>,
		description: <>Take advantage of it by browsing our <Link target="_blank" to="/guides/">latest field guides</Link>, watching <Link target="_blank" to="/re/quartz-at-work-from-home/">our previous events</Link>, getting to know our <Link target="_blank" to="/1891869/quartzs-2020-obsessions-2/">obsessions</Link>, or nerding out with us on our <Link target="_blank" to="/re/quartz-presents/">presentations</Link>.</>,
	},
	{
		title: <>If you’re new to Quartz or just need a refresher, check out the <Link target="_blank" to="/1830291/a-note-to-quartz-readers-from-our-editor-during-the-coronavirus-pandemic/">latest letter</Link> from our Editor-in-chief, <Link target="_blank" to="/author/kbell/">Katherine Bell</Link>.</>,
	},
	{
		title: 'We’ve saved your email preferences.',
		description: 'If you signed up for any emails you’ll receive the first set in a jiffy.',
	},
	{
		title: 'You can now spread the love.',
		description: <>Since you’re a Quartz member, you can now share <Link target="_blank" to="/discover/">unlimited unlocked</Link> stories with your colleagues and friends.</>,
	},
	{
		title: <>One last thing: don’t forget to connect with us on <Link target="_blank" to="https://twitter.com/qz/">Twitter</Link>, <Link target="_blank" to="https://www.facebook.com/quartznews/">Facebook</Link>, and <Link target="_blank" to="https://www.instagram.com/qz/">Instagram</Link> to stay up-to-date on our latest coverage.</>,
	},
];

export default function ConfirmationStep( props: {
	description: string;
	primaryCTAText: string,
	previousPath: string,
	title: string;
	trackingData: { formName: string; stageName: string; context: string; }
} ) {

	useTrackingOnMount( trackFormView, props.trackingData );

	return (
		<div className={styles.container}>
			<FormHeader title={props.title} description={props.description}/>

			<h3 className={styles.sectionHeading}>OK, let’s review everything</h3>
			<EmojiList bullets={[ '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣' ]}>
				{listItems.map( ( { title, description }, i ) => (
					<li key={i}>
						<h3 className={styles.name}>{title}</h3>
						<p className={styles.description}>{description}</p>
					</li>
				) )}
			</EmojiList>

			<Link to={props.previousPath} cypressData="confirm">
				<ButtonLabel>{props.primaryCTAText}</ButtonLabel>
			</Link>

		</div>
	);
}
