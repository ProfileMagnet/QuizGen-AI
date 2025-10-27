import { lazy } from 'react';
import { withLazyLoading } from '../utils/lazyLoader';

// Lazy load all sections except critical ones (Hero, Overview)
export const LazyArchitectureSection = withLazyLoading(
  lazy(() => import('../sections/ArchitectureSection')),
  'Loading Architecture...'
);

export const LazyTryItLive = withLazyLoading(
  lazy(() => import('../sections/TryItLive')),
  'Loading Demo...'
);

export const LazyExampleOutputSection = withLazyLoading(
  lazy(() => import('../sections/ExampleOutputSection')),
  'Loading Examples...'
);

export const LazyUpcomingFeaturesSection = withLazyLoading(
  lazy(() => import('../sections/UpcomingFeaturesSection')),
  'Loading Features...'
);

export const LazyTeamSection = withLazyLoading(
  lazy(() => import('../sections/TeamSection')),
  'Loading Team...'
);

export const LazyContactSection = withLazyLoading(
  lazy(() => import('../sections/ContactSection')),
  'Loading Contact...'
);

export const LazyFooter = withLazyLoading(
  lazy(() => import('../sections/Footer')),
  'Loading...'
);

// Heavy component - Quiz Generator
export const LazyQuizGeneratorPage = withLazyLoading(
  lazy(() => import('../sections/QuizGeneratorPage')),
  'Loading Quiz Generator...'
);

// Animated Background - can be lazy loaded
export const LazyAnimatedBackground = withLazyLoading(
  lazy(() => import('../AnimatedBackground/AnimatedBackground')),
  'Loading Background...'
);