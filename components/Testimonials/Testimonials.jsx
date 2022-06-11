import React from 'react';
import styles from './Testimonials.module.scss';
import { Blockquote } from '../../@quartz/interface';

function Testimonials() {
	return (
		<>
			<div className={styles.title}>What members are saying:</div>
			<div className={styles.testimonialContainer}>
				<Blockquote>The subscription to Quartz was probably my best investment of 2019. Your journalism is one of a kind, local on a global scale, actual and never boring.</Blockquote>
				<p className={styles.signature}>— Davide M., Director of Product Development</p>
			</div>
			<div className={styles.testimonialContainer}>
				<Blockquote>In my work, I have to expose all sides of an argument—it’s nice to have a curated experience that solves for that.</Blockquote>
				<p className={styles.signature}>— Gastao D., Senior Director, Strategy & Field Operations Excellence</p>
			</div>
		</>
	);
}

export default Testimonials;
