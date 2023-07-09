import { DeepPartial } from './DeepPartial';

type DefaultIcon = {
	'16'?: string;
	'24'?: string;
	'32'?: string;
};

/**
 * See full docs for permissions [here](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/#permissions).
 */
export type Permission =
	| 'activeTab'
	| 'alarms'
	| 'background'
	| 'bookmarks'
	| 'browsingData'
	| 'certificateProvider'
	| 'clipboardRead'
	| 'clipboardWrite'
	| 'contentSettings'
	| 'contextMenus'
	| 'cookies'
	| 'debugger'
	| 'declarativeContent'
	| 'declarativeNetRequest'
	| 'declarativeNetRequestWithHostAccess'
	| 'declarativeNetRequestFeedback'
	| 'declarativeWebRequest'
	| 'desktopCapture'
	| 'documentScan'
	| 'downloads'
	| 'enterprise.deviceAttributes'
	| 'enterprise.hardwarePlatform'
	| 'enterprise.networkingAttributes'
	| 'enterprise.platformKeys'
	| 'experimental'
	| 'fileBrowserHandler'
	| 'fileSystemProvider'
	| 'fontSettings'
	| 'gcm'
	| 'geolocation'
	| 'history'
	| 'identity'
	| 'idle'
	| 'loginState'
	| 'management'
	| 'nativeMessaging'
	| 'notifications'
	| 'offscreen'
	| 'pageCapture'
	| 'platformKeys'
	| 'power'
	| 'printerProvider'
	| 'printing'
	| 'printingMetrics'
	| 'privacy'
	| 'processes'
	| 'proxy'
	| 'scripting'
	| 'search'
	| 'sessions'
	| 'sidePanel'
	| 'storage'
	| 'system.cpu'
	| 'system.display'
	| 'system.memory'
	| 'system.storage'
	| 'tabCapture'
	| 'tabGroups'
	| 'tabs'
	| 'topSites'
	| 'tts'
	| 'ttsEngine'
	| 'unlimitedStorage'
	| 'vpnProvider'
	| 'wallpaper'
	| 'webAuthenticationProxy'
	| 'webNavigation'
	| 'webRequest'
	| 'webRequestBlocking';

type RequiredOptions = {
	// Required
	/** Version of manifest. Only 3rd is fully supported now. */
	manifest_version: 3;

	/** Name of extension. */
	name: string;

	/** Version of extension. */
	version: string;
};

type RecommendedOptions = {
	// Recommended
	/** Extension`s action. Setup things like default icon etc. */
	action?: {
		/** List of default icons for 16px, 24px and 32px sizes. */
		default_icon?: DefaultIcon;

		/** Default title of extension. */
		default_title?: string;

		/** Path to default popup. */
		default_popup?: string;
	};

	/**
	 * Default locale. Set only if you are going to use _locales folder.
	 *
	 * See docs for [Internationalization](https://developer.chrome.com/docs/extensions/reference/i18n/) here.
	 */
	default_locale?: string;

	/** Description of extension. */
	description?: string;

	/** Extension icons in store. */
	icons?: Partial<
		Omit<DefaultIcon, '24'> & {
			'48': string;
			'128': string;
		}
	>;
};

type OptionalCommands = {
	// Optional
	/** Author`s name, email etc. */
	author?: string;

	/**
	 * Setup service worker. [Docs](https://developer.chrome.com/docs/extensions/mv3/manifest/background/)
	 */
	background?: {
		service_worker: string;
		type: 'module';
	};

	/**
	 * Override Chrome settings. [Docs](https://developer.chrome.com/docs/extensions/mv3/settings_override/)
	 */
	chrome_settings_overrides?: DeepPartial<{
		homepage: string;
		search_provider: {
			name: string;
			keyword: string;
			search_url: string;
			favicon_url: string;
			suggest_url: string;
			instant_url: string;
			image_url: string;
			search_url_post_params: string;
			suggest_url_post_params: string;
			instant_url_post_params: string;
			image_url_post_params: string;
			alternate_urls: string[];
			encoding: 'UTF-8';
			is_default: boolean;
		};
		startup_pages: string[];
	}>;

	/** Number of minimum version of Chrome. */
	minimum_chrome_version?: string;

	/** Full version name. */
	version_name?: string;
};

/**
 * See full docs for permissions [here](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/#permissions).
 */
export type Permissions = Partial<
	Record<
		| 'permissions'
		| 'optional_permissions'
		| 'host_permissions'
		| 'optional_host_permissions',
		Permission[]
	>
>;

export type ChromeExtManifest = RequiredOptions &
	RecommendedOptions &
	OptionalCommands &
	Permissions;
