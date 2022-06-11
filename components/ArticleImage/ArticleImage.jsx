import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from '../../components/ResponsiveImage/ResponsiveImage';
import styles from './ArticleImage.module.scss';
import classnames from 'classnames/bind';
import Link from '../../components/Link/Link';

const cx = classnames.bind(styles);

export const LinkableImage = ({link, children}) => {
    if (link) {
        return (
            <Link to={link}>
                {children}
            </Link>
        );
    }

    return children;

};

class ArticleImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lazyLoad: true,
        };
    }

    componentDidMount() {
        // don't lazy load the image if the user is printing
        if (
            'function' === typeof window.matchMedia &&
            window.matchMedia('print').matches
        ) {
            this.setState({
                lazyLoad: false,
            });
        }
    }

    render() {
        const {lazyLoad} = this.state;
        const {align, alt, caption, credit, height, link, size, url, width} = this.props;

        // dont assume that ArticleImage will always get a url
        if (!url) {
            return null;
        }

        const sources = {
            small: [
                {
                    breakpoint: 'phone-only',
                    width: 350,
                },
            ],
            medium: [
                {
                    breakpoint: 'phone-only',
                    width: 450,
                },
                {
                    breakpoint: 'tablet-portrait-up',
                    width: 620,
                },
            ],
            large: [
                {
                    breakpoint: 'phone-only',
                    width: 450,
                },
                {
                    breakpoint: 'tablet-portrait-up',
                    width: 620,
                },
                {
                    breakpoint: 'tablet-landscape-up',
                    width: 940,
                },
            ],
            'extra-large': [
                {
                    breakpoint: 'phone-only',
                    width: 450,
                },
                {
                    breakpoint: 'tablet-portrait-up',
                    width: 620,
                },
                {
                    breakpoint: 'desktop-up',
                    width: 1260,
                },
            ],
        };

        return (
            <LinkableImage
                link={link}
            >
                <figure className={cx('container', `align${align}`, size)}>
                    <div className={cx('image')}>
                        <ResponsiveImage
                            src={url}
                            alt={alt}
                            aspectRatio={width / height}
                            sources={sources[size]}
                            lazyLoad={lazyLoad}
                        />
                        {
                            credit &&
                            <div className={cx('credit')}>{credit}</div>
                        }
                    </div>
                    {
                        caption &&
                        <figcaption className={cx('caption')}>{caption}</figcaption>
                    }
                </figure>
            </LinkableImage>
        );
    }

}

LinkableImage.propTypes = {
    children: PropTypes.node,
    link: PropTypes.string,
};

ArticleImage.propTypes = {
    align: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    credit: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    link: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'extra-large']).isRequired,
    url: PropTypes.string,
    width: PropTypes.number.isRequired,
};

ArticleImage.defaultProps = {
    align: '',
    alt: '',
    size: 'medium',
    caption: '',
};

export default ArticleImage;
