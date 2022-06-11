import React from 'react';
import PropTypes from 'prop-types';
import NewPerks from '../../../../NewPerks/NewPerks';
import {
	coupons,
	NOT_ENOUGH_INTEREST,
	TOO_MANY_SUBSCRIPTIONS,
	TOO_MANY_EMAILS,
	TOO_EXPENSIVE,
	CONTENT_NOT_RIGHT,
	NOT_ENOUGH_VALUE,
	NOT_ENOUGH_TIME,
} from '../../config';
import styles from '../../MembershipCancelationForm.module.scss';
import AcceptDiscountButton from '../AcceptDiscountButton/AcceptDiscountButton';
import CancelMembershipButton from '../CancelMembershipButton/CancelMembershipButton';
import { useUserSettings } from '../../../../../helpers/hooks';
import { PLAN_ID } from '../../../../../helpers/types/account';
import { allPlans } from '../../../../../config/membership';
import { getPlanDataByCountryCode } from '../../../../../helpers/plans';
import useTracking from '../../../../../helpers/hooks/useTracking';
import { makeTrackingAction } from '../../tracking';
import getLocalization from '../../../../../helpers/localization';
import usePageVariant from '../../../../../helpers/hooks/usePageVariant';
import useCancelSubscription from '../../../../../helpers/hooks/useCancelSubscription';
import useAddCouponToSubscription from '../../../../../helpers/hooks/useAddCouponToSubscription';
import usePlanChange from '../../../../../helpers/hooks/usePlanChange';

const trackingActionCreator = makeTrackingAction( { eventAction: 'Click discount CTA' } );

const formattedPrice = ( planId, applyDiscount = x => x ) => {
	const { priceDec, priceInt, countryCode } = allPlans[ planId ];
	const { symbol } = getPlanDataByCountryCode( countryCode, countryCode );

	if ( priceDec ) {
		return `${symbol}${( Math.abs( applyDiscount( priceDec ) ) / 100 ).toFixed( 2 )}`;
	}

	return `${symbol}${ applyDiscount( priceInt ) }`;
};

const formattedDiscount = ( planId ) => {
	const discount = price => price / 2;

	const price = formattedPrice( planId );
	const discountedPrice = formattedPrice( planId, discount );

	return (
		<>
			<del className={styles.incorrect}>
				{price}
			</del>
			{' '}
			<ins className={styles.correct}>
				{discountedPrice}
			</ins>
		</>
	);
};

function OfferButtons( { localize, loading: acceptDiscountRequestPending } ) {
	const { cancelSubscription, loading: cancelRequestPending } = useCancelSubscription();

	return (
		<div className={styles.offerButtons}>
			<div className={styles.inputRow}>
				<AcceptDiscountButton
					loading={acceptDiscountRequestPending}
					disabled={cancelRequestPending}
				>
					{localize( 'I’ll stay for 50% off' )}
				</AcceptDiscountButton>
			</div>
			<div className={styles.inputRow}>
				<CancelMembershipButton
					loading={cancelRequestPending}
					onClick={cancelSubscription}
				>
					{localize( 'I want to cancel' )}
				</CancelMembershipButton>
			</div>
		</div>
	);
}

OfferButtons.propTypes = {
	loading: PropTypes.bool.isRequired,
	localize: PropTypes.func.isRequired,
};

const dictionary = {
	ja: {
		'We know a subscription is an investment, but it’s the absolute best thing you can do to support our journalism.': 'Quartz Japanで、見逃したものはありませんか？',
		'If you cancel you’ll miss out on these membership benefits:': 'キャンセルが完了すると、以下のコンテンツはご覧いただけなくなります。',
		'We like to think Quartz has a little something for everyone, and want you to have time to find what you’re looking for.': 'Quartz Japanで、見逃したものはありませんか？',
		'We hate to hear that, and hope you’ll give us another chance to impress you.': 'Quartz Japanで、見逃したものはありませんか？',
		'We know time is everyone’s most precious resource. That’s why our member-exclusive emails and TLDR rundowns are geared at making you smarter, faster.': 'Quartz Japanで、見逃したものはありませんか？',
		'But what if you only had one? Our synthesized and digestible coverage of the global economy could be your perfect home base.': 'Quartz Japanで、見逃したものはありませんか？',
		'Sorry, we just get so EXCITED. We’re working on it.': 'アンケートにご回答いただき、ありがとうございます。改善に努めてまいります。',
		'Okay—but imagine having that experience over and over again. We think with more time, you’ll find plenty of Quartz content to enjoy.': 'Quartz Japanで、見逃したものはありませんか？',
		'Thank you for being a Quartz member. We appreciate your support for our journalism.': 'Quartzのジャーナリズムをサポートいただききありがとうございます。',
		'I’ll stay for 50% off': '50%OFFで購読を続ける',
		'I want to cancel': 'キャンセル手続きを完了する',
	},
};

const DiscountDescription = ( { isYearly, reason, defaultPlanId, monthlyPlanId, language } ) => {
	// it is pretty complicated to try and localize + interpolate JSX at the same [time]
	// so for simplicity's sake, branch the component
	if ( 'ja' === language ) {
		switch ( reason ) {
			case TOO_EXPENSIVE:
				return (
					<p className={styles.proposal}>
						{isYearly ?
							<>来年のご購読を50%OFF({formattedDiscount( defaultPlanId )})でご利用いただけるプランをご用意しました。こちらのプランで購読を継続しませんか？</> :
							<>今後3カ月間、 50%OFF({formattedDiscount( monthlyPlanId )})でご利用いただけるプランをご用意しました。こちらのプランで購読を継続しませんか？</>
						}
					</p>
				);
			case CONTENT_NOT_RIGHT:
				return (
					<p className={styles.proposal}>
						{isYearly ?
							<>今後3カ月間、 50%OFF({formattedDiscount( monthlyPlanId )})でご利用いただけるプランをご用意しました。月額プランに変更し、3カ月間、こちらのプランで少し手軽に購読を継続しませんか？</> :
							<>今後3カ月間、 50%OFF({formattedDiscount( monthlyPlanId )})でご利用いただけるプランをご用意しました。3カ月間、こちらの月額プランで少し手軽に購読を継続しませんか？</>
						}
					</p>
				);
			case NOT_ENOUGH_VALUE:
				return (
					<p className={styles.proposal}>
						{isYearly ?
							<>今後3カ月間、 50%OFF({formattedDiscount( monthlyPlanId )})でご利用いただけるプランをご用意しました。月額プランに変更し、こちらのプランでもう少し購読を継続しませんか？</> :
							<>今後3カ月間、 50%OFF({formattedDiscount( monthlyPlanId )})でご利用いただけるプランをご用意しました。3カ月間、こちらの月額プランで、こちらのプランでもう少し購読を継続しませんか？</>
						}
					</p>
				);
			case NOT_ENOUGH_TIME:
				return (
					<p className={styles.proposal}>
						{isYearly ?
							<>今後3カ月間、 50%OFF({formattedDiscount( monthlyPlanId )})でご利用いただけるプランをご用意しました。月額プランに変更し、3カ月間、こちらのプランで購読を継続しませんか？</> :
							<>今後3カ月間、 50%OFF({formattedDiscount( monthlyPlanId )})でご利用いただけるプランをご用意しました。3カ月間、こちらの月額プランで購読を継続しませんか？</>
						}
					</p>
				);
			// only the above reasons have specific Japanese copy
			default:
				return (
					<p className={styles.proposal}>
						{isYearly ?
							<>来年のご購読を50%OFF({formattedDiscount( defaultPlanId )})でご利用いただけるプランをご用意しました。こちらのプランで購読を継続しませんか？</> :
							<>今後3カ月間、 50%OFF({formattedDiscount( monthlyPlanId )})でご利用いただけるプランをご用意しました。こちらのプランで購読を継続しませんか？</>
						}
					</p>
				);
		}
	}

	switch ( reason ) {
		case TOO_EXPENSIVE:
			return (
				<p className={styles.proposal}>
					{isYearly ?
						<>We’d hate for you to lose access, so how about 50% ({formattedDiscount( defaultPlanId )}) off the next year of membership?</> :
						<>We’d hate for you to lose access, so how about 50% ({formattedDiscount( monthlyPlanId )}) off the next 3 months of membership?</>
					}
				</p>
			);
		case CONTENT_NOT_RIGHT:
			return (
				<p className={styles.proposal}>
					{isYearly ?
						<>How about switching to the monthly plan with a 50% ({formattedDiscount( monthlyPlanId )}) discount for the next 3 months, so you can take more time with us, at a lower commitment?</> :
						<>How about 50% ({formattedDiscount( monthlyPlanId )}) off the next 3 months of membership, so you can take more time with us, at a lower commitment?</>
					}
				</p>
			);
		case NOT_ENOUGH_VALUE:
			return (
				<p className={styles.proposal}>
					{isYearly ?
						<>How about switching to the monthly plan with a 50% ({formattedDiscount( monthlyPlanId )}) discount for the next 3 months to have some more time to discover all that Quartz has to offer?</> :
						<>How about 50% ({formattedDiscount( monthlyPlanId )}) off the next 3 months of membership to have some more time to discover all that Quartz has to offer?</>
					}
				</p>
			);
		case NOT_ENOUGH_TIME:
			return (
				<p className={styles.proposal}>
					{isYearly ?
						<>Don’t time us out just yet. How about switching to the monthly plan with a 50% ({formattedDiscount( monthlyPlanId )}) discount for the next 3 months?</> :
						<>Don’t time us out just yet. How about a 50% ({formattedDiscount( monthlyPlanId )}) discount for the next 3 months?</>
					}
				</p>
			);
		case TOO_MANY_SUBSCRIPTIONS:
			return (
				<p className={styles.proposal}>
					{isYearly ?
						<>Keep us in the mix by taking 50% ({formattedDiscount( defaultPlanId )}) off the next year of membership and let us prove it to you.</> :
						<>Keep us in the mix by taking 50% ({formattedDiscount( monthlyPlanId )}) off the next 3 months of membership and let us prove it to you.</>
					}
				</p>
			);
		case TOO_MANY_EMAILS:
			return (
				<p className={styles.proposal}>
					While we do, give us a chance to be more chill—at a discounted price.{' '}
					{isYearly ?
						<>We’d love to offer 50% ({formattedDiscount( defaultPlanId )}) off the next year of membership. What do you say?</> :
						<>We’d love to offer 50% ({formattedDiscount( monthlyPlanId )}) off the next 3 months of membership. What do you say?</>
					}
				</p>
			);
		case NOT_ENOUGH_INTEREST:
			return (
				<p className={styles.proposal}>
					{isYearly ?
						<>We’d love to offer 50% ({formattedDiscount( defaultPlanId )}) off the next year of membership. What do you say?</> :
						<>We’d love to offer 50% ({formattedDiscount( monthlyPlanId )}) off the next 3 months of membership. What do you say?</>
					}
				</p>
			);
		default:
			return (
				<p className={styles.proposal}>
					{isYearly ?
						<>We’d love for you to stick around, so how about taking 50% ({formattedDiscount( defaultPlanId )}) off the next year of membership?</> :
						<>We’d love for you to stick around, so how about taking 50% ({formattedDiscount( monthlyPlanId )}) off the next 3 months of membership?</>
					}
				</p>
			);
	}
};

DiscountDescription.propTypes = {
	defaultPlanId: PropTypes.number.isRequired,
	isYearly: PropTypes.bool,
	language: PropTypes.string,
	monthlyPlanId: PropTypes.number.isRequired,
	reason: PropTypes.string.isRequired,
};

const OfferCTA = ( {
	defaultPlanId,
	isYearly,
	loading,
	monthlyPlanId,
	reason,
	trackedOnSubmit,
	trackedPlanSwitchOnSubmit,
} ) => {
	const { language } = usePageVariant();
	const localize = getLocalization( { dictionary, language } );
	if ( reason === TOO_EXPENSIVE ) {
		return (
			<form className={styles.container} onSubmit={trackedOnSubmit} >
				<h1 className={styles.title}>{localize( 'We know a subscription is an investment, but it’s the absolute best thing you can do to support our journalism.' )}</h1>
				<p className={styles.description}>
					{localize( 'If you cancel you’ll miss out on these membership benefits:' )}
				</p>
				<NewPerks />
				<DiscountDescription isYearly={isYearly} reason={reason} defaultPlanId={defaultPlanId} monthlyPlanId={monthlyPlanId} language={language} />
				<OfferButtons loading={loading} localize={localize} />
			</form>
		);
	}

	if ( reason === CONTENT_NOT_RIGHT ) {
		return (
			<form className={styles.container} onSubmit={trackedPlanSwitchOnSubmit} >
				<h1 className={styles.title}>{localize( 'We like to think Quartz has a little something for everyone, and want you to have time to find what you’re looking for.' )}</h1>
				<p className={styles.description}>
					{localize( 'If you cancel you’ll miss out on these membership benefits:' )}
				</p>
				<NewPerks />
				<DiscountDescription isYearly={isYearly} reason={reason} defaultPlanId={defaultPlanId} monthlyPlanId={monthlyPlanId} language={language} />
				<OfferButtons loading={loading} localize={localize} />
			</form>
		);
	}

	if ( reason === NOT_ENOUGH_VALUE ) {
		return (
			<form className={styles.container} onSubmit={trackedPlanSwitchOnSubmit} >
				<h1 className={styles.title}>{localize( 'We hate to hear that, and hope you’ll give us another chance to impress you.' )}</h1>
				<p className={styles.description}>
					{localize( 'If you cancel you’ll miss out on these membership benefits:' )}
				</p>
				<NewPerks />
				<DiscountDescription isYearly={isYearly} reason={reason} defaultPlanId={defaultPlanId} monthlyPlanId={monthlyPlanId} language={language} />
				<OfferButtons loading={loading} localize={localize} />
			</form>
		);
	}

	if ( reason === NOT_ENOUGH_TIME ) {
		return (
			<form className={styles.container} onSubmit={trackedPlanSwitchOnSubmit}>
				<h1 className={styles.title}>
					{localize( 'We know time is everyone’s most precious resource. That’s why our member-exclusive emails and TLDR rundowns are geared at making you smarter, faster.' )}
				</h1>
				<p className={styles.description}>
					{localize( 'If you cancel you’ll miss out on these membership benefits:' )}
				</p>
				<NewPerks />
				<DiscountDescription isYearly={isYearly} reason={reason} defaultPlanId={defaultPlanId} monthlyPlanId={monthlyPlanId} language={language} />
				<OfferButtons loading={loading} localize={localize} />
			</form>
		);
	}

	if ( reason === TOO_MANY_SUBSCRIPTIONS ) {
		return (
			<form className={styles.container} onSubmit={trackedOnSubmit}>
				<h1 className={styles.title}>{localize( 'But what if you only had one? Our synthesized and digestible coverage of the global economy could be your perfect home base.' )}</h1>
				<p className={styles.description}>
					{localize( 'If you cancel you’ll miss out on these membership benefits:' )}
				</p>
				<NewPerks />
				<DiscountDescription isYearly={isYearly} reason={reason} defaultPlanId={defaultPlanId} monthlyPlanId={monthlyPlanId} language={language} />
				<OfferButtons loading={loading} localize={localize} />
			</form>
		);
	}

	if ( reason === TOO_MANY_EMAILS ) {
		return (
			<form className={styles.container} onSubmit={trackedOnSubmit}>
				<h1 className={styles.title}>{localize( 'Sorry, we just get so EXCITED. We’re working on it.' )}</h1>
				<p className={styles.description}>
					{localize( 'If you cancel you’ll miss out on these membership benefits:' )}
				</p>
				<NewPerks />
				<DiscountDescription isYearly={isYearly} reason={reason} defaultPlanId={defaultPlanId} monthlyPlanId={monthlyPlanId} language={language} />
				<OfferButtons loading={loading} localize={localize} />
			</form>
		);
	}

	if ( reason === NOT_ENOUGH_INTEREST ) {
		return (
			<form className={styles.container} onSubmit={trackedOnSubmit}>
				<h1 className={styles.title}>
					{localize( 'Okay—but imagine having that experience over and over again. We think with more time, you’ll find plenty of Quartz content to enjoy.' )}
				</h1>
				<p className={styles.description}>
					{localize( 'If you cancel you’ll miss out on these membership benefits:' )}
				</p>
				<NewPerks />
				<DiscountDescription isYearly={isYearly} reason={reason} defaultPlanId={defaultPlanId} monthlyPlanId={monthlyPlanId} language={language} />
				<OfferButtons loading={loading} localize={localize} />
			</form>
		);
	}

	// Generic response for Other/declined to respond to survey.
	return (
		<form className={styles.container} onSubmit={trackedOnSubmit}>
			<h1 className={styles.title}>
				{localize( 'Thank you for being a Quartz member. We appreciate your support for our journalism.' )}
			</h1>
			<p className={styles.description}>
				{localize( 'If you cancel you’ll miss out on these membership benefits:' )}
			</p>
			<NewPerks />
			<DiscountDescription isYearly={isYearly} reason={reason} defaultPlanId={defaultPlanId} monthlyPlanId={monthlyPlanId} language={language} />
			<OfferButtons loading={loading} localize={localize} />
		</form>
	);
};

OfferCTA.propTypes = {
	defaultPlanId: PropTypes.number.isRequired,
	isYearly: PropTypes.bool,
	loading: PropTypes.bool,
	monthlyPlanId: PropTypes.number.isRequired,
	reason: PropTypes.string.isRequired,
	trackedOnSubmit: PropTypes.func.isRequired,
	trackedPlanSwitchOnSubmit: PropTypes.func.isRequired,
};

function OfferStep( { feedbackReason: reason } ) {
	const { getUserSetting } = useUserSettings();
	const currentPlanId = getUserSetting( PLAN_ID );
	const { addCouponToSubscription, loading: addCouponRequestPending } = useAddCouponToSubscription();
	const { updatePlan, loading: updatePlanRequestPending } = usePlanChange();

	const loading = addCouponRequestPending || updatePlanRequestPending;

	// Get the country code that corresponds to the user's current plan.
	const { countryCode, yearly: isYearly } = allPlans[ currentPlanId ];

	// Use the country code to retrieve that region's plan ids and currency symbol.
	// Plans can only be changed within their region: India to India, US to US, etc.
	const {
		monthlyPlanId,
		defaultPlanId,
	} = getPlanDataByCountryCode( countryCode, countryCode );

	// Apply the appropriate coupon.
	const onSubmit = ( event ) => {
		event.preventDefault();
		addCouponToSubscription( isYearly ? coupons.halfOffOnce : coupons.halfOff3Months );
	};

	// Switch the yearly plan to monthly and then apply the monthly coupon.
	const planSwitchOnSubmit = ( event ) => {
		event.preventDefault();

		if ( isYearly ) {
			return updatePlan( monthlyPlanId )
				.then( () => addCouponToSubscription( coupons.halfOff3Months ) );
		}

		return addCouponToSubscription( coupons.halfOff3Months );
	};

	const trackedOnSubmit = useTracking( trackingActionCreator, {}, onSubmit );
	const trackedPlanSwitchOnSubmit = useTracking( trackingActionCreator, {}, planSwitchOnSubmit );

	return (
		<OfferCTA
			defaultPlanId={defaultPlanId}
			loading={loading}
			isYearly={isYearly}
			monthlyPlanId={monthlyPlanId}
			reason={reason}
			trackedOnSubmit={trackedOnSubmit}
			trackedPlanSwitchOnSubmit={trackedPlanSwitchOnSubmit}
		/>
	);
}

OfferStep.propTypes = {
	feedbackReason: PropTypes.string.isRequired,
};

export default OfferStep;
