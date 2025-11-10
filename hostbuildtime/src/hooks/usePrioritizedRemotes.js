import { useState, useEffect } from 'react';
import { useDynamicRemote } from './useDynamicRemote';

/**
 * Hook to manage prioritized loading of remote modules
 * High priority remotes load first, low priority remotes load after
 *
 * @param {Object} options - Configuration options
 * @param {Array} options.remotes - Array of remote configurations
 * @param {Array} options.remotes[].name - Remote name
 * @param {Array} options.remotes[].url - Remote entry URL
 * @param {Array} options.remotes[].scope - Remote scope
 * @param {Array} options.remotes[].module - Module path (e.g., './Widget')
 * @param {Array} options.remotes[].priority - 'high' or 'low'
 * @param {boolean} options.bustCache - Whether to bust cache (default: true)
 * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
 * @param {number} options.highPriorityDelay - Delay before loading high-priority remotes in ms (default: 0)
 * @param {number} options.lowPriorityDelay - Delay after high-priority loads before loading low-priority in ms (default: 100)
 * @param {boolean} options.enableLogging - Enable console logging (default: true)
 * @returns {Object} - { highPriorityRemotes, lowPriorityRemotes, allHighPriorityLoaded }
 */
export const usePrioritizedRemotes = ({
  remotes = [],
  bustCache = true,
  maxRetries = 3,
  retryDelay = 1000,
  highPriorityDelay = 0,
  lowPriorityDelay = 100,
  enableLogging = true,
} = {}) => {
  const [allHighPriorityLoaded, setAllHighPriorityLoaded] = useState(false);
  const [enableLowPriority, setEnableLowPriority] = useState(false);
  const [enableHighPriority, setEnableHighPriority] = useState(false);

  const log = (message) => {
    if (enableLogging) {
      console.log(`[PrioritizationFramework] ${message}`);
    }
  };

  // Separate remotes by priority
  const highPriorityConfig = remotes.filter(r => r.priority === 'high');
  const lowPriorityConfig = remotes.filter(r => r.priority === 'low');

  // Delay high priority loading if configured
  useEffect(() => {
    if (highPriorityDelay > 0) {
      log(`Waiting ${highPriorityDelay}ms before loading high-priority remotes...`);
      const timer = setTimeout(() => {
        log('Starting high-priority remotes now...');
        setEnableHighPriority(true);
      }, highPriorityDelay);

      return () => clearTimeout(timer);
    } else {
      setEnableHighPriority(true);
    }
  }, [highPriorityDelay]);

  // Load high priority remotes
  const highPriorityRemotes = highPriorityConfig.map(remote => {
    const result = useDynamicRemote({
      url: remote.url,
      scope: remote.scope,
      module: remote.module,
      bustCache,
      maxRetries,
      retryDelay,
      enabled: enableHighPriority,
    });

    return {
      ...remote,
      ...result,
    };
  });

  // Load low priority remotes (only after high priority ones are loaded)
  const lowPriorityRemotes = lowPriorityConfig.map(remote => {
    const result = useDynamicRemote({
      url: remote.url,
      scope: remote.scope,
      module: remote.module,
      bustCache,
      maxRetries,
      retryDelay,
      enabled: enableLowPriority,
    });

    return {
      ...remote,
      ...result,
    };
  });

  // Check if all high priority remotes are loaded
  useEffect(() => {
    if (highPriorityConfig.length === 0) {
      // No high priority remotes, enable low priority immediately
      setAllHighPriorityLoaded(true);
      setEnableLowPriority(true);
      return;
    }

    const allLoaded = highPriorityRemotes.every(remote => !remote.loading && !remote.error);

    if (allLoaded && !allHighPriorityLoaded && enableHighPriority) {
      log('All high-priority remotes loaded. Starting low-priority remotes...');
      setAllHighPriorityLoaded(true);

      // Enable low priority loading after configured delay
      setTimeout(() => {
        setEnableLowPriority(true);
      }, lowPriorityDelay);
    }
  }, [highPriorityRemotes, enableHighPriority, highPriorityConfig.length]);

  return {
    highPriorityRemotes,
    lowPriorityRemotes,
    allHighPriorityLoaded,
  };
};

