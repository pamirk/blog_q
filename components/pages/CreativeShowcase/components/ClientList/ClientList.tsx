import React from 'react';
import styles from './ClientList.module.scss';
import ResponsiveImage from 'components/ResponsiveImage/ResponsiveImage';
import useMenuItems from 'data/hooks/useMenuItems';

const logoImageSizes = [
	{
		breakpoint: 'phone-only',
		width: 120,
	},
	{
		breakpoint: 'tablet-portrait-up',
		width: 146,
	},
];

function LogoImage ( props: {
	alt: string,
	src: string,
} ) {
	return (
		<ResponsiveImage
			alt={props.alt}
			aspectRatio={21 / 9}
			className={styles.logo}
			src={props.src}
			sources={logoImageSizes}
		/>
	);
}

export default function ClientList () {
	const clients = useMenuItems( 'clients_creative', 50 );

	if ( ! clients ) {
		return null;
	}

	return (
		<ul className={styles.container}>
			{
				clients.map( client => {
					const { featuredImage, id, title } = client;

					if ( ! featuredImage?.sourceUrl ) {
						return null;
					}

					return (
						<li key={id} className={styles.client}>
							<LogoImage alt={title || ''} src={featuredImage.sourceUrl} />
						</li>
					);
				} )
			}
		</ul>
	);
}
