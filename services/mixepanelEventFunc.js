var Mixpanel = require("mixpanel");
const { MixpanelToken } = process.env;
var mixpanelClient = Mixpanel.init(MixpanelToken);

const { DEV_BACKEND_URL } = process.env;

const createMixpanelEvent = async (eventName, userData) => {
	try {
		if (!eventName || !userData) {
			return;
		}
	
		mixpanelClient.track(eventName, {
			distinct_id: userData.id,
			HostURL: DEV_BACKEND_URL ?? null,
			$email: userData.email,
			...(userData?.href ? { 'user visit': userData?.href } : {})
		});
		mixpanelClient.people.set(userData.id, {
			name: `${userData?.firstName ?? ''} ${userData?.lastName ?? ''}`,
			$email: userData?.email ?? null,
			plan: userData?.plan ?? null,
			registerFrom: userData?.registerFrom,
		});
	} catch (e) {
        console.log(e)
		throw e;
	}
};
module.exports = {
	createMixpanelEvent,
};