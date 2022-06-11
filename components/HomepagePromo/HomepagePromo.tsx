import React, {useEffect} from 'react';
import {CalloutCard} from '@quartz/interface';
import ContentBlocks from 'components/ContentBlocks/ContentBlocks';
import EmailSignup from 'components/EmailSignup/EmailSignup';
import usePromotionsByTag from 'data/hooks/usePromotionsByTag';
import {oneYearInMilliseconds} from 'helpers/dates';
import useLocalStorageState from 'helpers/hooks/useLocalStorageState';
import useUserRole from 'helpers/hooks/useUserRole';
import CloseIcon from 'svgs/close-x';
import styles from './HomepagePromo.module.scss';
import Video from 'components/Video/Video';

export default function HomepagePromo() {
    const {isMember} = useUserRole();
    const promotions = usePromotionsByTag('homepage-promo', 1);
    const [dismissed, setDismissed] = useLocalStorageState('homepage-mbb-promo', isMember);

    // 🐰🥚
    useEffect(() => {
        function listener(evt: KeyboardEvent) {
            // Capital Q triggers restores the promo even if it has been dismissed.
            if ('Q' !== evt.key) {
                return;
            }
            setDismissed(false);
        }

        document.addEventListener('keydown', listener);

        return () => document.removeEventListener('keydown', listener);
    }, [setDismissed]);

    if (1 !== promotions?.length) {
        return null;
    }

    if (dismissed) {
        return null;
    }

    return (
        <>
            <CalloutCard>
                <div className={styles.container}>
                    <h2 className={styles.mission}>Support journalism with a mission.</h2>
                    <button
                        className={styles.close}
                        onClick={() => setDismissed(true, oneYearInMilliseconds)}
                        type="button"
                        title="Close"
                    >
                        <CloseIcon aria-hidden="true" className={styles.closeIcon}/>
                        <span>Close</span>
                    </button>
                    <Video
                        src="https://cms.qz.com/wp-content/uploads/2021/03/MBB-Final-360-1.mp4"
                        autoplay={true}
                    />
                    <div className={styles.blocks}>
                        <ContentBlocks blocks={promotions[0]?.blocks}/>
                    </div>
                    <hr className={styles.hr}/>
                    <EmailSignup slugs={['daily-brief']} title="Get the Quartz Daily Brief in your inbox each morning."
                                 location="home"/>
                </div>
            </CalloutCard>
            <hr/>
        </>
    );
}
