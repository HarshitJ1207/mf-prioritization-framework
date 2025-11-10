/**
 * Remote Module Configuration
 * 
 * Configure all remote modules here with their priority levels.
 * 
 * Priority Levels:
 * - 'high': Loads immediately (or after highPriorityDelay if configured)
 * - 'low': Loads only after all high-priority remotes are loaded
 * 
 * Each remote configuration:
 * @param {string} name - Unique identifier for the remote
 * @param {string} url - Remote entry URL
 * @param {string} scope - Remote scope name (must match ModuleFederationPlugin name)
 * @param {string} module - Module path to import (e.g., './Widget')
 * @param {string} priority - 'high' or 'low'
 */
export const REMOTES_CONFIG = [
  // High Priority Remotes - Critical for initial page load
  {
    name: 'headerApp',
    url: 'http://localhost:3001/remoteEntry.js',
    scope: 'headerApp',
    module: './Widget',
    priority: 'high',
  },
  {
    name: 'mainApp',
    url: 'http://localhost:3003/remoteEntry.js',
    scope: 'mainApp',
    module: './Widget',
    priority: 'high',
  },
  
  // Low Priority Remotes - Can be deferred
  {
    name: 'footerApp',
    url: 'http://localhost:3002/remoteEntry.js',
    scope: 'footerApp',
    module: './Widget',
    priority: 'low',
  },
];

/**
 * Prioritization Framework Configuration
 * 
 * Global settings for the prioritization framework
 */
export const FRAMEWORK_CONFIG = {
  // Cache busting - adds timestamp to remote URLs
  bustCache: true,
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000, // ms between retries
  
  // Delay configuration
  highPriorityDelay: 4000, // ms to wait before loading high-priority remotes (0 = immediate)
  lowPriorityDelay: 100,   // ms to wait after high-priority loads before loading low-priority
  
  // Logging
  enableLogging: true, // Enable console logs for debugging
};

/**
 * Helper function to get remotes by priority
 */
export const getRemotesByPriority = (priority) => {
  return REMOTES_CONFIG.filter(remote => remote.priority === priority);
};

/**
 * Helper function to get a specific remote by name
 */
export const getRemoteByName = (name) => {
  return REMOTES_CONFIG.find(remote => remote.name === name);
};

