import React from 'react';
import PropTypes from 'prop-types';
import getVariants from './LandingPagePromoVariants.js';
import classnames from 'classnames/bind';
import styles from './LandingPagePromoModule.module.scss';
import PageSection from '../../components/Page/PageSection/PageSection';
import PageSectionFooter from '../../components/Page/PageSectionFooter/PageSectionFooter';
import NewPerks from '../../components/NewPerks/NewPerks';
import { withQueryParamData } from '../../helpers/wrappers';
import Link from '../../components/Link/Link';
import AccountEmailForm from '../../components/AccountEmailForm/AccountEmailForm';
import ArtDirection from '../../components/ArtDirection/ArtDirection';
import { MEMBERSHIP_SIGNUP } from '../../helpers/tracking/actions';
import SignupHints from '../../components/SignupHints/SignupHints';
import SubscribeCTAs from '../../components/SubscribeCTAs/SubscribeCTAs';
import { offerCodeCtaText, offerCodeDiscount } from '../../config/membership';

const cx = classnames.bind( styles );

const generateSources = ( { imageUrl, imageUrlCropped } ) => [
	{
		breakpoint: 'phone-only',
		url: imageUrlCropped,
		width: 714,
		height: 449,
	},
	{
		breakpoint: 'tablet-portrait-up',
		url: imageUrlCropped,
		width: 688,
		height: 430,
	},
	{
		breakpoint: 'tablet-landscape-up',
		url: imageUrl,
		width: 364,
		height: 364,
	},
];

export const PromoHeader = ( {
	children,
	imageUrl,
	imageUrlCropped,
	isLoggedIn,
	showEmailSignup,
	trackingContext,
} ) => {
	const showEmailForm = showEmailSignup && !isLoggedIn;

	return (
		<div className={styles.headerContainer}>
			{!!( imageUrl || imageUrlCropped ) &&
			<div className={styles.artContainer}>
				<ArtDirection alt="" sources={generateSources( { imageUrl, imageUrlCropped } )} />
			</div>
			}
			<div className={styles.textContainer}>
				{children}
				{
					showEmailForm
						?
						<>
							<div className={`${styles.ctaContainer} ${styles.emailForm}`}>
								<AccountEmailForm
									emailLabel="Enter your email"
									layout="inline"
									source="subscribe"
									submitText={offerCodeCtaText}
									trackingData={{
										context: trackingContext,
										formName: MEMBERSHIP_SIGNUP,
										stageName: 'email',
									}}
								>
									<p className={styles.disclaimer}>By providing your email, you agree to the <Link to="/about/privacy-policy/">Quartz Privacy Policy</Link>.</p>
								</AccountEmailForm>
							</div>
							<SignupHints
								align="left"
								showLogin={true}
								showQuartzJapanLink={true}
							/>
						</>
						:
						<>
							<div className={styles.ctaContainer}>
								<SubscribeCTAs
									style="side-by-side"
									trackingContext={trackingContext}
								/>
							</div>
							<SignupHints
								align="left"
								showLogin={false}
								showQuartzJapanLink={true}
							/>
						</>
				}
			</div>
		</div>
	);
};

PromoHeader.propTypes = {
	children: PropTypes.node,
	imageUrl: PropTypes.string,
	imageUrlCropped: PropTypes.string,
	isLoggedIn: PropTypes.bool.isRequired,
	showEmailSignup: PropTypes.bool.isRequired,
	trackingContext: PropTypes.string.isRequired,
};

PromoHeader.defaultProps = {
	isLoggedIn: false,
	showEmailSignup: false,
};

const DefaultPromoHeader = () => (
	<PageSection
		hideTopBorder={true}
		hideBottomPadding
	>
		<PromoHeader
			trackingContext="promo page - 1"
			imageUrl="https://cms.qz.com/wp-content/uploads/2019/10/Quartz-membership_JoaoFazenda-1-e1569956985397.png?quality=80&strip=all"
			imageUrlCropped="https://cms.qz.com/wp-content/uploads/2019/10/Quartz-membership_JoaoFazenda.png?quality=80&strip=all"
			showEmailSignup={true}
		>
			<div className={cx( 'kicker' )}>Join us</div>
			<p className={cx( 'title' )}>No one knows exactly what comes next, but we’re pretty good at anticipating it</p>
			<div className={cx( 'description' )}>
				<p>When you become a Quartz member, we promise to guide you through these strange and uncertain times with rigor, insight, and intellectual honesty. We’ll provide you with the context, analyses, and community you need for what comes next.</p>
				<p>We think you’ll love it. Subscribe today for {offerCodeDiscount} off your first year. Thanks for reading!</p>
			</div>
			<NewPerks length="short" />
		</PromoHeader>
		<PageSectionFooter text="Questions? Visit our FAQs" url="https://help.qz.com/membership/" />
	</PageSection>
);

const LandingPagePromoModule = ( { landingPageMembershipPromo } ) => {
	if ( !landingPageMembershipPromo ) {
		return null;
	}

	const { contentVariant } = landingPageMembershipPromo;

	if ( contentVariant === 0 ) {
		return <DefaultPromoHeader />;
	}

	if ( ! getVariants( contentVariant ) ) {
		return null;
	}

	const { title, description, image, imageCropped, showPerks } = getVariants( contentVariant );

	return (
		<PageSection hideTopBorder={true}>
			<PromoHeader
				trackingContext="promo page - 1"
				imageUrl={image}
				imageUrlCropped={imageCropped || image}
			>
				<div className={cx( 'kicker' )}>Join us</div>
				<h1 className={cx( 'title' )}>{title}</h1>
				<div className={cx( 'description' )}>
					<p>{description}</p>
				</div>
				{showPerks && <NewPerks length="short" />}
			</PromoHeader>
			<PageSectionFooter text="Questions? Visit our FAQs" url="https://help.qz.com/membership/" />
		</PageSection>
	);
};

LandingPagePromoModule.propTypes = {
	landingPageMembershipPromo: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.object ] ).isRequired,
};

export default withQueryParamData()( LandingPagePromoModule );
