import {
	init,

	renderChat,

	setAuth,

	setChannelUrl,
	SdkEventEmitter,
	ESdkControlsEvents,

	getConfig,
	updateConfig,
} from '@vklive/sdk';
import '@vklive/sdk/style.css';

let i = 0;
const Log = (text, data) => {
	const item = document.createElement('div');
	(item || {}).innerText = `${i++}: ${text} ${typeof data !== 'undefined' ? JSON.stringify(data) : ''}`;
	const container = document.querySelector('#events');
	container?.appendChild(item);
	container?.scrollTo(0, container.scrollHeight);
};

const authFromStorage = window.localStorage.getItem('auth');

if (authFromStorage) {
	const parsedAuthData = JSON.parse(authFromStorage);

	document.querySelector('#input-auth-access-token').value = parsedAuthData.accessToken || document.querySelector('#input-auth-access-token').value;
	document.querySelector('#input-auth-refresh-token').value = parsedAuthData.refreshToken || document.querySelector('#input-auth-refresh-token').value;
	document.querySelector('#input-auth-expired-at').value = parsedAuthData.expiredAt || document.querySelector('#input-auth-expired-at').value;
	document.querySelector('#input-auth-x-app').value = parsedAuthData.appId || document.querySelector('#input-auth-x-app').value;
}

SdkEventEmitter.addListener(ESdkControlsEvents.CHANNEL_URL_UPDATE, (data) => {
	Log('Переход на канал: ', data);

	document.querySelector('#input-stream-url').value = data;
});

(document.querySelector('#input-stream-url') || {}).value = document.location.hash.slice(1) || 'romasan';

console.log('====', getConfig());
updateConfig({
	hosts: {
		api: 'https://apisdk.founder-tv-alpha.my.cloud.devmail.ru/',
		sdk: 'https://apisdk.founder-tv-alpha.my.cloud.devmail.ru/',
	},
});

init({
	xSdkApp: 'test_app_qwerty',
	channelUrl: document.querySelector('#input-stream-url')?.value,
	onAuthorize: () => {
		Log('Нажата кнопка авторизации')
	},
	onTokenRefreshError: (error) => {
		Log('Ошибка обновления токена ', error)
	}
});

renderChat('#vklive-chat', {
	// withTabs: false,
    // withFooter: false,
});

document.querySelector('#button-stream-url')?.addEventListener('click', () => {
	const value = document.querySelector('#input-stream-url').value;

	setChannelUrl(value);
});

document.querySelector('#button-auth')?.addEventListener('click', () => {
	const accessToken = document.querySelector('#input-auth-access-token').value;
	const refreshToken = document.querySelector('#input-auth-refresh-token').value;
	const expiredAt = document.querySelector('#input-auth-expired-at').value;
	const appId = document.querySelector('#input-auth-x-app').value;

	window.localStorage.setItem('auth', JSON.stringify({
		accessToken,
		refreshToken,
		expiredAt,
		appId,
	}))

	setAuth({
		accessToken,
		refreshToken,
		expiredAt,
		appId,
	});
});

// controls

document.querySelector('#button-play-video')?.addEventListener('click', () => {
	SdkEventEmitter.emit(ESdkControlsEvents.PLAY_VIDEO);
});

document.querySelector('#button-pause-video')?.addEventListener('click', () => {
	SdkEventEmitter.emit(ESdkControlsEvents.PAUSE_VIDEO, { timeCode: 123 });
});

document.querySelector('#button-like')?.addEventListener('click', () => {
	SdkEventEmitter.emit(ESdkControlsEvents.LIKE);
});

document.querySelector('#button-seek-video')?.addEventListener('click', () => {
	SdkEventEmitter.emit(ESdkControlsEvents.SEEK_VIDEO, { timeCode: 123 });
});

// events

const events = {
	likes: 'Количество лайков',
	viewers: 'Количество зрителей',
	subscribers: 'Количество подписчиков',
	info: 'Изменились ник автора и описание стрима',
	title: 'Изменился заголовок',
	category: 'Изменилась категория стрима',
	date: 'Изменилось время последнего стрима',
	start: 'Стрим начался',
	end: 'Закончился стрим',
	authorize: 'Статус авторизации',
};

SdkEventEmitter.addListener(ESdkControlsEvents.LIKES_COUNT, (counter) => {
	Log(`${events.likes}: `, counter);
	(document.querySelector('#stream-likes') || {}).innerText = counter;
});

SdkEventEmitter.addListener(ESdkControlsEvents.VIEWERS_COUNT, (counter) => {
	Log(`${events.viewers}: `, counter);
	(document.querySelector('#stream-online') || {}).innerText = counter;
});

SdkEventEmitter.addListener(ESdkControlsEvents.STREAM_TITLE_UPDATE, (payload) => {
	Log(`${events.title}: `, payload.title);
	(document.querySelector('#stream-title') || {}).innerText = payload;
});

SdkEventEmitter.addListener(ESdkControlsEvents.STREAM_CATEGORY_UPDATE, (payload) => {
	Log(`${events.category}: `, `${payload.title} - ${payload.id}`);
	(document.querySelector('#stream-category') || {}).innerText = payload.title;
});

SdkEventEmitter.addListener(ESdkControlsEvents.STREAM_SUBSCRIBERS_UPDATE, (payload) => {
	Log(`${events.subscribers}: `, payload);
	(document.querySelector('#stream-subscribers') || {}).innerText = payload;
});

SdkEventEmitter.addListener(ESdkControlsEvents.STREAM_INFO_UPDATE, (payload) => {
	Log(`${events.info}: `, `${payload.nickname}; ${payload.description}`);
	(document.querySelector('#stream-nickname') || {}).innerText = payload.nickname;
	(document.querySelector('#stream-description') || {}).innerText = payload.description;
	(document.querySelector('#stream-avatar') || {}).src = payload.avatar;
});

SdkEventEmitter.addListener(ESdkControlsEvents.STREAM_DATE_UPDATE, (payload) => {
	Log(`${events.date}: `, `${payload.endTime}; ${payload.text}`);
	(document.querySelector('#stream-time') || {}).innerText = payload.text;
});

SdkEventEmitter.addListener(ESdkControlsEvents.START_VIDEO, (data) => {
	Log(events.start, data);
});

SdkEventEmitter.addListener(ESdkControlsEvents.END_VIDEO, (data) => {
	Log(events.end, data);
});

SdkEventEmitter.addListener(ESdkControlsEvents.AUTHORIZED_STATUS_UPDATE, (data) => {
	Log(events.authorize, data);
	(document.querySelector('#authorized') || {}).innerText = String(data);
});
