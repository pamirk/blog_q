import { useState } from 'react';

function useJCBCardError() {
	const [ cardBrand, setCardBrand ] = useState<string|null>( null );

	// It means "Unfortunately, JCB cards are not currently supported."
	// There's no English translation since US users are permitted to use JCB cards.
	const cardError = cardBrand === 'jcb'
		? '申し訳ございませんが、現在、JCBカードには対応しておりません。' : null;

	// Explains the "CVC" label for Japanese speakers, which Stripe does not translate.
	const cardSubtext = '「CVC」の欄にはクレジットカード裏面記載の3桁のセキュリティーコードをご入力ください。';

	return { cardSubtext, cardError, setCardBrand };
}

export default useJCBCardError;
