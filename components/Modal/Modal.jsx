import React from 'react';
import PropTypes from 'prop-types';
import compose from '../../helpers/compose';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { withRouter } from 'next/router';
import classnames from 'classnames/bind';
import styles from './Modal.module.scss';
import { withModal } from '../../helpers/wrappers';
import ModalContent from './ModalContent';
import CloseIcon from '../../svgs/close-x';

const cx = classnames.bind( styles );

class Modal extends React.Component {
	constructor( props ) {
		super( props );

		this.handleClose = this.handleClose.bind( this );
		this.handleKeyPress = this.handleKeyPress.bind( this );
		this.setCloseButtonRef = this.setCloseButtonRef.bind( this );
		this.setScrollContainerRef = this.setScrollContainerRef.bind( this );
	}

	handleClose( e ) {
		// stop propagation because the user could click on the X or anywhere outside the modal content
		// we only need to close it once
		if ( e && typeof e.stopPropagation === 'function' ) {
			e.stopPropagation();
		}

		this.props.hideModal();
	}

	handleKeyPress( e ) {
		const { hideModal } = this.props;
		const key = e.key || e.keyCode;

		if ( 'Escape' === key || 'Esc' === key || key === 27 ) {
			hideModal();
		}
	}

	componentDidMount() {
		const { hideModal, history } = this.props;

		// this.unlistenToRouteChange = history.listen( hideModal );
	}

	componentWillUnmount() {
		// this.unlistenToRouteChange();
	}

	componentDidUpdate( prevProps ) {
		const { currentModal } = this.props;

		if ( prevProps.currentModal !== currentModal ) {

			if ( currentModal ) {
				return this.onModalOpen();
			}

			return this.onModalClose();
		}
	}

	onModalOpen() {
		window.setTimeout( () => this.closeButtonEl.focus(), 1 );

		disableBodyScroll( this.scrollContainerEl );

		document.addEventListener( 'keyup', this.handleKeyPress );
	}

	onModalClose() {
		clearAllBodyScrollLocks();
		document.removeEventListener( 'keyup', this.handleKeyPress );
	}

	setCloseButtonRef( el ) {
		this.closeButtonEl = el;
	}

	setScrollContainerRef( el ) {
		this.scrollContainerEl = el;
	}

	render() {
		const { currentModal, modalContentProps } = this.props;
		const visible = !! currentModal;

		return (
			<div
				aria-hidden={!visible}
				className={cx( 'container', { visible } )}
				role="dialog"
			>
				<div className={cx( 'scroll-container' )} ref={this.setScrollContainerRef}>
					<button
						className={cx( 'close' )}
						onClick={this.handleClose}
						type="button"
						title="Close"
						ref={this.setCloseButtonRef}
					>
						<CloseIcon className={cx( 'close-icon' )} aria-hidden="true" />
						<span>Close</span>
					</button>
					<div className={cx( 'inner' )}>
						<ModalContent
							handleClose={this.handleClose}
							modalContentProps={modalContentProps}
							type={currentModal}
						/>
					</div>
				</div>
			</div>
		);
	}
}

Modal.propTypes = {
	currentModal: PropTypes.string,
	hideModal: PropTypes.func.isRequired,
	history: PropTypes.shape( {
		listen: PropTypes.func.isRequired,
	} ).isRequired,
	modalContentProps: PropTypes.object.isRequired,
};

export default compose(
	withModal,
	withRouter
) ( Modal );
