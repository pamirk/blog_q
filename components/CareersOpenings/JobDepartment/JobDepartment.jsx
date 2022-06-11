import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './JobDepartment.module.scss';
import JobOpening from '../JobOpening/JobOpening';

const cx = classnames.bind( styles );

const JobDepartment = ( { name, openings } ) => {
	const [ expanded, setExpanded ] = useState( false );

	return (
		<div className={cx( 'container', { expanded } )}>
			<h3 className={cx( 'group-title' )}>{name}</h3>
			<button
				className={cx( 'group-toggle-mobile' )}
				onClick={() => setExpanded( !expanded )}
				type="button"
			>
				<h3 className={cx( 'group-title-mobile' )}>{name}</h3>
			</button>
			<ul className={cx( 'openings' )}>
				{
					openings.map( opening => (
						<li className={cx( 'opening' )} key={opening.id}>
							<JobOpening {...opening} />
						</li>
					) )
				}
			</ul>
		</div>
	);
};

JobDepartment.propTypes = {
	name: PropTypes.string.isRequired,
	openings: PropTypes.array.isRequired,
};

export default JobDepartment;
