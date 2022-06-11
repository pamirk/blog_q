import React from 'react';
import Link from '../../components/Link/Link';
import Image from '../../components/Image/Image';
import classnames from 'classnames/bind';
import styles from './CareersAbout.module.scss';

const cx = classnames.bind( styles );

const CareersAbout = () => (
	<div className={cx( 'container' )}>
		<h4 className={cx( 'title' )}>Learn more <Link to="/about/">about Quartz</Link></h4>
		<ul className={cx( 'list' )}>
			<li className={cx( 'item' )}>
				<Link to="/about/#values">
					<Image
						alt="Quartz editorial staff at the Gerald Loeb Awards in 2019"
						className={cx( 'photo' )}
						src="https://cms.qz.com/wp-content/uploads/2020/02/IMG_4875.jpg?quality=80&strip=all"
						width={460}
						height={347}
					/>
					<h5 className={cx( 'item-title' )}>Our Values</h5>
					<p className={cx( 'item-description' )}>We believe in boldness and creativity, taking ownership, users first and a more global world.</p>
				</Link>
			</li>
			<li className={cx( 'item' )}>
				<Link to="/about/#culture">
					<Image
						alt="Team meeting in town hall"
						className={cx( 'photo' )}
						src="https://cms.qz.com/wp-content/uploads/2020/02/20190912_160503.jpg?quality=80&strip=all"
						width={460}
						height={347}
					/>
					<h5 className={cx( 'item-title' )}>Our Culture</h5>
					<p className={cx( 'item-description' )}>Quartz is defined, more than anything, by the people who work here. We’re all different, but share a common affinity for that #qzlife.</p>
				</Link>
			</li>
			<li className={cx( 'item' )}>
				<Link to="/about/#staff">
					<Image
						alt="Our staff poses on the rooftop"
						className={cx( 'photo' )}
						src="https://cms.qz.com/wp-content/uploads/2020/02/Artboard.jpg?quality=80&strip=all"
						width={460}
						height={347}
					/>
					<h5 className={cx( 'item-title' )}>Our Staff</h5>
					<p className={cx( 'item-description' )}>We`re a nerdy and creative bunch, who embrace the opportunity to change the way news is consumed on the internet.</p>
				</Link>
			</li>
		</ul>
	</div>
);

export default CareersAbout;
