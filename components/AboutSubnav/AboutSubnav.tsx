import React from 'react';
import Link from 'next/link';
import styles from './AboutSubnav.module.scss';
import usePageVariant from 'helpers/hooks/usePageVariant';

type propsType = {
    entries: {
        label: string,
        url: string,
    }[],
}
export default function AboutSubnav(props: propsType) {
    const {isInApp} = usePageVariant();
    return (
        <div className={`${styles.container} ${isInApp ? styles.appContainer : ''}`}>
            <ul className={styles.subnavList}>
                {
                    props.entries.map(({label, url}) => (
                        <li key={url}>
                            <div className={styles.subnavItem}>
                            <Link href={url}>{label}</Link>
                                </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}
