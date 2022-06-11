import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextInput, Select } from '../../../@quartz/interface';
import FormActions from '../../../components/FormActions/FormActions';
import Form from '../../../components/Form/Form';
import useUserProfileFields from '../../../helpers/hooks/useUserProfileFields';
import getLocalization from '../../../helpers/localization';
import usePageVariant from '../../../helpers/hooks/usePageVariant';
import styles from '../Forms.module.scss';

const dictionary = {
	ja: {
		'First name': 'First name（名)',
		Company: 'Company (会社名)',
		Role: 'Role (肩書)',
		Industry: 'Industry (業種)',
		'Job level': 'Job level (役職)',
		Update: '更新する',
		'Board Member or Advisor': '会長職、取締役クラス',
		'C-Level Executive, Partner, or Owner': 'CxOクラス',
		'Self-Employed': '自営業',
		'Senior Management': '役員クラス',
		'Middle Management': '部長クラス',
		'Junior Management': '課長クラス',
		'Senior-Level Staff': '係長・主任クラス',
		'Intermediate-Level Staff': '専門職',
		'Entry-Level Staff': '一般社員クラス',
		'Temporary Employee': '契約社員、派遣社員',
		Student: '学生',
		Retired: '定年',
		Intern: 'インターン',
		'Homemaker or Caretaker': '無職',
		Other: 'その他',
		'Agriculture or Food': '農業、食品',
		'Arts, Architecture, or Design': '芸術、建築、デザイン',
		'Legal or Professional Services': '法律、専門職',
		Education: '教育',
		'Energy, Mining, or Utilities': 'エネルギー、鉱業、公益事業',
		Entertainment: 'エンターテイメント',
		'Fashion or Luxury Goods': 'ファッション、高級品',
		'Finance or Investing': '金融、投資',
		'Consumer Goods, Retail, or Wholesale': '消費財、小売、卸売',
		'Consumer Services': '消費者サービス',
		'Government or Public Sector': '政府、公共サービス',
		'Healthcare or Medical Services': 'ヘルスケア、医療サービス',
		'Industrial or Manufacturing': '工業、製造',
		Insurance: '保険',
		'Auto, Transportation, or Logistics': '自動車、運輸、物流',
		'Media, Communications, or Advertising': 'メディア、マスコミ、広告',
		Nonprofit: '非営利団体',
		'Real Estate or Construction': '不動産、建設',
		'Telecommunications or ISPs': '電気通信事業、ISP',
		'Software or IT Services': 'ソフトウェア、ITサービス',
		'Travel or Hospitality': '旅行、ホスピタリティ',
		None: 'なし',
	},
};

export const CommonProfileFields = ( {
	formState,
	handleFieldChange,
} ) => {
	const { language } = usePageVariant();
	const { industries, jobLevels } = useUserProfileFields( language );
	const localize = getLocalization( { dictionary, language } );

	/**
	 * Prism form components accept vanilla onChange event handlers, but the form
	 * state upstream is a bit more complicated. Map one to the other.
	 */
	function createOnChange ( fieldName ) {
		return function ( evt ) {
			handleFieldChange(
				fieldName,
				{
					...formState[ fieldName ],
					value: evt.target.value,
				} );
		};
	}

	return (
		<Fragment>
			<div className={styles.field}>
				<TextInput
					autoComplete="given-name"
					id="my-account-first-name"
					label={localize( 'First name' )}
					onChange={createOnChange( 'firstName' )}
					placeholder="Enter first name"
					value={formState.firstName.value}
				/>
			</div>
			<div className={styles.field}>
				<TextInput
					autoComplete="organization"
					id="my-account-company"
					label={localize( 'Company' )}
					onChange={createOnChange( 'company' )}
					placeholder="Enter company"
					value={formState.company.value}
				/>
			</div>
			<div className={styles.field}>
				<TextInput
					autoComplete="organization-title"
					id="my-account-role"
					label={localize( 'Role' )}
					onChange={createOnChange( 'title' )}
					placeholder="Enter job role"
					value={formState.title.value}
				/>
			</div>
			<div className={styles.field}>
				<Select
					disabled={!jobLevels.length}
					id="job_level"
					label={localize( 'Job level' )}
					onChange={createOnChange( 'jobLevelId' )}
					options={jobLevels.map( job => ( { value: job.value, label: localize( job.label ) } ) )}
					placeholder="Please select a level"
					value={formState.jobLevelId.value > 0 ? formState.jobLevelId.value : ''}
				/>
			</div>
			<div className={styles.field}>
				<Select
					disabled={!industries.length}
					id="industry"
					label={localize( 'Industry' )}
					onChange={createOnChange( 'industryId' )}
					options={industries.map( industry => ( { value: industry.value, label: localize( industry.label ) } ) )}
					placeholder="Please select an industry"
					value={formState.industryId.value > 0 ? formState.industryId.value : ''}
				/>
			</div>
		</Fragment>
	);
};

CommonProfileFields.propTypes = {
	formState: PropTypes.object.isRequired,
	handleFieldChange: PropTypes.func.isRequired,
};

const ProfileForm = ( {
	formError,
	formState,
	handleFieldChange,
	handleSubmit,
	loading,
} ) => {
	const { language } = usePageVariant();
	const localize = getLocalization( { dictionary, language } );
	return (
		<Form onSubmit={handleSubmit}>
			<fieldset className={styles.fieldGroup}>
				<CommonProfileFields
					formState={formState}
					handleFieldChange={handleFieldChange}
				/>
			</fieldset>
			<FormActions
				error={formError}
				loading={loading}
				submitText={localize( 'Update' )}
			/>
		</Form>
	);
};

ProfileForm.propTypes = {
	formError: PropTypes.string,
	formState: PropTypes.object.isRequired,
	handleFieldChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default ProfileForm;
