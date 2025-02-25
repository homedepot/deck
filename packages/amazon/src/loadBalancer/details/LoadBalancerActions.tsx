import { values } from 'lodash';
import React from 'react';
import { Dropdown } from 'react-bootstrap';

import type { Application } from '@spinnaker/core';
import {
  AddEntityTagLinks,
  ApplicationReader,
  HelpField,
  ManagedMenuItem,
  SETTINGS,
} from '@spinnaker/core';

import { AWSProviderSettings } from '../../aws.settings';
import { LoadBalancerTypes } from '../configure/LoadBalancerTypes';
import type { IAmazonLoadBalancer } from '../../domain';
import type { ILoadBalancerFromStateParams } from './loadBalancerDetails.controller';

export interface ILoadBalancerActionsProps {
  app: Application;
  loadBalancer: IAmazonLoadBalancer;
  loadBalancerFromParams: ILoadBalancerFromStateParams;
}

export interface ILoadBalancerActionsState {
  application: Application;
}

export class LoadBalancerActions extends React.Component<ILoadBalancerActionsProps, ILoadBalancerActionsState> {
  constructor(props: ILoadBalancerActionsProps) {
    super(props);

    const { app, loadBalancer } = this.props;

    let application: Application;

    const loadBalancerAppName = loadBalancer.name.split('-')[0];
    if (loadBalancerAppName === app.name) {
      // Name matches the currently active application
      application = app;
    } else {
      // Load balancer is a part of a different application
      ApplicationReader.getApplication(loadBalancerAppName)
        .then((loadBalancerApp) => {
          this.setState({ application: loadBalancerApp });
        })
        .catch(() => {
          // We should not "just use the current app" in place of the (missing) app
          // that the load balancer actually belongs.
          // Instead, the user should be forced to create the application of the orphaned load balancer.
          // Otherwise, there will be unexpected behavior.
        });
    }

    this.state = {
      application,
    };
  }

  public editLoadBalancer = (): void => {
    const { loadBalancer } = this.props;
    const { application } = this.state;
    const LoadBalancerModal = LoadBalancerTypes.find((t) => t.type === loadBalancer.loadBalancerType).component;
    LoadBalancerModal.show({ app: application, loadBalancer });
  };

  private entityTagUpdate = (): void => {
    this.props.app.loadBalancers.refresh();
  };

  public render() {
    const { app, loadBalancer } = this.props;
    const { application } = this.state;

    const { loadBalancerType, instances, instanceCounts } = loadBalancer;
    const loadBalancerAppName = loadBalancer.name.split('-')[0];

    const clbInstances =
      loadBalancerType === 'classic' && values(instanceCounts).filter((v: number | undefined) => v).length;
    const allowDeletion = !clbInstances && !instances.length;

    return (
      <div style={{ display: 'inline-block' }}>
        {AWSProviderSettings.adHocInfraWritesEnabled && (
          <Dropdown className="dropdown" id="load-balancer-actions-dropdown">
            <Dropdown.Toggle className="btn btn-sm btn-primary dropdown-toggle">
              <span>Load Balancer Actions</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu">
              {application && (
                <ManagedMenuItem resource={loadBalancer} application={app} onClick={this.editLoadBalancer}>
                  Edit Load Balancer
                </ManagedMenuItem>
              )}
              {!application && (
                <li className="disabled">
                  <a>
                    Edit Load Balancer{' '}
                    <HelpField
                      content={`The application <b>${loadBalancerAppName}</b> must be configured before this load balancer can be edited.`}
                    />
                  </a>
                </li>
              )}
              {!allowDeletion && (
                <li className="disabled">
                  <a>
                    Delete Load Balancer{' '}
                    <HelpField content="You must detach all instances before you can delete this load balancer." />
                  </a>
                </li>
              )}
              {SETTINGS && SETTINGS.feature.entityTags && (
                <AddEntityTagLinks
                  component={loadBalancer}
                  application={app}
                  entityType="loadBalancer"
                  onUpdate={this.entityTagUpdate}
                />
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    );
  }
}
