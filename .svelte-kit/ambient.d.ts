
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const GJS_DEBUG_TOPICS: string;
	export const LESSOPEN: string;
	export const USER: string;
	export const LESS_TERMCAP_ue: string;
	export const npm_config_user_agent: string;
	export const STARSHIP_SHELL: string;
	export const XDG_SESSION_TYPE: string;
	export const BUN_INSTALL: string;
	export const GIT_ASKPASS: string;
	export const npm_node_execpath: string;
	export const SHLVL: string;
	export const GREP_COLOR: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const CHROME_DESKTOP: string;
	export const OLDPWD: string;
	export const LESS: string;
	export const DESKTOP_SESSION: string;
	export const NVM_BIN: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_json: string;
	export const GIO_LAUNCHED_DESKTOP_FILE: string;
	export const NVM_INC: string;
	export const ZSH: string;
	export const LSCOLORS: string;
	export const GTK_MODULES: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const FPATH: string;
	export const PAGER: string;
	export const OPENAI_API_KEY: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const MANAGERPID: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const GREP_COLORS: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const SYSTEMD_EXEC_PID: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const GIO_LAUNCHED_DESKTOP_FILE_PID: string;
	export const COLORTERM: string;
	export const COLOR: string;
	export const NVM_DIR: string;
	export const MANDATORY_PATH: string;
	export const LOGNAME: string;
	export const GTK_IM_MODULE: string;
	export const _: string;
	export const JOURNAL_STREAM: string;
	export const LESS_TERMCAP_us: string;
	export const npm_config_prefix: string;
	export const npm_config_npm_version: string;
	export const DEFAULTS_PATH: string;
	export const XDG_SESSION_CLASS: string;
	export const USER_ZDOTDIR: string;
	export const USERNAME: string;
	export const TERM: string;
	export const npm_config_cache: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const WINDOWPATH: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const SESSION_MANAGER: string;
	export const INVOCATION_ID: string;
	export const GOBIN: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const XDG_RUNTIME_DIR: string;
	export const XDG_MENU_PREFIX: string;
	export const GDK_BACKEND: string;
	export const DISPLAY: string;
	export const LANG: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const VSCODE_INJECTION: string;
	export const XAUTHORITY: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XMODIFIERS: string;
	export const LS_COLORS: string;
	export const TERM_PROGRAM: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const npm_lifecycle_script: string;
	export const SSH_AGENT_LAUNCHER: string;
	export const SSH_AUTH_SOCK: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const SHELL: string;
	export const GOPATH: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const NODE_PATH: string;
	export const QT_ACCESSIBILITY: string;
	export const GDMSESSION: string;
	export const LESSCLOSE: string;
	export const LESS_TERMCAP_mb: string;
	export const GPG_AGENT_INFO: string;
	export const GJS_DEBUG_OUTPUT: string;
	export const QT_IM_MODULE: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const LESS_TERMCAP_md: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const PWD: string;
	export const GPG_TTY: string;
	export const LESS_TERMCAP_me: string;
	export const npm_execpath: string;
	export const XDG_DATA_DIRS: string;
	export const XDG_CONFIG_DIRS: string;
	export const NVM_CD_FLAGS: string;
	export const ZDOTDIR: string;
	export const npm_config_global_prefix: string;
	export const STARSHIP_SESSION_KEY: string;
	export const npm_command: string;
	export const PNPM_HOME: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		GJS_DEBUG_TOPICS: string;
		LESSOPEN: string;
		USER: string;
		LESS_TERMCAP_ue: string;
		npm_config_user_agent: string;
		STARSHIP_SHELL: string;
		XDG_SESSION_TYPE: string;
		BUN_INSTALL: string;
		GIT_ASKPASS: string;
		npm_node_execpath: string;
		SHLVL: string;
		GREP_COLOR: string;
		npm_config_noproxy: string;
		HOME: string;
		CHROME_DESKTOP: string;
		OLDPWD: string;
		LESS: string;
		DESKTOP_SESSION: string;
		NVM_BIN: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_json: string;
		GIO_LAUNCHED_DESKTOP_FILE: string;
		NVM_INC: string;
		ZSH: string;
		LSCOLORS: string;
		GTK_MODULES: string;
		GNOME_SHELL_SESSION_MODE: string;
		FPATH: string;
		PAGER: string;
		OPENAI_API_KEY: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		MANAGERPID: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		GREP_COLORS: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		SYSTEMD_EXEC_PID: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		GIO_LAUNCHED_DESKTOP_FILE_PID: string;
		COLORTERM: string;
		COLOR: string;
		NVM_DIR: string;
		MANDATORY_PATH: string;
		LOGNAME: string;
		GTK_IM_MODULE: string;
		_: string;
		JOURNAL_STREAM: string;
		LESS_TERMCAP_us: string;
		npm_config_prefix: string;
		npm_config_npm_version: string;
		DEFAULTS_PATH: string;
		XDG_SESSION_CLASS: string;
		USER_ZDOTDIR: string;
		USERNAME: string;
		TERM: string;
		npm_config_cache: string;
		GNOME_DESKTOP_SESSION_ID: string;
		WINDOWPATH: string;
		npm_config_node_gyp: string;
		PATH: string;
		SESSION_MANAGER: string;
		INVOCATION_ID: string;
		GOBIN: string;
		NODE: string;
		npm_package_name: string;
		XDG_RUNTIME_DIR: string;
		XDG_MENU_PREFIX: string;
		GDK_BACKEND: string;
		DISPLAY: string;
		LANG: string;
		XDG_CURRENT_DESKTOP: string;
		VSCODE_INJECTION: string;
		XAUTHORITY: string;
		XDG_SESSION_DESKTOP: string;
		XMODIFIERS: string;
		LS_COLORS: string;
		TERM_PROGRAM: string;
		VSCODE_GIT_IPC_HANDLE: string;
		npm_lifecycle_script: string;
		SSH_AGENT_LAUNCHER: string;
		SSH_AUTH_SOCK: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		SHELL: string;
		GOPATH: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		NODE_PATH: string;
		QT_ACCESSIBILITY: string;
		GDMSESSION: string;
		LESSCLOSE: string;
		LESS_TERMCAP_mb: string;
		GPG_AGENT_INFO: string;
		GJS_DEBUG_OUTPUT: string;
		QT_IM_MODULE: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		LESS_TERMCAP_md: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		PWD: string;
		GPG_TTY: string;
		LESS_TERMCAP_me: string;
		npm_execpath: string;
		XDG_DATA_DIRS: string;
		XDG_CONFIG_DIRS: string;
		NVM_CD_FLAGS: string;
		ZDOTDIR: string;
		npm_config_global_prefix: string;
		STARSHIP_SESSION_KEY: string;
		npm_command: string;
		PNPM_HOME: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
