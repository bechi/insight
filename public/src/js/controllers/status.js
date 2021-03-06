'use strict';

angular.module('insight.status').controller('StatusController',
  function($scope, $routeParams, $location, Global, Status, Sync, getSocket) {
    $scope.global = Global;

    $scope.getStatus = function(q) {
      Status.get({
          q: 'get' + q
        },
        function(d) {
          $scope.loaded = 1;
          angular.extend($scope, d);
        },
        function(e) {
          $scope.error = 'API ERROR: ' + e.data;
        });
    };

    var _onSyncUpdate = function(sync) {
      $scope.sync = sync;
    };

    $scope.getSync = function() {
      Sync.get({},
        function(sync) {
          _onSyncUpdate(sync);
        },
        function(e) {
          var err = 'Could not get sync information' + e.toString();
          $scope.sync = {
            error: err
          };
        });
    };

    var socket = getSocket($scope);
    socket.on('connect', function() {
      socket.emit('subscribe', 'sync');
      socket.on('status', function(sync) {
        _onSyncUpdate(sync);
      });
    });

    socket.on('status', function(sync) {
      _onSyncUpdate(sync);
    });
  });
