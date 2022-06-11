import React from 'react';
import Link from 'components/Link/Link';
import styles from './TOC.module.scss';

function TOC(props: { contents: [{ id: string, link: string, title: string }], isDetails?: boolean }) {
    return (
        <div className={props.isDetails ? styles.slimContainer : styles.container}>
            {!props.isDetails && <h2 className={styles.title}>Browse by topic</h2>}
            <nav className={styles.nav}>
                {
                    Object.keys(props.contents).map(key => (
                        <div className={`${styles.containerTopic} ${!props.isDetails && styles.borderBottom}`}
                             key={key}>
                            <h3 className={styles.topic}>{key}</h3>
                            <ul className={styles.list}>
                                {
                                    props.contents[key].map(({id, link, title}) => (
                                        <li className={styles.brief} key={id}>
                                            <Link className={styles.link} to={link}>
                                                {title}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </nav>
        </div>
    );
}

export default TOC;
