import React from 'react';

import { Icon } from '@spinnaker/presentation';

import type { IBannerProps } from './customBannersByName';

import './LocksmithProMigrationBanner.less';

const DOCS_URL =
  'https://docs.spinnaker.homedepot.com/instructions/locksmith-services/locksmith-pro/';
const STORAGE_KEY = 'locksmithProMigrationBannerDismissed';

const MIGRATION_TIMELINE = [
  { 
    range: 'Now – Mar 3', 
    description: 'Self-migration window (highly encouraged!)' },
  { 
    range: 'Mar 4 – 13', 
    description: 'Automated migrations (Locksmith stage only)' },
  {
    range: 'Mar 14 – Apr 5',
    description: 'Catch-up window for pipelines managed outside Spinnaker',
  },
  {
    range: 'Apr 1',
    description: 'Locksmith Pro enforced — legacy stages removed; pipelines will fail',
  },
];

/**
 * System-wide banner informing users about the Locksmith → Locksmith Pro pipeline migration.
 * TODO: Replace placeholder body copy below once final approved text is confirmed.
 * To permanently hide after migration completes, set `active: false` in settings.js.
 */
export const LocksmithProMigrationBanner = (_props: IBannerProps) => {
  const [dismissed, setDismissed] = React.useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true',
  );

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className="locksmith-pro-migration-banner" role="alert" aria-live="polite">
      <Icon
        className="locksmith-pro-migration-banner__icon"
        name="formWarning"
        size="medium"
        aria-hidden="true"
      />
      <div className="locksmith-pro-migration-banner__content">
        <strong>Locksmith Pro Migration: </strong>
        We are migrating pipelines from the legacy Locksmith stage to the new Locksmith Pro stage.
        Please review the timeline and take action during the self-migration window.
        <ul className="locksmith-pro-migration-banner__timeline">
          {MIGRATION_TIMELINE.map(({ range, description }) => (
            <li key={range}>
              <strong>{range}:</strong> {description}
            </li>
          ))}
        </ul>
        <a
          className="locksmith-pro-migration-banner__link"
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Locksmith Pro migration docs →
        </a>
      </div>
      <button
        className="locksmith-pro-migration-banner__dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss migration banner"
        type="button"
      >
        ×
      </button>
    </div>
  );
};
