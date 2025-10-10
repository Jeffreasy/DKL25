import { useRef, useEffect, useCallback } from 'react';
import { logEvent, trackEvent } from '../utils/googleAnalytics';

export const usePerformanceTracking = (componentName: string) => {
  const mountTime = useRef(performance.now());
  const interactionCount = useRef(0);

  useEffect(() => {
    const loadTime = performance.now() - mountTime.current;
    logEvent('performance', 'component_mount', `${componentName}_load_time:${Math.round(loadTime)}ms`);

    return () => {
      const totalTime = performance.now() - mountTime.current;
      logEvent('performance', 'component_unmount', `${componentName}_total_time:${Math.round(totalTime)}ms_interactions:${interactionCount.current}`);
    };
  }, [componentName]);

  const trackInteraction = useCallback((action: string, details?: string) => {
    interactionCount.current += 1;
    logEvent('interaction', action, `${componentName}_${details || 'generic'}`);
  }, [componentName]);

  const trackPerformanceMetric = useCallback((metric: string, value: number, context?: string) => {
    trackEvent('performance', metric, context || componentName, value);
  }, [componentName]);

  return {
    trackInteraction,
    trackPerformanceMetric
  };
};