import React from 'react';
import PropTypes from 'prop-types';
import styles from './ArticleFootnote.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

export class ArticleFootnote extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			height: 0,
		};
	}

	componentDidMount() {
		const { block } = this.props;

		const footnote = document.getElementsByClassName( cx( 'container' ) )[block.footnoteIndex];
		const height = footnote ? footnote.scrollHeight : 0;

		this.setState( { height } );
	}

	render() {
		const { block, setRef, show } = this.props;
		const { height } = this.state;

		const style = {
			maxHeight: show ? `${height}px` : '0px',
		};

		return (
			<div className={cx( 'container' )} style={style}>
				<div className={cx( 'note', { show } )} ref={setRef( block.footnoteIndex )}>
					<h5 className={cx( 'number' )}>{block.footnoteIndex + 1}</h5>
					<div
						className={cx( 'text' )}
						dangerouslySetInnerHTML={{ __html: block.footnote }}
					/>
				</div>
			</div>
		);
	}
}

ArticleFootnote.propTypes = {
	block: PropTypes.shape( {
		footnote: PropTypes.string.isRequired,
		footnoteIndex: PropTypes.number.isRequired,
	} ),
	setRef: PropTypes.func,
	show: PropTypes.bool.isRequired,
};

ArticleFootnote.defaultProps = {
	show: false,
};

export default ArticleFootnote;
