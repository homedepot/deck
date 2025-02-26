import type { IController, IScope } from 'angular';
import { module } from 'angular';
import type { Application, ILoadBalancer, IServerGroup } from '@spinnaker/core';
import { SERVER_GROUP_WRITER, ServerGroupReader } from '@spinnaker/core';
import type { ICloudrunServerGroup } from '../../interfaces';

interface IServerGroupFromStateParams {
  accountId: string;
  region: string;
  name: string;
}

class CloudrunServerGroupDetailsController implements IController {
  public state = { loading: true };
  public serverGroup: ICloudrunServerGroup;

  public static $inject = ['$state', '$scope', 'serverGroup', 'app'];
  constructor(
    private $state: any,
    private $scope: IScope,
    serverGroup: IServerGroupFromStateParams,
    public app: Application,
  ) {
    this.extractServerGroup(serverGroup)
      .then(() => {
        if (!this.$scope.$$destroyed) {
          this.app.getDataSource('serverGroups').onRefresh(this.$scope, () => this.extractServerGroup(serverGroup));
        }
      })
      .catch(() => this.autoClose());
  }

  private autoClose(): void {
    if (this.$scope.$$destroyed) {
      return;
    } else {
      this.$state.params.allowModalToStayOpen = true;
      this.$state.go('^', null, { location: 'replace' });
    }
  }

  private extractServerGroup({ name, accountId, region }: IServerGroupFromStateParams): PromiseLike<void> {
    return ServerGroupReader.getServerGroup(this.app.name, accountId, region, name).then(
      (serverGroupDetails: IServerGroup) => {
        let fromApp = this.app.getDataSource('serverGroups').data.find((toCheck: IServerGroup) => {
          return toCheck.name === name && toCheck.account === accountId && toCheck.region === region;
        });

        if (!fromApp) {
          this.app.getDataSource('loadBalancers').data.some((loadBalancer: ILoadBalancer) => {
            if (loadBalancer.account === accountId) {
              return loadBalancer.serverGroups.some((toCheck: IServerGroup) => {
                let result = false;
                if (toCheck.name === name) {
                  fromApp = toCheck;
                  result = true;
                }
                return result;
              });
            } else {
              return false;
            }
          });
        }

        this.serverGroup = { ...serverGroupDetails, ...fromApp };
        this.state.loading = false;
      },
    );
  }
}
export const CLOUDRUN_SERVER_GROUP_DETAILS_CTRL = 'spinnaker.cloudrun.serverGroup.details.controller';

module(CLOUDRUN_SERVER_GROUP_DETAILS_CTRL, [SERVER_GROUP_WRITER]).controller(
  'cloudrunV2ServerGroupDetailsCtrl',
  CloudrunServerGroupDetailsController,
);
