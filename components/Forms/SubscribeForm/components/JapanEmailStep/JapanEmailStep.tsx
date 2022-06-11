import React, { Fragment } from 'react';
import AccountEmailForm, { SubscribeFormTrackingData } from 'components/AccountEmailForm/AccountEmailForm';
import FormHeader from 'components/Forms/FormHeader/FormHeader';
import SignupHints from 'components/SignupHints/SignupHints';
import Link from 'components/Link/Link';
import EmailCTA from 'components/EmailCTA/EmailCTA';
import NewPerks from 'components/NewPerks/NewPerks';
import EmailPeek from 'components/EmailPeek/EmailPeek';
import useEmailsByList from 'data/hooks/useEmailsByList';
import useEmailById from 'data/hooks/useEmailById';

import styles from './JapanEmailStep.module.scss';

// simple wrapper to grab the latest email
function EmailPeekWrapper( props: {
	emailId: number,
	featuredImage,
	language: string,
	name: string,
	slug: string,
} ) {
	const email = useEmailById( props.emailId );

	if ( !email ) {
		return null;
	}

	return (
		<EmailPeek
			email={email}
			featuredImage={props.featuredImage}
			language={props.language}
			slug={props.slug}
			name={props.name}
		/>
	);
}

const defaultSubmitText = '次へ';

function JapanEmailStep( props: {
	description: string,
	submitText?: string,
	title: string,
	trackingData: SubscribeFormTrackingData,
} ) {
	const data = useEmailsByList( 'quartz-japan', [], true );

	if ( !data || !data.emailList ) {
		return null;
	}

	return (
		<div className={styles.container}>
			<div className={styles.signupContainer}>
				<div className={styles.signupText}>
					<FormHeader title={props.title} description={props.description} />
					<AccountEmailForm
						emailLabel="メールアドレスを入力"
						submitText={props.submitText || defaultSubmitText}
						trackingData={props.trackingData}
						source="subscribe-japan"
						id="account-email-form-upper"
					>
						<p className={styles.disclaimer}>
							メールアドレスを入力すると、料金プランを確認することができます。ご入力いただいたメールアドレスは、Quartzの<Link to="/about/privacy-policy/">プライバシーポリシー</Link>が適応されます。
							<br />
							このサイトはreCAPTCHAによって保護されており、Googleの<Link to="https://policies.google.com/privacy">プライバシーポリシー</Link>と<Link to="https://policies.google.com/terms">利用規約</Link>が適用されます。
						</p>
					</AccountEmailForm>
				</div>
				<div className={styles.signupPreview}>
					{data &&
						<EmailPeekWrapper
							emailId={data?.emails[0].emailId}
							featuredImage={data?.emailList.featuredImage}
							language="ja"
							name="Quartz Japan"
							slug="quartz-japan"
						/>
					}
				</div>
			</div>
			<div className={styles.lower}>
				<div className={styles.hints}>
					<SignupHints
						align="center"
						language="ja"
						showLogin={true}
						showQuartzJapanLink={false}
					/>
				</div>
				<ul className={styles.emailCtas}>
					<li className={styles.emailCta}>
						<EmailCTA
							heading="AM：Daily Brief"
							subheading="平日の毎朝、世界の「今」を知る"
							description="世界のビジネスパーソンが読んでいるニュースを、日本でもリアルタイムで。押さえるべき｢世界で今起きている事」を、コンパクトに、毎朝の仕事の前にサッと読むのに最適なかたちでお届けします。ニュースは日英併記でお届けしているので、英語能力のアップデートにも役立ちます。"
							linkText="Daily Briefについて詳しく見る"
							linkUrl="/1916355/quartz-japan-daily-brief-ー【習慣力】毎朝のニュースレターが伝え/"
							screenshotUrl="https://cms.qz.com/wp-content/uploads/2020/10/qzjpdb.png"
							screenshotAlt="Screenshot of the Quartz Japan Daily Brief email"
						/>
					</li>
					<li className={styles.emailCta}>
						<EmailCTA
							heading="PM：Deep Dive"
							subheading="平日の夕方、世界の「未来」を考える"
							description={<Fragment>ビジネスとカルチャーを軸に、注目すべき新興産業／新興市場を曜日ごとにピックアップ。米国版Quartzから選りすぐった翻訳や日本版オリジナルの記事を通して「世界で次に起こる事」を深堀りします。最新のラインナップは<Link to="/re/quartz-japan/">こちら</Link>から。</Fragment>}
							linkText="Deep Diveについて詳しく見る"
							linkUrl="/1916847/quartz-japan-deep-dive-ー-毎日17時のニュースレターがお届けする世/"
							screenshotUrl="https://cms.qz.com/wp-content/uploads/2020/10/qzjpdeepdive.png"
							screenshotAlt="Screenshot of the Quartz Japan Deep Dive email"
						/>
					</li>
					<li className={styles.emailCta}>
						<EmailCTA
							heading="WEEKEND：A Guide to Guides"
							subheading="日曜朝、世界が注目する｢論点｣を読み解く"
							description="世界はいま何に注目し、どう論じているのか。毎週末、米国版Quartzの特集〈Guides〉から1つをピックアップし、解題します。週末、毎日の仕事から少しだけ解放される時間にも、頭の中の座標を世界標準に合わせるのに最適なロングリード・コンテンツです。"
							linkText="週末連載について詳しく見る"
							linkUrl="/1871195/quartz-japanの連載「guidesのガイド」の価値：ニュースだけで/"
							screenshotUrl="https://cms.qz.com/wp-content/uploads/2020/10/qzjpguides.png"
							screenshotAlt="Screenshot of the Quartz Japan Guide to Guides email"
						/>
					</li>
				</ul>

				<div className={styles.perksContainer}>
					<p className={styles.perkLabel}>Quartz Japanに登録すると。</p>
					<NewPerks length="short" />
				</div>

				<AccountEmailForm
					emailLabel="メールアドレスを入力"
					id="account-email-form-lower"
					submitText={props.submitText || defaultSubmitText}
					trackingData={props.trackingData}
					source="subscribe-japan"
				>
					<p className={styles.disclaimer}>
						メールアドレスを入力すると、料金プランを確認することができます。ご入力いただいたメールアドレスは、Quartzの<Link to="/about/privacy-policy/">プライバシーポリシー</Link>が適応されます。
						<br />
						このサイトはreCAPTCHAによって保護されており、Googleの<Link to="https://policies.google.com/privacy">プライバシーポリシー</Link>と<Link to="https://policies.google.com/terms">利用規約</Link>が適用されます。
					</p>
				</AccountEmailForm>

				<div className={styles.hints}>
					<SignupHints
						align="center"
						language="ja"
						showLogin={true}
						showQuartzJapanLink={false}
					/>
				</div>
			</div>
		</div>
	);
}

export default JapanEmailStep;
