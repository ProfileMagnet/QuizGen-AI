import { lazy } from 'react';
import { withLazyLoading } from '../utils/lazyLoader';

// Lazy load all sections except critical ones (Hero, Overview)
export const LazyArchitectureSection = withLazyLoading(
  lazy(() => import('../sections/ArchitectureSection'))
);

export const LazyTryItLive = withLazyLoading(
  lazy(() => import('../sections/TryItLive'))
);

export const LazyExampleOutputSection = withLazyLoading(
  lazy(() => import('../sections/ExampleOutputSection'))
);

export const LazyUpcomingFeaturesSection = withLazyLoading(
  lazy(() => import('../sections/UpcomingFeaturesSection'))
);

export const LazyTeamSection = withLazyLoading(
  lazy(() => import('../sections/TeamSection'))
);

export const LazyContactSection = withLazyLoading(
  lazy(() => import('../sections/ContactSection'))
);

export const LazyFooter = withLazyLoading(
  lazy(() => import('../sections/Footer'))
);

// Heavy component - Quiz Generator
export const LazyQuizGeneratorPage = withLazyLoading(
  lazy(() => import('../sections/QuizGeneratorPage'))
);

// Documentation Page
export const LazyDocumentationPage = withLazyLoading(
  lazy(() => import('../sections/DocumentationPage'))
);

// Animated Background - can be lazy loaded
export const LazyAnimatedBackground = withLazyLoading(
  lazy(() => import('../AnimatedBackground/AnimatedBackground'))
);