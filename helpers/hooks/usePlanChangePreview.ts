import { useState, useEffect } from 'react';
import useNotifications from 'helpers/hooks/useNotifications';
import useUserApi from 'helpers/hooks/useUserApi';

interface PlanChangePreview {
	items: Array<{ amount: number }>,
	total: number,
	subtotal: number
}

export default function usePlanChangePreview( newPlanId: number ): PlanChangePreview | null {
	const { notifyError } = useNotifications();
	const { callApi } = useUserApi();

	const [ planChangePreview, setPlanChangePreview ] = useState( null );

	// This should run once on mount.
	useEffect( () => {
		callApi( {
			endpoint: 'invoice_preview',
			method: 'patch',
			body: { newPlanId },
		} )
			.then( data => setPlanChangePreview( data ) )
			.catch( () => notifyError( 'There was an error checking your plan.' ) );
	}, [ callApi, notifyError, newPlanId ] );

	return planChangePreview;
}
