import React from 'react';
import PropTypes from 'prop-types';
import { articleTeaserPropTypes, bulletinTeaserPropTypes } from '../../helpers/propTypes';
import styles from './List.module.scss';
import classnames from 'classnames/bind';
import { useInView } from '../../helpers/hooks';
import { ArticleStrip } from '../../@quartz/interface';
import Link from '../../components/Link/Link';
import usePageVariant from '../../helpers/hooks/usePageVariant';

const cx = classnames.bind( styles );

export const ListItem = ( {
	element: {
		bulletin,
		dateGmt,
		edition,
		featuredImage,
		guide,
		kicker,
		link,
		series,
		title,
	},
	initialVisibility,
	isAmp,
	isSearch,
} ) => {
	const [ ref, visible ] = useInView( { initialVisibility, rootMargin: '100px' } );

	return (
		<li ref={ref} className={cx( 'item', { visible } )}>
			<Link to={link} className={styles.link}>
				<ArticleStrip
					amp={isAmp}
					dateGmt={dateGmt}
					edition={edition?.name}
					kicker={( isSearch ? guide?.name || series?.name || kicker : kicker )}
					size="extra-large"
					sponsor={bulletin?.sponsor?.name}
					thumbnailUrl={featuredImage?.sourceUrl}
					title={title}
				/>
			</Link>
		</li>
	);
};

ListItem.propTypes = {
	element: PropTypes.object.isRequired,
	initialVisibility: PropTypes.bool.isRequired,
	isAmp: PropTypes.bool.isRequired,
	isSearch: PropTypes.bool,
};

ListItem.defaultProps = {
	initialVisibility: false,
	isAmp: false,
	isSearch: false,
};

export const List = ( {
	collection,
	constrain,
} ) => {
	const { isAmp } = usePageVariant();

	return (
		<div className={cx( 'container', { constrain } )}>
			<ul className={cx( 'items' )}>
				{
					collection?.map( ( element, index ) => (
						<ListItem
							isAmp={isAmp}
							key={element.id}
							initialVisibility={index < 5}
							element={element}
						/>
					) )
				}
			</ul>
		</div>
	);
};

List.propTypes = {
	collection: PropTypes.arrayOf(
		PropTypes.oneOfType( [
			PropTypes.shape( articleTeaserPropTypes ),
			PropTypes.shape( bulletinTeaserPropTypes ),
		] )
	).isRequired,
	constrain: PropTypes.bool.isRequired,
};

List.defaultProps = {
	constrain: true,
};

export default List;
