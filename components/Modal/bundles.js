import Loadable from 'react-loadable';

export const BillingModal = Loadable( {
	loader: () => import( /* webpackChunkName: "BillingModal" */ '../Forms/BillingForm/BillingForm' ),
	loading: () => null,
} );

export const ChangeEmailForm = Loadable( {
	loader: () => import( /* webpackChunkName: "ChangeEmailForm" */ '../Forms/ChangeEmailForm/ChangeEmailForm' ),
	loading: () => null,
} );

export const ChangePasswordForm = Loadable( {
	loader: () => import( /* webpackChunkName: "ChangePasswordForm" */ '../Forms/ChangePasswordForm/ChangePasswordForm' ),
	loading: () => null,
} );

export const ChangePlanForm = Loadable( {
	loader: () => import( /* webpackChunkName: "ChangePlanForm" */ '../Forms/ChangePlanForm/ChangePlanForm' ),
	loading: () => null,
} );

export const MembershipCancelationForm = Loadable( {
	loader: () => import( /* webpackChunkName: "MembershipCancelationForm" */ '../Forms/MembershipCancelationForm/MembershipCancelationForm' ),
	loading: () => null,
} );
