/**
 * Return an updated form state with the provided field state merged into each of the given fields.
 */
export function setFields(
	/** Field names to update */
	names: string[],
	/** Field state to add */
	newFieldState: { [k: string]: any },
	/** Current form state */
	formState: { [k: string]: any }
) {
	const newFormState = names.reduce( ( acc, key ) => (
		{
			...acc,
			[key]: {
				...formState[key],
				...newFieldState,
			},
		}
	), formState );

	return newFormState;
}

/**
 * Return updated form state with blurred flag updated.
 */
export function blurFields(
	/** Field names to blur */
	names: string[],
	formState: { [k: string]: any }
) {
	return setFields( names, { blurred: true }, formState );
}

/**
 * Validate a field using provided validator, if it exists.
 */
export function validateField( fieldState: { [k: string]: any } ) {
	const { validator, value } = fieldState;

	return {
		...fieldState,
		errors: validator ? validator( value ) : [],
	};
}

/**
 * Validate multiple fields.
 */
export function validateFields( names: string[], formState: { [k: string]: any } ) {
	const newFormState = names.reduce( ( acc, key ) => (
		{
			...acc,
			[key]: validateField( formState[key] ),
		}
	), formState );

	return newFormState;
}

/**
 * Determine if the form is valid by inspecting the errors field state.
 */
export function validateForm( names: string[], formState: { [k: string]: any } ) {
	const fieldError = names.some( key => formState[key]?.errors?.length );

	return !fieldError;
}

export function getFieldErrors( names: string[], formState: { [k: string]: any } ) {
	const reducer = ( acc, key ) => formState[key].errors.length ? [ ...acc, ...formState[key].errors ] : acc;

	return names.reduce( reducer, [] );
}
