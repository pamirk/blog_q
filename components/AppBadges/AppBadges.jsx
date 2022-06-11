import React from 'react';
import appConfig from '../../config/apps';
import classnames from 'classnames/bind';
import ImageLoader from '../Image/Image';
import Link from '../Link/Link';
import styles from './AppBadges.module.scss';
import trackSegmentAppDownloadLinkClicked from '../../helpers/tracking/segment/trackAppDownloadLinkClicked';

const {appStoreId, name} = appConfig;
const cx = classnames.bind(styles);
const appStoreIcon = 'https://cms.qz.com/wp-content/uploads/2019/11/apple-badge-app-store.png';
const appStoreLink = `https://itunes.apple.com/us/app/id${appStoreId}?mt=8`;

let index = () => (
    <div className={cx('container')}>
        <Link to={appStoreLink} onClick={trackSegmentAppDownloadLinkClicked} title={`${name} app for iOS`}
              className={cx('badge')}>
            <ImageLoader
                src={appStoreIcon}
                alt="Download on the App Store"
                width={128}
                height={45}
            />
        </Link>
    </div>
);
export default index