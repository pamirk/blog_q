import React, { Fragment } from 'react';
import { AuthorPartsFragment } from '@quartz/content';
import { Badge } from '@quartz/interface';
import { LinkWhen } from 'components/Link/Link';
import classnames from 'classnames/bind';
import styles from './Byline.module.scss';
import usePageVariant from 'helpers/hooks/usePageVariant';
import Image from 'next/image'

const cx = classnames.bind( styles );

const AuthorAvatar = ( {
	imageUrl,
	name,
}: {
	imageUrl: string;
	name: string;
} ) => {
	const { isAmp } = usePageVariant();

	if ( isAmp ) {
		return (
			<Image
				src={imageUrl}
				alt={name}
				width={40}
				height={40}
			/>
		);
	}

	return (
		<Badge
			alt={name}
			imageUrl={imageUrl}
			size="small"
		/>
	);
};

export const AuthorList = ( {
	authors,
	isBulletin,
} ) => {
	const authorCount = authors.length;

	return (
		authors.map( ( author, i ) => (
			<Fragment key={author.id}>
				<span className={styles.name}>
					<LinkWhen
						className={styles['name-link']}
						to={`/author/${author.username}/`}
						when={!isBulletin}
					>
						{author.name}
					</LinkWhen>
				</span>
				{
					authorCount > 1 && i < authorCount - 2 &&
						<span>, </span>
				}
				{
					i === authorCount - 2 &&
						<span> & </span>
				}
			</Fragment>
		) )
	);
};

const Byline = ( {
	authors,
	isBulletin = false,
	prefix = 'By',
}: {
	authors: AuthorPartsFragment[],
	isBulletin: boolean,
	prefix?: string,
} ) => {
	const authorCount = authors.length;
	const showBadges = authorCount <= 3 && authors.some( author => !! author.avatar );
	const three = 3 === authorCount;
	const title = authors[ 0 ]?.shortBio || authors[ 0 ]?.title;

	return (
		<div className={cx( 'author-container', { three } )}>
			{
				showBadges &&
					<ul className={styles['badge-list']}>
						{
							authors.map( author => author.name && (
								<li className={styles.badge} key={author.id}>
									<LinkWhen
										className={styles['badge-link']}
										to={`/author/${author.username}/`}
										when={!isBulletin}
									>
										<AuthorAvatar
											name={author.name}
											imageUrl={author.avatar || 'https://qz.com/public/svg/default-avatar.svg'}
										/>
									</LinkWhen>
								</li>
							) )
						}
					</ul>
			}
			<div className={styles.byline}>
				{
					prefix &&
					`${prefix} `
				}
				<AuthorList authors={authors} isBulletin={isBulletin} />
				{
					1 === authorCount && title &&
						<p className={styles.title}>{title}</p>
				}
			</div>
		</div>
	);
};

export default Byline;
