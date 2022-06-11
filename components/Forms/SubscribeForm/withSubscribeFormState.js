import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from '../../../helpers/compose';
import { withRouter } from 'next/router';
import { USER_NAME } from '../../../helpers/types/account';
import { blurFields, validateField, validateFields } from '../../../helpers/forms';
import {
	fieldStateProps,
	withQueryParamData,
	withUserApi,
	withNotifications,
} from '../../../helpers/wrappers';
import { SET_PASSWORD_REQUEST_ID, UPDATE_PROFILE_REQUEST_ID } from '../../../helpers/wrappers/withUserApi/config';

const fieldNames = [ 'firstName', 'company', 'title', 'jobLevelId', 'industryId' ];
const requestIds = [ SET_PASSWORD_REQUEST_ID, UPDATE_PROFILE_REQUEST_ID ];

export const sharedPropTypes = {
	formError: PropTypes.node,
	formState: PropTypes.shape( {
		company: fieldStateProps,
		firstName: fieldStateProps,
		title: fieldStateProps,
	} ),
	handleCancel: PropTypes.func.isRequired,
	handleFieldChange: PropTypes.func.isRequired,
	pendingRequestId: PropTypes.string,
};

export default () => FormComponent => {
	class FormComponentWithSubscribeFormState extends Component {
		constructor( props ) {
			super( props );

			this.state = validateFields( fieldNames, this.getInitialState() );

			this.handleCancel = this.handleCancel.bind( this );
			this.handleFieldChange = this.handleFieldChange.bind( this );
			this.handleProfileSubmit = this.handleProfileSubmit.bind( this );
			this.handleNewsletterSubmit = this.handleNewsletterSubmit.bind( this );
			this.handleSuccess = this.handleSuccess.bind( this );
		}

		componentDidUpdate( prevProps ) {
			const { hasFetchedSettings } = this.props;

			if ( hasFetchedSettings && ! prevProps.hasFetchedSettings ) {
				this.setState( validateFields( fieldNames, this.getInitialState() ) );
			}
		}

		getInitialState() {
			const { getUserAttribute } = this.props;
			const firstName = getUserAttribute( USER_NAME ) || '';

			return {
				formLoading: false,
				completedProfileStep: !!firstName,
				company: {
					value: '',
					errors: [],
				},
				firstName: {
					value: firstName,
					errors: [],
				},
				title: {
					value: '',
					errors: [],
				},
				jobLevelId: {
					value: '',
					errors: [],
				},
				industryId: {
					value: '',
					errors: [],
				},
			};
		}

		handleProfileSubmit( e ) {
			e.preventDefault();

			const fieldNames = [ 'company', 'firstName', 'title', 'jobLevelId', 'industryId' ];
			const { updateProfile, notifyError } = this.props;
			const newFormState = validateFields( fieldNames, this.state );

			if ( fieldNames.some( fieldName => newFormState[ fieldName ].errors.length ) ) {
				this.setState( blurFields( fieldNames, newFormState ) );
				return;
			}

			const userData = fieldNames.reduce( ( acc, fieldName ) => ( {
				...acc,
				[ fieldName ]: newFormState[ fieldName ].value,
			} ), {} );

			updateProfile( {
				...userData,
				requestId: UPDATE_PROFILE_REQUEST_ID,
			} )
				.then( () => {
					this.setState( { completedProfileStep: true } );
				} )
				.catch( () => notifyError( 'There was an error updating your profile.' ) );
		}

		handleNewsletterSubmit() {
			this.setState( { completedNewsletterStep: true } );
		}

		handleUserExit( event, location ) {
			event.preventDefault();

			const { handleCancel, history } = this.props;

			// Modal? Close it.
			if ( handleCancel ) {
				handleCancel();
				return;
			}

			// Non modal? Go to provided location.
			history.push( location );
		}

		handleCancel( event ) {
			this.handleUserExit( event, '/' );
		}

		handleSuccess( event ) {
			this.handleUserExit( event, '/' );
		}

		handleFieldChange( name, fieldState = {} ) {
			const oldFieldState = this.state[name];
			const newFieldState = validateField( { ...oldFieldState, ...fieldState } );

			this.setState( {
				[name]: newFieldState,
			} );
		}

		render() {
			const { company, firstName, title, formLoading, formError, jobLevelId, industryId, completedProfileStep, completedNewsletterStep } = this.state;

			const { userError, pendingRequestId } = this.props;

			const loading = requestIds.includes( pendingRequestId ) || formLoading;

			return (
				<FormComponent
					completedProfileStep={completedProfileStep}
					completedNewsletterStep={completedNewsletterStep}
					formError={userError || formError || null}
					formLoading={loading}
					formState={{ company, firstName, title, industryId, jobLevelId }}
					handleCancel={this.handleCancel}
					handleCardChange={this.handleCardChange}
					handleFieldChange={this.handleFieldChange}
					handleProfileSubmit={this.handleProfileSubmit}
					handleNewsletterSubmit={this.handleNewsletterSubmit}
					handleSuccess={this.handleSuccess}
					{...this.props}
				/>
			);
		}
	}

	FormComponentWithSubscribeFormState.propTypes = {
		getUserAttribute: PropTypes.func.isRequired,
		handleCancel: PropTypes.func,
		hasFetchedSettings: PropTypes.bool.isRequired,
		history: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		notifyError: PropTypes.func.isRequired,
		pendingRequestId: PropTypes.string,
		updateError: PropTypes.func.isRequired,
		updateProfile: PropTypes.func.isRequired,
		userError: PropTypes.node,
	};

	return compose(
		withRouter,
		withUserApi( { useSettings: true } ),
		withNotifications,
		withQueryParamData()
	)( FormComponentWithSubscribeFormState );
};
