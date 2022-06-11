import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from '../../components/ResponsiveImage/ResponsiveImage';
import classnames from 'classnames/bind';
import styles from './ArticleHeroGlobal.module.scss';

const cx = classnames.bind(styles);

/**
 * Determines the sources to use based on the type of image
 *
 * @param  {String}  size
 * @return {Array}
 */
const getSources = size => {

    // these get used on portrait, large, and extra-large sizes
    const sharedBreakpoints = [
        {
            breakpoint: 'phone-only',
            width: 410,
        },
        {
            breakpoint: 'phone-large-up',
            width: 690,
        },
        {
            breakpoint: 'tablet-portrait-up',
            width: 950,
        },
    ];

    if ('portrait' === size) {
        return [
            ...sharedBreakpoints,
            {
                breakpoint: 'tablet-landscape-up',
                width: 550,
            },
        ];
    }

    return [
        ...sharedBreakpoints,
        {
            breakpoint: 'tablet-landscape-up',
            width: 'extra-large' === size ? 1600 : 1100,
        },
    ];
};

/**
 * Determines the aspect ratio for based on the type of image were trying to display
 *
 * @param  {String}  size
 * @param  {Int}     width
 * @param  {Int}     height
 * @return {Float}
 */
const getAspectRatio = (size, width, height) => 'portrait' === size ? 5 / 6 : width / height;

const ArticleHeroBase = ({
                             sourceUrl,
                             title,
                             altText,
                             caption,
                             credit,
                             preload,
                             size,
                             mediaDetails: {
                                 width,
                                 height,
                             },
                             isPremium,
                         }) => (
    <figure className={cx('container', size, {premium: isPremium})}>
        <div className={cx('image-container')}>
            <ResponsiveImage
                src={sourceUrl}
                title={title}
                alt={altText}
                sources={getSources(size)}
                aspectRatio={getAspectRatio(size, width, height)}
                crop={('portrait' === size)}
                preload={preload}
            />
            {
                credit &&
                <div className={cx('credit')}>{credit}</div>
            }
        </div>
        {
            caption &&
            <figcaption className={cx('caption', size, {premium: isPremium})}>{caption}</figcaption>
        }
    </figure>
);

ArticleHeroBase.propTypes = {
    altText: PropTypes.string,
    caption: PropTypes.string,
    credit: PropTypes.string,
    isPremium: PropTypes.bool.isRequired,
    mediaDetails: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }).isRequired,
    preload: PropTypes.bool,
    size: PropTypes.string,
    sourceUrl: PropTypes.string,
    title: PropTypes.string,
};

ArticleHeroBase.defaultProps = {
    isPremium: false,
};

export default ArticleHeroBase;
