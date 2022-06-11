import {useEffect, useReducer} from 'react';
import handleSignup from '../../components/EmailSignup/handleSignup';
import {isValidEmail} from '../validation';

import {getUtmQueryParams} from '../queryParams';

const {utm_campaign, utm_source} = getUtmQueryParams();

const SET_FIELD_VAL = 'SET_FIELD_VAL';
const TOGGLE_CHECKBOX = 'TOGGLE_CHECKBOX';
const SET_ERROR = 'SET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_SUCCESS = 'SET_SUCCESS';
const RESET = 'RESET';

// use for lazy initialization / reset of the email state
const init = ({email, slugs}) => ({
    emailAddress: email || '',
    error: '',
    inputStatus: '',
    initialSlugs: slugs,
    selectedSlugs: slugs,
    loading: false,
    showErrors: false,
});

// reducer function for state mutations
const reducer = (state, action) => {
    switch (action.type) {
        case SET_FIELD_VAL:
            return {
                ...state,
                [action.payload.field]: action.payload.val,
            };
        case TOGGLE_CHECKBOX:
            const {selectedSlugs} = state;
            const isIncluded = selectedSlugs.includes(action.payload.slug);
            const newSlugs = isIncluded
                ? selectedSlugs.filter(slug => slug !== action.payload.slug)
                : [...selectedSlugs, action.payload.slug];
            // if they check a new box, reset errors
            return {
                ...state,
                inputStatus: '',
                error: '',
                showErrors: false,
                selectedSlugs: newSlugs,
            };
        case SET_ERROR:
            return {...state, inputStatus: 'error', loading: false, error: action.payload.val, showErrors: true};
        case CLEAR_ERROR:
            return {...state, inputStatus: '', loading: false, error: '', showErrors: false};
        case SET_SUCCESS:
            return {...state, inputStatus: 'confirmed', loading: false, selectedSlugs: []};
        case RESET:
            return init({email: action.payload.email, slugs: action.payload.slugs});
        default:
            return state;
    }
};

const useEmailSubmit = ({
                            email,
                            handleChange,
                            isLoggedIn,
                            slugs,
                            onError: onErrorFromProps = () => {
                            },
                            onSignupConfirmed = () => {
                            },
                            referredByEmail,
                            registerUser,
                        }) => {
    // setup state & action creators
    const [{
        emailAddress,
        selectedSlugs,
        initialSlugs,
        inputStatus,
        loading,
        error,
        showErrors,
    }, dispatch] = useReducer(reducer, {email, slugs}, init);

    const handleFieldChange = (field, val) => dispatch({payload: {field, val}, type: SET_FIELD_VAL});
    const toggleCheckbox = (slug) => dispatch({payload: {slug}, type: TOGGLE_CHECKBOX});
    const clearError = () => dispatch({type: CLEAR_ERROR});

    const setEmail = (newEmail) => {
        handleFieldChange('emailAddress', newEmail);
        handleChange(newEmail);
        clearError();
    };

    const onError = ({message}) => {
        dispatch({payload: {val: message}, type: SET_ERROR});
        onErrorFromProps(message);
    };

    const onSuccess = (respJson) => {
        dispatch({type: SET_SUCCESS});
        // we need to pass the user's email back into any onSignupConfirmed callback
        // since the response only returns hashed PII...
        onSignupConfirmed({slugs: selectedSlugs, email: emailAddress, ...respJson});
    };

    // handle signup
    const handleEmailSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        if (selectedSlugs.length === 0) {
            return onError({message: 'Please select at least one email'});
        }

        // If the email address is invalid, don't attempt to send anything.
        if (!isValidEmail(emailAddress)) {
            return onError({message: 'Please enter a valid email'});
        }

        const customFieldData = {referred_by_email: referredByEmail, utm_campaign, utm_source};

        // Format identifying info about the request (utm params, referring email) to
        // save in Sendgrid on the contact's custom fields.
        // Only pass these if they're present.
        const customFields = Object.keys(customFieldData).reduce((acc, key) => {
            if (customFieldData[key]) {
                return {...acc, [key]: customFieldData[key]};
            }
            return acc;
        }, {});

        handleFieldChange('loading', true);

        const data = {
            emailAddress,
            slugs: selectedSlugs,
            customFields,
        };

        handleSignup({
            data,
            isLoggedIn,
            onError,
            onSuccess,
            registerUser,
        });
    };

    useEffect(() => {
        const reset = (newSlugs) => dispatch({payload: {email: emailAddress, slugs: newSlugs}, type: RESET});

        // if we're adding new slugs to the list of initial slugs (see email form), reset
        if (slugs.length !== initialSlugs.length) {
            reset(slugs);
        }
    }, [emailAddress, initialSlugs.length, slugs]);

    // return state props & submission function
    return {
        emailAddress,
        handleEmailSubmit,
        setEmail,
        toggleCheckbox,
        selectedSlugs,
        inputStatus,
        loading,
        error,
        showErrors,
    };
};
export default useEmailSubmit;