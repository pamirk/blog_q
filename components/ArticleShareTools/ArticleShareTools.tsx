import React from 'react';
import CopyInput from 'components/CopyInput/CopyInput';
import ShareIcons from 'components/ShareIcons/ShareIcons';
import styles from './ArticleShareTools.module.scss';
import { getShortUrl } from 'helpers/urls';
import { useUserRole } from 'helpers/hooks';

const emailMemberUnlockCopy = ( url, description ) => {
	const encodedDescription = `Hi! Check out this Quartz story—because I’m a Quartz member, I was able to unlock it for you. Let me know what you think:${encodeURIComponent( `\n\n${description}` )}`;
	const encodedUrl = encodeURIComponent( `\n\n${url}?utm_term=mucp` );
	return `mailto:?subject=I think you’ll find this article interesting&body=${encodedDescription}${encodedUrl}`;
};

// Order determines display order.
const services = [
	'facebook',
	'twitter',
	'whatsapp',
	'email',
];

const SocialShareIcons = ( props: {
	authorName: string,
	description: string,
	isMember: boolean,
	title: string,
	url: string,
} ) => {
	const {
		authorName,
		description,
		isMember,
		title,
		url,
	} = props;

	if ( isMember ) {
		return (
			<ShareIcons
				author={authorName}
				customURLs={{
					email: emailMemberUnlockCopy( url, description ),
				}}
				description={description}
				services={services}
				title={title}
				trackingData={{
					context: 'Member Share Icons',
				}}
				url={`${url}?utm_term=mucp`}
			/>
		);
	}

	return (
		<ShareIcons
			author={authorName}
			description={description}
			services={services}
			title={title}
			trackingData={{
				context: 'Non-Member Share Icons',
			}}
			url={url}
		/>
	);
};

export const ArticleShareTools = ( props: {
	authorName: string,
	link: string,
	summary?: string,
	title: string,
} ) => {
	const {
		authorName,
		link,
		summary,
		title,
	} = props;
	const { isMember } = useUserRole();

	return (
		<div className={styles.container}>
			{/*{
				isMember && <p><i>As a Quartz member, you can share this story to unlock it for others.</i> 🔓</p>
			}
			<div className={styles['actions-container']}>
				<div className={styles['social-container']}>
					<SocialShareIcons
						authorName={authorName}
						description={summary || title}
						isMember={isMember}
						title={title}
						url={link}
					/>
				</div>
				<div className={styles['input-container']}>
					<CopyInput
						buttonText="Copy"
						buttonVariant="secondary"
						value={`${getShortUrl( link )}${ isMember ? '?utm_term=mucp' : ''}`}
					/>
				</div>
			</div>*/}
		</div>
	);
};

export default ArticleShareTools;
