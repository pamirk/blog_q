import React, { createRef, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import compose from '../../../../../helpers/compose';
import styles from './FeedbackForm.module.scss';
import TextArea from '../../../../TextArea/TextArea';
import { Button, RadioButton } from '../../../../../@quartz/interface';
import { withVisibilityTracking } from '../../../../../helpers/wrappers';
import { makeTrackingAction } from '../../tracking';
import { feedbackReasons } from '../../config';
import usePageVariant from '../../../../../helpers/hooks/usePageVariant';
import getLocalization from '../../../../../helpers/localization';

const cx = classnames.bind( styles );

// noinspection JSNonASCIINames
const dictionary = {
	ja: {
		'It’s too expensive': '料金が高すぎる',
		'The content isn’t for me': 'コンテンツが合わなかった',
		'I am not getting the value I expected out of my membership': '思っていたものと違った',
		'I don’t have enough time to get all that I want out of my membership': 'コンテンツを読みきれなかった',
		'I have too many subscriptions already': 'すでに購読している媒体が多すぎる',
		'You’re contacting me too often': 'お知らせや連絡が多すぎる',
		'I only wanted to read one piece of content': '特定のコンテンツだけ読みたい',
		'Other – please specify': 'その他（詳細をご記入下さい）',
		'Please select a reason for your cancellation:': '退会理由にあてはまるチェックボックスを選択して下さい。',
		'Feel free to leave more feedback.': 'ご意見をお聞かせ下さい',
		Submit: '送信する',
		'No thanks': '回答しない',
	},
};

const FeedbackForm = ( { onSubmit: originalOnSubmit, onCancel } ) => {
	const [ feedbackDetails, setFeedbackDetails ] = useState( '' );
	const [ selectedReason, setSelectedReason ] = useState();
	const { language } = usePageVariant();
	const localize = getLocalization( { dictionary, language } );

	const feedbackDetailsEl = createRef();

	const onSubmit = e => {
		e.preventDefault();

		const feedback = [ selectedReason ];

		if ( feedbackDetailsEl.current?.value ) {
			feedback.push( feedbackDetailsEl.current.value );
		}

		originalOnSubmit( feedback );
	};

	return (
		<form onSubmit={onSubmit}>
			<fieldset className={cx( 'fieldset' )}>
				<legend className={cx( 'legend' )}>{localize( 'Please select a reason for your cancellation:' )}</legend>
				{
					feedbackReasons.map( ( reason, index ) => {
						const checked = reason === selectedReason;
						return (
							<Fragment key={index}>
								<div className={cx( 'input-row' )}>
									<RadioButton
										checked={selectedReason === reason}
										name="reason"
										onChange={() => {
											setSelectedReason( reason );
											if ( feedbackDetailsEl.current ) {
												feedbackDetailsEl.current.focus();
											}
										}}
									>
										<span className={cx( 'reason', { checked } )}>
											{localize( reason )}
										</span>
									</RadioButton>
								</div>
								{checked &&
									<div className={cx( 'input-text' )}>
										<TextArea
											onChange={e => {
												setFeedbackDetails( e.currentTarget.value );
											}}
											placeholder={localize( 'Feel free to leave more feedback.' )}
											ref={feedbackDetailsEl}
											value={feedbackDetails}
										/>
									</div>
								}
							</Fragment>
						);
					} )
				}
			</fieldset>
			<div className={cx( 'buttons' )}>
				<div className={cx( 'input-row' )}>
					<Button type="submit" disabled={!selectedReason}>{localize( 'Submit' )}</Button>
				</div>
				<div className={cx( 'input-row' )}>
					<Button variant="secondary" onClick={onCancel}>{localize( 'No thanks' )}</Button>
				</div>
			</div>
		</form>
	);
};

FeedbackForm.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

// Not using withTracking here because we need to pass component state into our action payload
const mapDispatchToProps = ( dispatch, ownProps ) => ( {
	onSubmit: feedback => {
		// Create an onSubmit prop function so we can dispatch a tracking action that sends the form values to GTM
		const action = makeTrackingAction( {
			eventAction: 'Submit cancelation reasons',
			eventLabel: feedback.join( ' - ' ),
		} );
		dispatch( action() );
		// Call the original onSubmit prop too, if it exists
		'function' === typeof ownProps.onSubmit && ownProps.onSubmit( feedback[0] );
	},
} );

const onMount = makeTrackingAction( { eventAction: 'View cancelation reasons form' } );

export default compose(
	connect( null, mapDispatchToProps ),
	withVisibilityTracking( { onMount } )
)( FeedbackForm );
