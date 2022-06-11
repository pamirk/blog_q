import React from 'react';
import Link from 'components/Link/Link';
import styles from './AboutCulture.module.scss';
import PageSectionHeader from 'components/Page/PageSectionHeader/PageSectionHeader';
import AboutCultureTweet from './AboutCultureTweet/AboutCultureTweet';
// import Photo from 'components/Photo/Photo';
// import photos from './photos.json';

export default function AboutCulture () {
	// @ts-ignore
	return (
		<>
			<PageSectionHeader title="#qzlife" id="culture" />
			<p className={styles.intro}>Quartz is defined, more than anything, by the people who work here. We’re all different, but share a common affinity for that #qzlife.</p>
			{/*<Photo
				{...photos[0]}
				className={styles.photo0}
			/>*/}
			<div className={styles.pinboard}>
				<div className={styles.row}>
					{/*<Photo
						{...photos[1]}
						className={styles.photo1}
					/>*/}
					<AboutCultureTweet authorName="Kira Bindrim" authorHandle="KiraBind">No one here is fancy.</AboutCultureTweet>
				</div>
				<div className={styles.row}>
					{/*<Photo
						{...photos[2]}
						className={styles.photo2}
					/>
					<Photo
						{...photos[3]}
						className={styles.photo3}
					/>*/}
					<AboutCultureTweet className={styles.tweet2} authorName="Annalisa Merelli" authorHandle="missanabeem">Did the product team 3D print <a title="Quartz on Twitter" href="https://twitter.com/qz">@qz</a> cocktail picks for their cocktails? You bet they did. <a title="#qzlife on Twitter" href="https://twitter.com/hashtag/qzlife">#qzlife</a></AboutCultureTweet>
				</div>
				<div className={styles.row}>
					{/*<Photo
						{...photos[4]}
						className={styles.photo4}
					/>
					<Photo
						{...photos[5]}
						className={styles.photo5}
					/>*/}
				</div>
				<div className={styles.row}>
					<div className={styles.annotation}>
						See what we are up to on <Link to="https://blog.qz.com/">our blog</Link> and follow us on <Link to="https://twitter.com/qz">Twitter</Link>.
					</div>
				</div>
			</div>
		</>
	);
}
