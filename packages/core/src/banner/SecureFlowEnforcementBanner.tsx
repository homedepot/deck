import React from 'react';

import { Icon } from '@spinnaker/presentation';

import type { IBannerProps } from './customBannersByName';

import './SecureFlowEnforcementBanner.less';

const DOCS_URL = 'https://thd.atlassian.net/wiki/spaces/DevTools/pages/2713027493/Secure+Flow+Migration';
const SUPPORT_URL = 'https://thd.enterprise.slack.com/archives/C08JLDB2JUU';
const STORAGE_KEY = 'secureFlowEnforcementBannerDismissed';

export const SecureFlowEnforcementBanner = (_props: IBannerProps) => {
  const [dismissed, setDismissed] = React.useState(() => sessionStorage.getItem(STORAGE_KEY) === 'true');

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className="secure-flow-enforcement-banner" role="alert" aria-live="polite">
      <Icon className="secure-flow-enforcement-banner__icon" name="formWarning" size="medium" aria-hidden="true" />
      <div className="secure-flow-enforcement-banner__content">
        <strong>Secure Flow Enforcement:</strong> Mandatory Secure Flow enforcement is in effect. Production deployments
        will be blocked for applications without required Secure Flow attestations (includes GKE, Tiny Homes, App
        Engine, and Cloud Run). Review the{' '}
        <a className="secure-flow-enforcement-banner__link" href={DOCS_URL} target="_blank" rel="noopener noreferrer">
          Secure Flow Migration Guide
        </a>{' '}
        for requirements, or reach out in the{' '}
        <a
          className="secure-flow-enforcement-banner__link"
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Slack support channel
        </a>{' '}
        for help.
      </div>
      <button
        className="secure-flow-enforcement-banner__dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss Secure Flow banner"
        type="button"
      >
        ×
      </button>
    </div>
  );
};
