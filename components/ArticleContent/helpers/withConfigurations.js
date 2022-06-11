import React from 'react';
import PropTypes from 'prop-types';
import { articlePropTypes } from '../../../helpers/propTypes';

/**
 * Wrapper specific for `ArticleContent` to configure footnotes
 */
const withConfigurations = WrappedComponent => {
	class ConfiguredContent extends React.Component {
		constructor( props ) {
			super( props );

			this.contentRef = null;
			this.footnotesRefs = {};

			this.state = {
				footnotes: [], // keeps track of showing/hiding footnotes; dynamically filled in `configureFootnotes` when mounting
			};

			this.configureFootnotes = this.configureFootnotes.bind( this );
			this.setContentRef = this.setContentRef.bind( this );
			this.setFootnoteRef = this.setFootnoteRef.bind( this );
		}

		componentDidUpdate( prevProps ) {
			if ( prevProps.article.postId !== this.props.article.postId ) {
				this.configureFootnotes();
			}
		}

		componentDidMount() {
			this.configureFootnotes();
		}

		setContentRef( el ) {
			this.contentRef = el;
		}

		setFootnoteRef( idx ) {
			return el => this.footnotesRefs[`footnote_${idx + 1}`] = el;
		}

		configureFootnotes() {
			/*
				- select all footnote anchor tags in the DOM
				- this has to be inside ArticleContent after mounting, because they
				have to be dangerously set with their respective parent `P` blocks
			*/
			const footnoteEls = this.contentRef.querySelectorAll( '.footnote' );

			const footnotesState = Array.prototype.map.call( footnoteEls, el => {
				const number = el.getAttribute( 'data-number' );

				// attach click handler to toggle show footnote
				el.addEventListener( 'click', ( e ) => {
					e.preventDefault();

					const { footnotes } = this.state;
					const newState = [ ...footnotes ];

					newState[number - 1] = !footnotes[number - 1];
					this.setState( { footnotes: newState } );
				} );

				return false;
			} );

			this.setState( { footnotes: footnotesState } );
		}

		render() {
			return (
				<WrappedComponent
					footnoteTracker={this.state.footnotes}
					setContentRef={this.setContentRef}
					setFootnoteRef={this.setFootnoteRef}
					{...this.props}
				/>
			);
		}
	}

	ConfiguredContent.propTypes = {
		article: PropTypes.shape( articlePropTypes ).isRequired,
	};

	return ConfiguredContent;
};

export default withConfigurations;
