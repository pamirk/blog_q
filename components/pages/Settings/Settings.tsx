// noinspection JSNonASCIINames

import React from 'react';
import { useRouter } from 'next/router';
import ChatMessenger from 'components/ChatMessenger/ChatMessenger';
import Modal from 'components/Modal/Modal';
import Page from 'components/Page/Page';
import SettingsForm from 'components/SettingsForm/SettingsForm';
import usePageVariant from 'helpers/hooks/usePageVariant';
import getLocalization from 'helpers/localization';

// noinspection NonAsciiCharacters
const dictionary = {
	ja: {
		'Membership & Billing': '購読管理',
		Profile: 'プロフィール',
		Security: 'アカウント',
		Settings: 'アカウント設定',
		'Sign out of your Quartz account': 'Quartz からサインアウトする',
		'We’re sorry to see you go. If you’d like to delete your account click OK.': 'OKをクリックするとアカウント削除が完了します。',
	},
};

const tabs = [
	{
		label: 'Profile',
		slug: 'profile',
	},
	{
		label: 'Security',
		slug: 'security',
	},
	{
		label: 'Membership & Billing',
		slug: 'membership',
	},
];

export default function Settings () {
	const { pathname } = useRouter();
	const { language } = usePageVariant();
	const { locale, tab } = useRouter().query;
	const localize = getLocalization( { dictionary, language } );
	const { label } = tabs.find( ( { slug } ) => slug === tab ) || tabs[0];

	return (
		<Page
			canonicalPath={pathname}
			pageDescription="Edit your personal details, billing information and more."
			pageTitle={`${label} — Settings`}
			pageType="settings"
			socialTitle="Your Quartz account"
		>
			<ChatMessenger />
			<Modal />
			<SettingsForm
				activeTab={tab}
				locale={locale}
				localize={localize}
				tabs={tabs}
			/>
		</Page>
	);
}
