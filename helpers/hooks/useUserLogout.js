import useNotifications from './useNotifications';
import useUserApi from './useUserApi';
import { resetSegment } from '../../helpers/tracking/segment';
import trackSegmentSignedOut from '../tracking/segment/trackSignedOut';

export default function useUserLogout() {
	const { notifyError, notifySuccess } = useNotifications();
	const { callApi } = useUserApi();

	return evt => {
		evt.preventDefault();

		return callApi( { endpoint: 'logout' } )
			.then( () => {
				notifySuccess( 'You have been successfully logged out.' );
				trackSegmentSignedOut();
				resetSegment();
			} )
			.catch( () => notifyError( 'An error occurred and you could not be logged out.' ) );
	};
}
