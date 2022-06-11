import { hideModal as hideModalActionCreator, showModal as showModalActionCreator } from 'helpers/wrappers/actions/modal';
import { useDispatch, useSelector } from 'react-redux';

export default function useModal() {
	const dispatch = useDispatch();

	const hideModal = () => dispatch( hideModalActionCreator() );
	const showModal = ( currentModal, modalContentProps ) => dispatch( showModalActionCreator( currentModal, modalContentProps ) );

	const { currentModal, modalContentProps } = useSelector( (state:any) => ( {
		currentModal: state.modal.currentModal,
		modalContentProps: state.modal.modalContentProps,
	} ) );

	return { hideModal, showModal, currentModal, modalContentProps };
}
