import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styles from './JobOpening.module.scss';
import Link from '../../../components/Link/Link';
import {stripTags, truncateText, unescapeText,} from '../../../helpers/text';

const JobOpening = ({
                        board_code,
                        description,
                        title,
                        type,
                    }) => {
    const url = `https://quartzmediainc.applytojob.com/apply/${board_code}`;
    const sanitizedDescription = unescapeText(stripTags(description?.replace('</p>', ' ')));
    const truncatedDescription = truncateText(sanitizedDescription, 220);

    return (
        <Fragment>
            <Link to={url} className={styles.title}>{title}</Link>
            <p className={styles.meta}>{`${type}`}</p>
            <p className={styles.description}>
                <span>{`${truncatedDescription}${truncatedDescription.length < sanitizedDescription.length ? '...' : ''}`} </span>
                <Link to={url}>Read more</Link>
            </p>
        </Fragment>
    );
};

JobOpening.propTypes = {
    board_code: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default JobOpening;
