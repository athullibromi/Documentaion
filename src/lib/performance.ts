'use client';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers();
    }
  }

  private initializeObservers(): void {
    // Observe navigation timing
    try {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordNavigationMetrics(navEntry);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (error) {
      console.warn('Navigation timing observer not supported:', error);
    }

    // Observe paint timing
    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.set(entry.name, entry.startTime);
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);
    } catch (error) {
      console.warn('Paint timing observer not supported:', error);
    }

    // Observe largest contentful paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('largest-contentful-paint', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    // Observe cumulative layout shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        this.metrics.set('cumulative-layout-shift', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }

    // Observe first input delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.set('first-input-delay', (entry as any).processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    // Time to first byte
    const ttfb = entry.responseStart - entry.requestStart;
    this.metrics.set('time-to-first-byte', ttfb);

    // DOM content loaded
    const dcl = entry.domContentLoadedEventEnd - entry.navigationStart;
    this.metrics.set('dom-content-loaded', dcl);

    // Load complete
    const loadComplete = entry.loadEventEnd - entry.navigationStart;
    this.metrics.set('load-complete', loadComplete);

    // DNS lookup time
    const dnsTime = entry.domainLookupEnd - entry.domainLookupStart;
    this.metrics.set('dns-lookup-time', dnsTime);

    // Connection time
    const connectionTime = entry.connectEnd - entry.connectStart;
    this.metrics.set('connection-time', connectionTime);
  }

  // Mark custom performance points
  mark(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
    }
  }

  // Measure time between marks
  measure(name: string, startMark: string, endMark?: string): number {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.measure(name, startMark);
        }
        
        const measure = performance.getEntriesByName(name, 'measure')[0];
        return measure ? measure.duration : 0;
      } catch (error) {
        console.warn('Performance measure failed:', error);
        return 0;
      }
    }
    return 0;
  }

  // Get all recorded metrics
  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // Get specific metric
  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  // Get Core Web Vitals
  getCoreWebVitals(): {
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  } {
    return {
      lcp: this.metrics.get('largest-contentful-paint'),
      fid: this.metrics.get('first-input-delay'),
      cls: this.metrics.get('cumulative-layout-shift'),
      ttfb: this.metrics.get('time-to-first-byte'),
    };
  }

  // Log performance summary
  logSummary(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics');
      
      const coreVitals = this.getCoreWebVitals();
      if (coreVitals.lcp) {
        console.log(`LCP: ${coreVitals.lcp.toFixed(2)}ms ${this.getVitalStatus('lcp', coreVitals.lcp)}`);
      }
      if (coreVitals.fid) {
        console.log(`FID: ${coreVitals.fid.toFixed(2)}ms ${this.getVitalStatus('fid', coreVitals.fid)}`);
      }
      if (coreVitals.cls) {
        console.log(`CLS: ${coreVitals.cls.toFixed(3)} ${this.getVitalStatus('cls', coreVitals.cls)}`);
      }
      if (coreVitals.ttfb) {
        console.log(`TTFB: ${coreVitals.ttfb.toFixed(2)}ms ${this.getVitalStatus('ttfb', coreVitals.ttfb)}`);
      }

      const otherMetrics = this.getMetrics();
      Object.entries(otherMetrics).forEach(([key, value]) => {
        if (!['largest-contentful-paint', 'first-input-delay', 'cumulative-layout-shift', 'time-to-first-byte'].includes(key)) {
          console.log(`${key}: ${value.toFixed(2)}ms`);
        }
      });
      
      console.groupEnd();
    }
  }

  private getVitalStatus(vital: string, value: number): string {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[vital as keyof typeof thresholds];
    if (!threshold) return '';

    if (value <= threshold.good) return '✅ Good';
    if (value <= threshold.poor) return '⚠️ Needs Improvement';
    return '❌ Poor';
  }

  // Clean up observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  return {
    mark: monitor.mark.bind(monitor),
    measure: monitor.measure.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    getMetric: monitor.getMetric.bind(monitor),
    getCoreWebVitals: monitor.getCoreWebVitals.bind(monitor),
    logSummary: monitor.logSummary.bind(monitor),
  };
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Preload critical resources
  preloadResource(href: string, as: string, type?: string): void {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    }
  },

  // Prefetch resources for next navigation
  prefetchResource(href: string): void {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  },

  // Check if device has slow connection
  isSlowConnection(): boolean {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        (connection.effectiveType === '3g' && connection.downlink < 1.5)
      );
    }
    return false;
  },

  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },

  // Check if device has limited memory
  hasLimitedMemory(): boolean {
    if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
      return (navigator as any).deviceMemory < 4;
    }
    return false;
  },

  // Get device pixel ratio
  getDevicePixelRatio(): number {
    if (typeof window !== 'undefined') {
      return window.devicePixelRatio || 1;
    }
    return 1;
  },
};