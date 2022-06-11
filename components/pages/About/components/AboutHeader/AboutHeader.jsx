import React, { Fragment } from 'react';
import ProductsSection from '../../../../pages/About/components/AboutHeader/ProductsSection/ProductsSection';
import styles from './AboutHeader.module.scss';

const AboutHeader = () => (
	<Fragment>
		<div className={styles.content}>
			<div>
				<p>
					We believe companies should solve real problems without creating new ones. The global economy must be as inclusive as it is innovative, balance financial incentives with the needs of our planet, and elevate leaders who act with integrity, empathy, and foresight.
				</p>
				<p>
					Quartz was founded in 2012 to be the greatest ally and resource for purpose-driven professionals in search of these new approaches to business. Our journalists around the world produce smart and insightful analysis of the global economy. We help our readers discover new industries, new markets, and new ways of doing business that are more sustainable, innovative, and inclusive.
				</p>
				<p>
					Business leaders choose Quartz because our work, both the journalism and how we present it, stands in contrast to the usual voices in business media:
				</p>
			</div>
			<div>
				<ul>
					<li>We offer a global worldview.</li>
					<li>We focus on the intersection of important and interesting.</li>
					<li>We are progressive and evidence-based.</li>
					<li>We propose solutions to big problems.</li>
					<li>We build delightful and easy-to-use editorial products.</li>
				</ul>
				<p>
					Quartz readers are the next generation of business leaders. They are global citizens, crave purpose in their work, and care deeply about the impact of their companies on broader society.
				</p>
				<p>
					Quartz’s journalism helps these leaders extract knowledge from news, focus on important economic shifts, and take action on their convictions. We produce our journalism across a range of platforms, with a particular focus on design, user experience, and new forms of storytelling.
				</p>
			</div>
		</div>
		<ProductsSection />
	</Fragment>
);

export default AboutHeader;
