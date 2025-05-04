(function() {
	if (!document.location.host.includes('localhost')) {
		return;
	}

	const VK_PLAYER_REGEX = /https:\/\/(vd|vsd)\d+\.mycdn\.me\//;

	(function () {
		const _XMLHttpRequest = window.XMLHttpRequest;
		const URL = 1;

		window.XMLHttpRequest = function() {
			const xhr = new _XMLHttpRequest();

			const _open = xhr.open;
			xhr.open = function () {
				const args = Array.from(arguments);

				if (VK_PLAYER_REGEX.test(args[URL])) {
					args[URL] = args[URL].replace('https://', 'http://' + window.location.host + '/vk-player/');
				}

				return _open.apply(this, args);
			}

			return xhr;
		};
	})();

	(function() {
		const _fetch = window.fetch;
		const URL = 0;

		window.fetch = function() {
			const args = Array.from(arguments);

			if (VK_PLAYER_REGEX.test(args[URL])) {
				args[URL] = args[URL].replace('https://', 'http://' + window.location.host + '/vk-player/');
			}

			return _fetch.apply(null, args);
		};
	})();
})();
