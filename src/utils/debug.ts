import toast from "react-hot-toast";

/**
 * Development utilities for debugging
 */
export const debug = {
  /**
   * Log with timestamp and context
   */
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] 🔍 ${message}`, data || "");
    }
  },

  /**
   * Log errors with context
   */
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toLocaleTimeString();
      console.error(`[${timestamp}] ❌ ${message}`, error || "");
      toast.error(`Debug: ${message}`);
    }
  },

  /**
   * Log warnings
   */
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toLocaleTimeString();
      console.warn(`[${timestamp}] ⚠️ ${message}`, data || "");
    }
  },

  /**
   * Success notifications
   */
  success: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] ✅ ${message}`, data || "");
      toast.success(`Debug: ${message}`);
    }
  },

  /**
   * Performance timing
   */
  time: (label: string) => {
    if (process.env.NODE_ENV === "development") {
      console.time(`🕐 ${label}`);
    }
  },

  timeEnd: (label: string) => {
    if (process.env.NODE_ENV === "development") {
      console.timeEnd(`🕐 ${label}`);
    }
  },

  /**
   * Component lifecycle logging
   */
  componentMount: (componentName: string) => {
    debug.log(`Component mounted: ${componentName}`);
  },

  componentUnmount: (componentName: string) => {
    debug.log(`Component unmounted: ${componentName}`);
  },

  /**
   * State changes
   */
  stateChange: (component: string, oldValue: any, newValue: any) => {
    debug.log(`State change in ${component}`, { from: oldValue, to: newValue });
  },

  /**
   * API calls
   */
  apiCall: (endpoint: string, method: string, data?: any) => {
    debug.log(`API ${method} ${endpoint}`, data);
  },

  apiResponse: (endpoint: string, status: number, data?: any) => {
    if (status >= 400) {
      debug.error(`API Error ${endpoint} (${status})`, data);
    } else {
      debug.log(`API Success ${endpoint} (${status})`, data);
    }
  },

  /**
   * User interactions
   */
  userAction: (action: string, context?: any) => {
    debug.log(`User action: ${action}`, context);
  },

  /**
   * Hydration debugging
   */
  hydrationMismatch: (
    component: string,
    serverValue: any,
    clientValue: any
  ) => {
    debug.error(`Hydration mismatch in ${component}`, {
      server: serverValue,
      client: clientValue,
    });
  },

  /**
   * Bundle and performance info
   */
  bundleInfo: () => {
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
    ) {
      debug.log("Performance info", {
        userAgent: navigator.userAgent,
        memory: (performance as any).memory,
        timing: performance.timing,
      });
    }
  },
};

/**
 * Hook for component debugging
 */
export const useDebugComponent = (componentName: string) => {
  if (process.env.NODE_ENV === "development") {
    return {
      log: (message: string, data?: any) =>
        debug.log(`[${componentName}] ${message}`, data),
      error: (message: string, error?: any) =>
        debug.error(`[${componentName}] ${message}`, error),
      warn: (message: string, data?: any) =>
        debug.warn(`[${componentName}] ${message}`, data),
      success: (message: string, data?: any) =>
        debug.success(`[${componentName}] ${message}`, data),
      mount: () => debug.componentMount(componentName),
      unmount: () => debug.componentUnmount(componentName),
      stateChange: (oldValue: any, newValue: any) =>
        debug.stateChange(componentName, oldValue, newValue),
      userAction: (action: string, context?: any) =>
        debug.userAction(`${componentName}: ${action}`, context),
    };
  }

  // Return no-op functions in production
  return {
    log: () => {},
    error: () => {},
    warn: () => {},
    success: () => {},
    mount: () => {},
    unmount: () => {},
    stateChange: () => {},
    userAction: () => {},
  };
};
