import React from 'react';

import { Dropdown } from 'react-bootstrap';

import type { Application, ILoadBalancer } from '@spinnaker/core';

export interface ICloudFoundryLoadBalancerActionsProps {
  application: Application;
  loadBalancer: ILoadBalancer;
}

export class CloudFoundryLoadBalancerActions extends React.Component<ICloudFoundryLoadBalancerActionsProps> {
  public render(): JSX.Element {
    return (
      <div className="actions">
        <Dropdown className="dropdown" id="instance-actions-dropdown">
          <Dropdown.Toggle className="btn btn-sm btn-primary dropdown-toggle">Load Balancer Actions</Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu">
            <li className="disabled"><a>Delete Load Balancer</a></li>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}
