import React, {useRef} from 'react';
import {useRouter} from 'next/router';
import {ButtonLabel} from '@quartz/interface';
import FormHeader from 'components/Forms/FormHeader/FormHeader';
import GiftForm from 'components/Forms/GiftForm/GiftForm';
import Link from 'components/Link/Link';
import Page from 'components/Page/Page';
import styles from './Gift.module.scss';

const pageDescription = 'Quartz membership is an exclusive guide to the forces that are reshaping our world. Gift it to your friends, family, or colleagues.';
const socialImage = 'https://cms.qz.com/wp-content/uploads/2019/06/social_gift.jpg?w=800';

export default function Gift() {
    const {success} = useRouter().query;
    const paymentRequestRef = useRef();

    if (success) {
        return (
            <Page
                canonicalPath="/gift/success/"
                pageDescription={pageDescription}
                pageTitle="Thanks for giving the gift of Quartz"
                pageType="gift"
                socialImage={socialImage}
            >
                <div className={styles.container}>
                    <FormHeader
                        title="Thanks!"
                        description={
                            <>
                                <p>Your gift of membership has been sent to your recipient. You’ll shortly receive
                                    confirmation of your purchase via email.</p>
                                <p>Thank you for giving the gift of Quartz!</p>
                            </>
                        }
                    />
                    <div className={styles.another}>
                        <Link to="/gift/">
                            <ButtonLabel>Buy another gift</ButtonLabel>
                        </Link>
                    </div>
                    <div className={styles.home}>
                        <Link to="/" cypressData="take-me-home">
                            <ButtonLabel variant="secondary">Take me home</ButtonLabel>
                        </Link>
                    </div>
                    <p>Didn’t receive a confirmation email? Contact us at <Link
                        to="mailto:support@qz.com">support@qz.com</Link>.</p>
                </div>
            </Page>
        );
    }

    return (
        <Page
            canonicalPath="/gift/"
            pageDescription={pageDescription}
            pageTitle="Give the gift of Quartz"
            pageType="gift"
            socialImage={socialImage}
        >
            <GiftForm
                paymentRequestRef={paymentRequestRef}
            />
        </Page>
    );
}
