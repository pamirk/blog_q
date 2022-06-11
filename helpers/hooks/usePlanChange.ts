import useUserSettings from './useUserSettings';
import useUserApi from './useUserApi';
import useNotifications from './useNotifications';
import {PLAN_ID, SUBSCRIPTION_ID} from 'helpers/types/account';
import React, {useState} from 'react';

export default function usePlanChange() {
    const {getUserSetting} = useUserSettings();
    const {loading, callApi} = useUserApi();
    const {notifyError} = useNotifications();
    const [error, setError] = useState<React.ReactNode>(null);

    async function updatePlan(planId: string): Promise<void> {
        const subscriptionId = getUserSetting(SUBSCRIPTION_ID);
        const currentPlanId = getUserSetting(PLAN_ID);

        if (`${currentPlanId}` === planId) {
            return;
        }

        setError(null);

        return callApi({
            endpoint: 'subscription',
            method: 'patch',
            body: {id: subscriptionId, data: {planId: parseInt(planId, 10)}},
        })
            .catch((message: React.ReactNode) => {
                setError(message);
                notifyError('Your plan could not be changed.');
            });
    }

    return {updatePlan, loading, error};
}
