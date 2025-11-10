import { useState, useEffect } from 'react';
import { loadRemoteEntryWithRetry, loadFederatedModule } from '../utils/remoteLoader';

/**
 * Hook to dynamically load a remote module
 * @param {Object} options - Loading options
 * @param {string} options.url - Remote entry URL
 * @param {string} options.scope - Remote scope name
 * @param {string} options.module - Module path (e.g., './Widget')
 * @param {boolean} options.bustCache - Whether to bust cache (default: true)
 * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
 * @param {boolean} options.enabled - Whether to start loading (default: true)
 * @returns {Object} - { Component, loading, error, retry }
 */
export const useDynamicRemote = ({
  url,
  scope,
  module,
  bustCache = true,
  maxRetries = 3,
  retryDelay = 1000,
  enabled = true,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Component, setComponent] = useState(null);

  const loadModule = async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, load the remote entry script
      await loadRemoteEntryWithRetry({
        url,
        scope,
        bustCache,
        maxRetries,
        retryDelay,
      });

      // Then, load the specific module
      const loadedModule = await loadFederatedModule(scope, module);
      
      // Set the component (default export)
      setComponent(() => loadedModule.default || loadedModule);
      setLoading(false);
    } catch (err) {
      console.error(`[useDynamicRemote] Failed to load ${scope}/${module}:`, err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModule();
  }, [url, scope, module, enabled]);

  const retry = () => {
    loadModule();
  };

  return {
    Component,
    loading,
    error,
    retry,
  };
};

