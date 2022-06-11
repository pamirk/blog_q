import React from 'react';
import Iframe from '../Iframe/Iframe';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './EmailIframe.module.scss';
import ArticlePaywall from '../ArticlePaywall/ArticlePaywall';
import {PAYWALL_HARD} from '../../config/membership';

const cx = classnames.bind(styles);

const EmailIframe = ({
                         maxHeight,
                         html,
                         slug,
                         id,
                         showPaywall,
                         title,
                     }) => {
    // let higher props override maxHeight but provide a sensible default for when there's a paywall
    let maxHeightUsed = maxHeight;
    if (!maxHeight && showPaywall) {
        maxHeightUsed = 1000;
    }
    return (
        <>
            <div className={cx('container', {paywall: showPaywall})}>
                <Iframe
                    maxHeight={maxHeightUsed}
                    srcDoc={html}
                    resize={true}
                    title={title}
                />
            </div>
            {
                slug && slug !== 'quartz-japan' && showPaywall &&
                <ArticlePaywall id={`${slug}-${id}`} paywallType={PAYWALL_HARD}/>
            }
        </>
    );
};

EmailIframe.propTypes = {
    html: PropTypes.string.isRequired,
    id: PropTypes.string,
    maxHeight: PropTypes.number,
    showPaywall: PropTypes.bool.isRequired,
    slug: PropTypes.string,
    title: PropTypes.string.isRequired,
};

export default EmailIframe;
