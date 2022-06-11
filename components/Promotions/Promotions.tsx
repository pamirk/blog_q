import React, {Fragment} from 'react';
import {trackFieldEvent} from 'helpers/tracking/actions';
import {RadioButton} from '@quartz/interface';
import styles from './Promotions.module.scss';
import classnames from 'classnames/bind';
import {offerCode, offerCodeDiscount} from 'config/membership';
import PromoCodeField from 'components/PromoCodeField/PromoCodeField';
import getLocalization from 'helpers/localization';
import usePageVariant from 'helpers/hooks/usePageVariant';
import useTracking, {useTrackingOnMount} from 'helpers/hooks/useTracking';
import {PromoType} from 'components/PlanSelectForm/PlanSelectForm';
import trackSegmentCouponSubmitted from 'helpers/tracking/segment/trackCouponSubmitted';

const cx = classnames.bind(styles);

// The name used to identify this module in GA.
const PROMOTIONS_MODULE = 'special offer module';
const BOGO_OFFER = 'BOGO offer';

const dictionary = {
    ja: {
        'Promo or gift code': 'プロモーションコード',
        'Promo codes only apply to the yearly plan': 'クーポンコードは年割プランでのみご利用いただけます。※コードを入力すると、月額プランへの登録はできません。月額プランでの利用をご希望の方は、このページを再読み込みいいただき、コードを入力せずに月額プランを選択ください。',
    },
};

function RadioContents(props: { selected: boolean, children: React.ReactNode, emoji: string }) {
    return (
        <div className={cx('radio-content-container', {selected: props.selected})}>
            <div className={styles.radioContent}>{props.children}</div>
            <span className={styles.emoji}>
				{props.emoji}
			</span>
        </div>
    );
}

export default function Promotions(props: {
    clearPromoCode: () => void;
    couponCode: string | null;
    defaultValue?: string,
    error?: React.ReactNode,
    checkPromoCode: (code?: string) => void;
    giftCode: string | null;
    label?: string;
    loading: boolean;
    planPreview?: { discount: { coupon: { percentOff: number; }; }; };
    inputRef: React.RefObject<HTMLInputElement>,
    selectedPromo: string | null,
    setSelectedPromo: (value: PromoType) => void,
    showSpecialOffers: boolean;
    trackingData: { formName: string };
}) {
    const {language} = usePageVariant();
    const localize = getLocalization({dictionary, language});

    // The button on the PromoCodeField: verify a promo or gift on the server.
    const handleButtonClick = (evt: React.MouseEvent) => {
        evt.preventDefault();
        props.clearPromoCode();
        trackSegmentCouponSubmitted({couponCode: props.inputRef.current?.value});
        props.checkPromoCode(props.inputRef.current?.value);
    };

    const codeIsVerified = !!props.giftCode || !!props.couponCode;

    const promoCodeFieldProps = {
        handleButtonClick,
        inputRef: props.inputRef,
        defaultValue: props.defaultValue,
        success: codeIsVerified,
        onChange: () => {
            props.clearPromoCode();
            props.setSelectedPromo('promoCode');
        },
        loading: props.loading,
        error: props.error,
        percentOff: props.planPreview?.discount?.coupon?.percentOff,
    };

    // Select the coupon radio button, validate the offer code on the server,
    // and reset other values.
    function onCouponRadioChange() {
        props.setSelectedPromo('coupon');

        // zero out
        props.clearPromoCode();

        // reset text field
        Object.assign(props.inputRef.current as any, {value: ''});

        // validate
        props.checkPromoCode(offerCode);
    }

    const trackedCouponChange = useTracking(trackFieldEvent, {
        formName: props.trackingData.formName,
        action: 'click',
        context: offerCode,
        moduleName: PROMOTIONS_MODULE,
    }, onCouponRadioChange);

    useTrackingOnMount(trackFieldEvent, {
        formName: props.trackingData.formName,
        action: 'view',
        context: offerCode,
        moduleName: PROMOTIONS_MODULE,
    });

    // Select the BOGO radio button and reset other values.
    function onBogoRadioChange(): void {
        props.setSelectedPromo('bogo');
        props.clearPromoCode();

        // reset text field
        Object.assign(props.inputRef.current as any, {value: ''});
    }

    const trackedBogoChange = useTracking(trackFieldEvent, {
        action: 'click',
        formName: props.trackingData.formName,
        context: '3 months',
        moduleName: BOGO_OFFER,
    }, onBogoRadioChange);

    useTrackingOnMount(trackFieldEvent, {
        action: 'view',
        formName: props.trackingData.formName,
        context: '3 months',
        moduleName: BOGO_OFFER,
    });

    // Select the promo code field and reset other values.
    // No tracking here since our field-within-a-field layout means viewing/clicking into
    // the promo code radio isn't meaningful in the same way as the other radio buttons.
    // Promo code validation is handled in the PromoCodeField.
    function onPromoCodeChange() {
        props.setSelectedPromo('promoCode');
        props.clearPromoCode();
    }

    const showHint = !props.giftCode;

    return (
        <Fragment>
            {!props.showSpecialOffers &&
            <PromoCodeField
                {...promoCodeFieldProps}
                label={localize('Promo or gift code')}
                hint={showHint ? localize('Promo codes only apply to the yearly plan') : undefined}
            />
            }
            {props.showSpecialOffers &&
            <div className={styles.container}>
                <div className={cx('offer-title')}>
                    Choose one special offer
                </div>
                <div className={cx('inner-container', {selected: props.selectedPromo})}>

                    <div className={styles.radio}>
                        <RadioButton
                            display="block"
                            onChange={() => {
                                trackedBogoChange();
                            }}
                            name="selected-promo"
                            checked={'bogo' === props.selectedPromo}
                        >
                            <RadioContents
                                emoji="🎁"
                                selected={'bogo' === props.selectedPromo}
                            >
                                Gift a 3-month pass to Quartz (a value of $29.99)*
                            </RadioContents>
                        </RadioButton>
                    </div>

                    <hr className={styles.divider}/>

                    <RadioButton
                        display="block"
                        onChange={() => {
                            trackedCouponChange();
                        }}
                        name="selected-promo"
                        checked={'coupon' === props.selectedPromo}
                    >
                        <RadioContents
                            emoji="😎"
                            selected={'coupon' === props.selectedPromo}
                        >
                            {`${offerCodeDiscount} off one year with this coupon`}
                        </RadioContents>
                    </RadioButton>

                    <hr className={styles.divider}/>

                    <div className={styles.radio}>
                        <RadioButton
                            display="block"
                            onChange={onPromoCodeChange}
                            name="selected-promo"
                            checked={'promoCode' === props.selectedPromo}
                        >
                            <RadioContents
                                emoji="🎉"
                                selected={'promoCode' === props.selectedPromo}
                            >
                                <PromoCodeField
                                    {...promoCodeFieldProps}
                                    onFocus={onPromoCodeChange}
                                    placeholder={localize('Promo or gift code')}
                                    success={!!(props.inputRef.current?.value && codeIsVerified)}
                                    onChange={onPromoCodeChange}
                                />
                            </RadioContents>
                        </RadioButton>
                    </div>
                </div>
                {showHint &&
                <div className={styles.hint}>
                    {localize('Promo codes only apply to the yearly plan')}
                    <div>
                        *Your free gift pass will be sent to you at the completion of your free trial
                    </div>
                </div>
                }
            </div>
            }
        </Fragment>
    );
}
