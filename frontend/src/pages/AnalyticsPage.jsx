import React from 'react';
import Navbar from '../components/layout/Navbar/Navbar';
import EmptyState from '../components/ui/EmptyState/EmptyState';

const AnalyticsIcon = (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

/**
 * AnalyticsPage — Detailed click statistics dashboard showing an empty state when no traffic is logged.
 */
function AnalyticsPage() {
  return (
    <div className="analytics-page">
      <Navbar />

      <main className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
        <EmptyState
          icon={AnalyticsIcon}
          title="No analytics yet."
          description="Analytics will appear after your first link receives clicks."
        />
      </main>
    </div>
  );
}

export default AnalyticsPage;
