import { DependencyList, EffectCallback, useEffect, useRef } from 'react';
import deepEqual from 'deep-equal';

/**
 * Similar to useEffect but does a deep value compare on object dependencies to
 * ensure the hook won’t re-run for value equivalent objects.
 * Only use with non-primitive dependencies.
 * Stolen from https://github.com/streamich/react-use/blob/master/src/useDeepCompareEffect.ts
 */
export default function useDeepCompareEffect<TDeps extends DependencyList>(
	effect: EffectCallback,
	deps: TDeps
) {
	const ref = useRef<TDeps | undefined>();

	if ( !ref.current || !deepEqual( deps, ref.current ) ) {
		ref.current = deps;
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect( effect, ref.current );
}
