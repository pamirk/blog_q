import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { addNotification } from '../../helpers/wrappers/actions/notifications';

function useNotifications() {
	const dispatch = useDispatch();
	return {
		notifyError: useCallback( ( message, timeVisible ) => dispatch( addNotification( 'error', { message, timeVisible } ) ), [ dispatch ] ),
		notifySuccess: useCallback( ( message, timeVisible ) => dispatch( addNotification( 'success', { message, timeVisible } ) ), [ dispatch ] ),
		notifyWarning: useCallback( ( message, timeVisible ) => dispatch( addNotification( 'warning', { message, timeVisible } ) ), [ dispatch ] ),
	};
}

export default useNotifications;
