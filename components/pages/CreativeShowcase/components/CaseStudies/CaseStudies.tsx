import React from 'react';
import styles from './CaseStudies.module.scss';
import { Spinner } from '@quartz/interface';
import CaseStudy, { ExpandableCaseStudy } from '../CaseStudy/CaseStudy';
import EmailForm from '../EmailForm/EmailForm';
import PageContent from '../PageContent/PageContent';
import useMenuItems from 'data/hooks/useMenuItems';

function CaseStudyItem ( props: {
	index: number,
	tabName: string,
	project: any,
} ) {
	if ( props.index > 2 ) {
		return <ExpandableCaseStudy {...props.project} tabName={props.tabName} />;
	}

	return <CaseStudy {...props.project} tabName={props.tabName} />;
}

export default function CaseStudies ( props: { caseLimit?: number, tabName: string } ) {
	const caseStudies = useMenuItems( `${props.tabName}_creative`, 50 );

	if ( ! caseStudies ) {
		return (
			<div className={styles.spinner}>
				<Spinner />
			</div>
		);
	}

	return (
		<ul className={styles.container}>
			{
				caseStudies.map( ( project, index ) => {
					if ( props.caseLimit && index >= props.caseLimit ) {
						return;
					}
					return (
						<li key={project.id}>
							<CaseStudyItem index={index} project={project} tabName={props.tabName} />
						</li>
					);
				} )
			}
			{
				'insights' === props.tabName && (
					<PageContent loading={false}>
						<h2>Our newsletter</h2>
						<p>Sign up to receive The Mantle, a monthly email from Quartz Creative made with creative marketers in mind.</p>
						<EmailForm />
					</PageContent>
				)
			}
		</ul>
	);
}
