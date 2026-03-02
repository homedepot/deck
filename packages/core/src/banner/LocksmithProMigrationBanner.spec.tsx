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
    it('renders all four migration timeline items', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      expect(wrapper.find('.locksmith-pro-migration-banner__timeline li').length).toEqual(4);
    });

    it('renders the docs link with the correct href', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      const link = wrapper.find('.locksmith-pro-migration-banner__link');
      expect(link.prop('href')).toBe(
        'https://docs.spinnaker.homedepot.com/instructions/locksmith-services/locksmith-pro/',
      );
    });

    it('renders the docs link that opens in a new tab safely', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      const link = wrapper.find('.locksmith-pro-migration-banner__link');
      expect(link.prop('target')).toBe('_blank');
      expect(link.prop('rel')).toBe('noopener noreferrer');
    });

    it('has accessible dismiss button label', () => {
      const wrapper = shallow(<LocksmithProMigrationBanner app={null} />);
      const btn = wrapper.find('.locksmith-pro-migration-banner__dismiss');
      expect(btn.prop('aria-label')).toBe('Dismiss migration banner');
    });
  });
});
