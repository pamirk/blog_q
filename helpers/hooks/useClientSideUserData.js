import { mapStateToData } from '../wrappers/withClientSideUserData';
import { useSelector } from 'react-redux';

function useClientSideUserData() {
	return useSelector( mapStateToData );
}

export default useClientSideUserData;
