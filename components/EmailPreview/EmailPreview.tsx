import React, { useEffect, useState } from 'react';
import { Spinner } from '@quartz/interface';
import styles from './EmailPreview.module.scss';

const EmailPreview = ( props: {
	html: string,
} ) => {
	const [ content, setContent ]  = useState<string | null>( null );
	const [ emailStyles, setStyles ] = useState<string | null>( null );
	useEffect( () => {
		const parsedHTML = new DOMParser().parseFromString( props.html, 'text/html' );
		const parsedStyles = parsedHTML.head.getElementsByTagName( 'style' )[0].innerHTML;
		setContent( parsedHTML.body.innerHTML );
		setStyles( `.${parsedStyles}` );
	}, [ props.html ] );
	return (
		<div className={styles.container}>
			{!! content ?
				<>
					<style type="text/css">{emailStyles}</style>
					<div className="body" dangerouslySetInnerHTML={{ __html: content }} />
				</> :
				<div className={styles.placeholder}>
					<Spinner />
				</div>
			}
		</div>
	);
};

export default EmailPreview;
