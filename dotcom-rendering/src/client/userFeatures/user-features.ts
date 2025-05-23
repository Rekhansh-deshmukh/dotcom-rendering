/**
 * @file Sets the user subscription and ad free cookies
 * This file was migrated from:
 * https://github.com/guardian/commercial/blob/1a429d6be05657f20df4ca909df7d01a5c3d7402/src/lib/user-features.ts
 */

import { getAuthStatus, isUserLoggedIn } from '../../lib/identity';
import { AD_FREE_USER_COOKIE } from './cookies/adFree';
import { ALLOW_REJECT_ALL_COOKIE } from './cookies/allowRejectAll';
import { createOrRenewCookie } from './cookies/cookieHelpers';
import { HIDE_SUPPORT_MESSAGING_COOKIE } from './cookies/hideSupportMessaging';
import {
	USER_BENEFITS_EXPIRY_COOKIE,
	userBenefitsDataNeedsRefreshing,
} from './cookies/userBenefitsExpiry';
import { syncDataFromUserBenefitsApi } from './userBenefitsApi';

export type UserBenefits = {
	adFree: boolean;
	hideSupportMessaging: boolean;
	allowRejectAll: boolean;
};

const refresh = async (): Promise<void> => {
	if ((await isUserLoggedIn()) && userBenefitsDataNeedsRefreshing()) {
		await requestNewData();
	}
};

const requestNewData = async () => {
	const authStatus = await getAuthStatus();
	if (authStatus.kind !== 'SignedIn') {
		return Promise.reject('The user is not signed in');
	}
	return syncDataFromUserBenefitsApi(authStatus).then(persistResponse);
};

/**
 * Persist the user benefits response to cookies
 *
 * If new cookies are added/removed/edited, update the persistUserBenefitsCookie function in Gateway
 * https://github.com/guardian/gateway/blob/252b2b2f24be826da42c6e7c1b1e202594184023/src/server/lib/user-features.ts#L88
 *
 * In gateway, the cookies are set after authentication.
 *
 * @param {UserBenefits} userBenefitsResponse
 */
const persistResponse = (userBenefitsResponse: UserBenefits) => {
	createOrRenewCookie(USER_BENEFITS_EXPIRY_COOKIE);
	if (userBenefitsResponse.hideSupportMessaging) {
		createOrRenewCookie(HIDE_SUPPORT_MESSAGING_COOKIE);
	}
	if (userBenefitsResponse.allowRejectAll) {
		createOrRenewCookie(ALLOW_REJECT_ALL_COOKIE);
	}
	if (userBenefitsResponse.adFree) {
		createOrRenewCookie(AD_FREE_USER_COOKIE);
	}
};

export { refresh };
