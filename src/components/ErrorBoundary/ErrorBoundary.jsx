import { Component } from 'react';

/**
 * Catches render-time crashes (e.g. a flaky scroll-pin teardown)
 * and offers a way back instead of a dead blank screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Route render failed:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-6">
        <div className="max-w-md text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Something hiccuped
          </p>
          <h1 className="mt-4 font-display text-4xl text-text">That frame got stuck.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The page hit a snag while changing views. Reloading brings everything
            back.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-deep"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
