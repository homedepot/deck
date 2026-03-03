import { mount, shallow } from 'enzyme';
import React from 'react';

import { LocksmithProMigrationBanner } from './LocksmithProMigrationBanner';

const STORAGE_KEY = 'locksmithProMigrationBannerDismissed';

describe('<LocksmithProMigrationBanner />', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('visibility', () => {
    it('renders the banner when not previously dismissed', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      expect(wrapper.find('.locksmith-pro-migration-banner').length).toEqual(1);
    });

    it('renders nothing when the user previously dismissed it', () => {
      localStorage.setItem(STORAGE_KEY, 'true');
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      expect(wrapper.find('.locksmith-pro-migration-banner').length).toEqual(0);
    });
  });

  describe('dismiss behavior', () => {
    it('hides the banner when the dismiss button is clicked', () => {
      const wrapper = mount(<LocksmithProMigrationBanner app={null} />);
      wrapper.find('.locksmith-pro-migration-banner__dismiss').simulate('click');
      expect(wrapper.find('.locksmith-pro-migration-banner').length).toEqual(0);
    });

    it('persists dismissal to localStorage when dismissed', () => {
      const wrapper = mount(<LocksmithProMigrationBanner app={null} />);
      wrapper.find('.locksmith-pro-migration-banner__dismiss').simulate('click');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
    });
  });

  describe('content', () => {
    it('renders the migration tracker link with the correct href', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      const links = wrapper.find('.locksmith-pro-migration-banner__link');
      const trackerLink = links.filterWhere((l) => l.text().includes('Spinnaker Pipeline Locksmith Migration Tracker'));
      expect(trackerLink.prop('href')).toBe(
        'https://onedrive.homedepot.com/:x:/g/personal/abel_a_rodriguez_homedepot_com/IQAQ75vLlPJMQ7W2mIpbusaOAc5xgM_Uj4xLTGaACavkpPk?e=0qT4dc',
      );
    });

    it('renders the docs link with the correct href', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      const links = wrapper.find('.locksmith-pro-migration-banner__link');
      const docsLink = links.filterWhere((l) => l.text().includes('Locksmith Pro: Complete Migration Guide'));
      expect(docsLink.prop('href')).toBe(
        'https://docs.spinnaker.homedepot.com/instructions/locksmith-services/locksmith-pro/',
      );
    });

    it('renders both links opening in a new tab safely', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      const links = wrapper.find('.locksmith-pro-migration-banner__link');
      expect(links.length).toEqual(2);
      links.forEach((link) => {
        expect(link.prop('target')).toBe('_blank');
        expect(link.prop('rel')).toBe('noopener noreferrer');
      });
    });

    it('has accessible dismiss button label', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      const btn = wrapper.find('.locksmith-pro-migration-banner__dismiss');
      expect(btn.prop('aria-label')).toBe('Dismiss migration banner');
    });
  });
});
