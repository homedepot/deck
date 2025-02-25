'use strict';

import * as angular from 'angular';

import { InfrastructureCaches, TaskExecutor } from '@spinnaker/core';

export const GOOGLE_LOADBALANCER_CONFIGURE_HTTP_HTTPLOADBALANCER_WRITE_SERVICE =
  'spinnaker.deck.gce.httpLoadBalancer.write.service';
export const name = GOOGLE_LOADBALANCER_CONFIGURE_HTTP_HTTPLOADBALANCER_WRITE_SERVICE; // for backwards compatibility
angular
  .module(GOOGLE_LOADBALANCER_CONFIGURE_HTTP_HTTPLOADBALANCER_WRITE_SERVICE, [])
  .factory('gceHttpLoadBalancerWriter', function () {
    function upsertLoadBalancers(loadBalancers, application, descriptor) {
      loadBalancers.forEach((lb) => {
        angular.extend(lb, {
          type: 'upsertLoadBalancer',
          cloudProvider: 'gce',
          loadBalancerName: lb.name,
        });
      });

      InfrastructureCaches.clearCache('backendServices');
      InfrastructureCaches.clearCache('healthChecks');

      return TaskExecutor.executeTask({
        job: loadBalancers,
        application: application,
        description: `${descriptor} Load Balancer: ${loadBalancers[0].urlMapName}`,
      });
    }

    return { upsertLoadBalancers };
  });
