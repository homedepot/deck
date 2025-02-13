import type { StateService } from '@uirouter/angularjs';
import type { IController, IScope } from 'angular';
import { module } from 'angular';
import type { IModalService } from 'angular-ui-bootstrap';
import { cloneDeep } from 'lodash';

import type { Application, ILoadBalancer } from '@spinnaker/core';
import type { ICloudrunLoadBalancer } from '../../common/domain/index';

interface ILoadBalancerFromStateParams {
  accountId: string;
  region: string;
  name: string;
}

class CloudrunLoadBalancerDetailsController implements IController {
  public state = { loading: true };
  private loadBalancerFromParams: ILoadBalancerFromStateParams;
  public loadBalancer: ICloudrunLoadBalancer;

  public static $inject = ['$uibModal', '$state', '$scope', 'loadBalancer', 'app'];
  constructor(
    private $uibModal: IModalService,
    private $state: StateService,
    private $scope: IScope,
    loadBalancer: ILoadBalancerFromStateParams,
    private app: Application,
  ) {
    this.loadBalancerFromParams = loadBalancer;
    this.app
      .getDataSource('loadBalancers')
      .ready()
      .then(() => this.extractLoadBalancer());
  }

  // edit loadbalancer to change traffic

  public editLoadBalancer(): void {
    this.$uibModal.open({
      templateUrl: require('../configure/wizard/wizard.html'),
      controller: 'cloudrunLoadBalancerWizardCtrl as ctrl',
      size: 'lg',
      resolve: {
        application: () => this.app,
        loadBalancer: () => cloneDeep(this.loadBalancer),
        isNew: () => false,
        forPipelineConfig: () => false,
      },
    });
  }

  private extractLoadBalancer(): void {
    this.loadBalancer = this.app.getDataSource('loadBalancers').data.find((test: ILoadBalancer) => {
      return test.name === this.loadBalancerFromParams.name && test.account === this.loadBalancerFromParams.accountId;
    }) as ICloudrunLoadBalancer;

    if (this.loadBalancer) {
      this.state.loading = false;
      this.app.getDataSource('loadBalancers').onRefresh(this.$scope, () => this.extractLoadBalancer());
    } else {
      this.autoClose();
    }
  }

  private autoClose(): void {
    if (this.$scope.$$destroyed) {
      return;
    } else {
      this.$state.params.allowModalToStayOpen = true;
      this.$state.go('^', null, { location: 'replace' });
    }
  }
}

export const CLOUDRUN_LOAD_BALANCER_DETAILS_CTRL = 'spinnaker.cloudrun.loadBalancerDetails.controller';
module(CLOUDRUN_LOAD_BALANCER_DETAILS_CTRL, []).controller(
  'cloudrunLoadBalancerDetailsCtrl',
  CloudrunLoadBalancerDetailsController,
);
