import React from 'react';
import classnames from 'classnames/bind';
import styles from './CareersHeader.module.scss';
// import Photo from '../../components/Photo/Photo';
// import photos from './photos.json';

const cx = classnames.bind( styles );

const CareersHeader = () => (
	<div className={cx( 'header' )}>
		<h1 className={cx( 'title' )}><span className={cx( 'decoration' )}>Jobs</span> at Quartz</h1>
		<p className={cx( 'description' )}>Join our global team of smart, curious, and kind colleagues who have embraced the opportunity to change the way news is consumed on the internet. We have staff on five continents, with headquarters in New York and London.</p>
		{/*{
			photos.map( ( photo, index ) => {
				const { alt, src, title, widths, ratio } = photo;
				return (
					<Photo
						key={index}
						alt={alt}
						src={src}
						title={title}
						widths={widths}
						ratio={ratio}
						className={cx( `photo-${index}` )}
					/>
				);
			} )
		}*/}
	</div>
);

export default CareersHeader;
