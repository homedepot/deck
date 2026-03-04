import React from 'react';

import { Icon } from '@spinnaker/presentation';

import type { IBannerProps } from './customBannersByName';

import './LocksmithProMigrationBanner.less';

const DOCS_URL = 'https://docs.spinnaker.homedepot.com/instructions/locksmith-services/locksmith-pro/';
const TRACKER_URL =
  'https://onedrive.homedepot.com/:x:/g/personal/abel_a_rodriguez_homedepot_com/IQAQ75vLlPJMQ7W2mIpbusaOAc5xgM_Uj4xLTGaACavkpPk?e=0qT4dc';
const STORAGE_KEY = 'locksmithProMigrationBannerDismissed';

/**
 * System-wide banner informing users about the active Locksmith → Locksmith Pro pipeline migration.
 * To permanently hide after migration completes, set `active: false` in settings.js.
 */
export const LocksmithProMigrationBanner = (_props: IBannerProps) => {
  const [dismissed, setDismissed] = React.useState(() => sessionStorage.getItem(STORAGE_KEY) === 'true');

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className="locksmith-pro-migration-banner" role="alert" aria-live="polite">
      <Icon className="locksmith-pro-migration-banner__icon" name="formWarning" size="medium" aria-hidden="true" />
      <div className="locksmith-pro-migration-banner__content">
        <strong>Locksmith Pro Migration in Progress:</strong> We are currently migrating pipelines to Locksmith Pro.
        <br />
        {' • '}
        <strong>Status &amp; Schedule:</strong> Check the{' '}
        <a
          className="locksmith-pro-migration-banner__link"
          href={TRACKER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Migration Tracker
        </a>{' '}
        to see if your pipeline is impacted.
        <br />
        {' • '}
        <strong>Documentation:</strong> Read the{' '}
        <a className="locksmith-pro-migration-banner__link" href={DOCS_URL} target="_blank" rel="noopener noreferrer">
          Complete Migration Guide &amp; FAQ
        </a>
        .
        <br />
        {' • '}
        <strong>Reviewing Changes:</strong> To view your pipeline changes post-migration, navigate to{' '}
        <em>Configure &gt; Pipeline Actions &gt; Show Revision History</em>.
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
