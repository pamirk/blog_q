import { getUserGeoData } from 'helpers/geo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

export default function useCountryCode() {
	const [ countryCode, setCountryCode ] = useState<string>( 'us' );
	const router = useRouter()

	const { locale } = router.query
	const countryCodeOverride =	'japan' === locale ? 'jp' : null;

	// update country code on mount if not in the US ( us is default countryCode in state)
	useEffect( () => {
		const { countryCode: clientSideCountryCode } = getUserGeoData();

		if ( clientSideCountryCode !== countryCode ) {
			setCountryCode( clientSideCountryCode );
		}
	}, [ countryCode ] );

	return { countryCode, countryCodeOverride };
}
