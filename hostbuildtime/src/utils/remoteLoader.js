/**
 * Load a remote entry script dynamically
 * @param {Object} options - Loading options
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 * @param {string} options.url - Remote entry URL
 * @param {string} options.scope - Remote scope name
 * @param {boolean} options.bustRemoteEntryCache - Whether to add cache busting timestamp
 */
const loadRemoteEntry = ({ onSuccess, onFailure, url, scope, bustRemoteEntryCache }) => {
  const timestamp = bustRemoteEntryCache ? `?t=${new Date().getTime()}` : '';
  const webpackRequire = __webpack_require__; // eslint-disable-line
  
  webpackRequire.l(
    `${url}${timestamp}`,
    event => {
      if (event?.type === 'load') {
        // Script loaded successfully:
        return onSuccess();
      }
      const realSrc = event?.target?.src;
      const error = new Error();
      error.message = `Loading script failed.\n(missing: ${realSrc})`;
      error.name = 'ScriptExternalLoadError';
      return onFailure(error);
    },
    scope
  );
};

/**
 * Load a remote entry with retry logic
 * @param {Object} options - Loading options
 * @param {string} options.url - Remote entry URL
 * @param {string} options.scope - Remote scope name
 * @param {boolean} options.bustCache - Whether to bust cache
 * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
 * @returns {Promise} - Resolves when loaded, rejects after max retries
 */
export const loadRemoteEntryWithRetry = ({
  url,
  scope,
  bustCache = true,
  maxRetries = 3,
  retryDelay = 1000,
}) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const attemptLoad = () => {
      attempts++;
      console.log(`[RemoteLoader] Loading ${scope} from ${url} (attempt ${attempts}/${maxRetries})`);

      loadRemoteEntry({
        url,
        scope,
        bustRemoteEntryCache: bustCache,
        onSuccess: () => {
          console.log(`[RemoteLoader] Successfully loaded ${scope}`);
          resolve();
        },
        onFailure: (error) => {
          console.error(`[RemoteLoader] Failed to load ${scope} (attempt ${attempts}/${maxRetries}):`, error);
          
          if (attempts < maxRetries) {
            console.log(`[RemoteLoader] Retrying ${scope} in ${retryDelay}ms...`);
            setTimeout(attemptLoad, retryDelay);
          } else {
            console.error(`[RemoteLoader] Max retries reached for ${scope}`);
            reject(error);
          }
        },
      });
    };

    attemptLoad();
  });
};

/**
 * Load a federated module from a remote container
 * @param {string} scope - Remote scope name
 * @param {string} module - Module path (e.g., './Widget')
 * @returns {Promise} - Resolves with the module
 */
export const loadFederatedModule = async (scope, module) => {
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__('default');
  
  const container = window[scope];
  
  if (!container) {
    throw new Error(`Remote container '${scope}' not found. Make sure the remote entry is loaded.`);
  }
  
  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  
  // Get the module factory
  const factory = await container.get(module);
  
  // Execute the factory to get the module
  const Module = factory();
  
  return Module;
};



