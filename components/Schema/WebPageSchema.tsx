import React from 'react';
import { EditionName } from '@quartz/content';
import Schema from './Schema.jsx';
import getMeta, { baseUrl } from 'config/meta';

export default function WebPageSchema ( props: {
	description?: string,
	edition: EditionName,
	location: any,
	name?: string,
} ) {
	const meta = getMeta( props.edition );

	const schemaData = {
		'@type': 'WebPage',
		name: props.name || meta.title,
		description: props.description || meta.description,
		url: `${baseUrl}${props.location.pathname}`,
	};

	return <Schema data={schemaData} />;
}
