import React, { Component, Fragment } from 'react';
import JobDepartment from './JobDepartment/JobDepartment';
import classnames from 'classnames/bind';
import styles from './CareersOpenings.module.scss';
import Link from '../../components/Link/Link';
import { Spinner } from '../../@quartz/interface';

const cx = classnames.bind( styles );

/*
	IMPORTANT:

	- Department names in this list must match exactly their respective names in JazzHR.
	- Jobs belonging to departments not in this list will not be shown.
	- Departments will be displayed in the order they are listed.
*/
const departments = [
	'Business',
	'Corporate',
	'Editorial',
	'Product',
	'Quartz Creative',
];

class CareersOpenings extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			error: null,
			fetching: false,
			openings: {},
		};

		this.fetchData = this.fetchData.bind( this );
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		// Do nothing if already fetching data
		if ( this.state.fetching ) {
			return null;
		}

		// Fetch job listing JSON from our middleware endpoint (api/middlware/data/jobs)
		this.setState( {
			fetching: true,
		}, () => {
			fetch( '/jobs.json' )
				.then( response => {
					if ( !response.ok ) {
						throw Error( response.statusText );
					}
					return response.json();
				} )
				.then( openings => {
					this.setState( {
						openings,
						error: null,
						fetching: false,
					} );
				} )
				.catch( () => {
					this.setState( {
						error: true,
						fetching: false,
					} );
				} );
		} );
	}

	render() {
		const {
			error,
			fetching,
			openings,
		} = this.state;

		return (
			<Fragment>
				<h2 className={cx( 'heading' )}>Current openings</h2>
				{
					fetching &&
					<div className={cx( 'spinner' )}>
						<Spinner />
					</div>
				}
				{
					error &&
					!fetching &&
					<p className={cx( 'error' )}>
						Could not fetch job openings. <button onClick={this.fetchData} className={cx( 'retry' )}>Retry</button> or <Link to="https://quartzmediainc.applytojob.com/">see all listings on JazzHR</Link>.
					</p>
				}
				{
					!error &&
					!fetching &&
					departments.map( department => openings[ department ] &&
						<JobDepartment
							key={department}
							name={department}
							openings={openings[ department ]}
						/>
					)
				}
			</Fragment>
		);
	}
}

export default CareersOpenings;
