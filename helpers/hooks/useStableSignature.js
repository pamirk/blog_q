import { useReducer } from 'react';

/**
 * In rare instances, we only want to run a function when specific dependencies change. The exhaustive dependency requirements of
 * useEffect and useCallback can cause our functions to run too often. To avoid this, we can intentionally take advantage of useReducer
 * to create a function with a stable signature that doesn't require a dependency array. Some documentation on this approach:
 * https://overreacted.io/a-complete-guide-to-useeffect/#why-usereducer-is-the-cheat-mode-of-hooks
 *
 * NOTE: This pattern does disable a few hook optimizations, so use only where necessary
 */
function useStableSignature( func ) {
	const [ , funcWithStableSignature ] = useReducer( func );

	return funcWithStableSignature;
}

export default useStableSignature;
