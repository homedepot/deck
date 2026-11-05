import { mount, shallow } from 'enzyme';
import React from 'react';

import { SecureFlowEnforcementBanner } from './SecureFlowEnforcementBanner';

const STORAGE_KEY = 'secureFlowEnforcementBannerDismissed';

describe('<SecureFlowEnforcementBanner />', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('visibility', () => {
    it('renders the banner when not previously dismissed', () => {
      const wrapper = shallow(<SecureFlowEnforcementBanner app={null} />);
      expect(wrapper.find('.secure-flow-enforcement-banner').length).toEqual(1);
    });

    it('renders nothing when the user previously dismissed it', () => {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      const wrapper = shallow(<SecureFlowEnforcementBanner app={null} />);
      expect(wrapper.find('.secure-flow-enforcement-banner').length).toEqual(0);
    });
  });

  describe('dismiss behavior', () => {
    it('hides the banner when the dismiss button is clicked', () => {
      const wrapper = mount(<SecureFlowEnforcementBanner app={null} />);
      wrapper.find('.secure-flow-enforcement-banner__dismiss').simulate('click');
      expect(wrapper.find('.secure-flow-enforcement-banner').length).toEqual(0);
    });

    it('persists dismissal to sessionStorage when dismissed', () => {
      const wrapper = mount(<SecureFlowEnforcementBanner app={null} />);
      wrapper.find('.secure-flow-enforcement-banner__dismiss').simulate('click');
      expect(sessionStorage.getItem(STORAGE_KEY)).toBe('true');
    });
  });

  describe('content', () => {
    it('renders the enforcement message', () => {
      const wrapper = shallow(<SecureFlowEnforcementBanner app={null} />);
      expect(wrapper.find('.secure-flow-enforcement-banner__content').text()).toContain(
        'Mandatory Secure Flow enforcement is in effect.',
      );
    });

    it('renders the docs link with the correct href', () => {
      const wrapper = shallow(<SecureFlowEnforcementBanner app={null} />);
      const links = wrapper.find('.secure-flow-enforcement-banner__link');
      const docsLink = links.filterWhere((l) => l.text().includes('Secure Flow Migration Guide'));
      expect(docsLink.prop('href')).toBe(
        'https://thd.atlassian.net/wiki/spaces/DevTools/pages/2713027493/Secure+Flow+Migration',
      );
    });

    it('renders the Slack support link with the correct href', () => {
      const wrapper = shallow(<SecureFlowEnforcementBanner app={null} />);
      const links = wrapper.find('.secure-flow-enforcement-banner__link');
      const slackLink = links.filterWhere((l) => l.text().includes('Slack support channel'));
      expect(slackLink.prop('href')).toBe('https://thd.enterprise.slack.com/archives/C08JLDB2JUU');
    });

    it('renders both links opening in a new tab safely', () => {
      const wrapper = shallow(<SecureFlowEnforcementBanner app={null} />);
      const links = wrapper.find('.secure-flow-enforcement-banner__link');
      expect(links.length).toEqual(2);
      links.forEach((link) => {
        expect(link.prop('target')).toBe('_blank');
        expect(link.prop('rel')).toBe('noopener noreferrer');
      });
    });

    it('has accessible dismiss button label', () => {
      const wrapper = shallow(<SecureFlowEnforcementBanner app={null} />);
      const btn = wrapper.find('.secure-flow-enforcement-banner__dismiss');
      expect(btn.prop('aria-label')).toBe('Dismiss Secure Flow banner');
    });
  });
});
