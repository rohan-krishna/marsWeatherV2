// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.factory('marsDataService', function($http) {
  var BASE_URL = 'http://marsweather.ingenology.com/v1/latest/';
  var data = '';

  return {
    GetData : function() {
      return $http.get(BASE_URL).then(function(response) {
        data = response;
        return data;
      });
    }
  }
})
.controller('MainCtrl', function($scope,marsDataService,$cordovaNetwork, $rootScope, $ionicPlatform, $ionicPopup) {

  $scope.weather = '';
  marsDataService.GetData().then(function(data) {
    $scope.weather = data;
    $scope.temp = (data.data.report.min_temp + data.data.report.max_temp ) / 2;
  });

  $scope.doRefresh = function() {
    marsDataService.GetData().then(function(data) {
      $scope.weather = data;
      $scope.temp = (data.data.report.min_temp + data.data.report.max_temp ) / 2;

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $ionicPlatform.ready(function() {
    $scope.network = $cordovaNetwork.getNetwork();
    $scope.isOnline = $cordovaNetwork.isOnline();

    if(!$cordovaNetwork.isOnline()) {
      $ionicPopup.alert({
        title: 'Sorry, no network!',
        subTitle: 'Please connect to internet and Pull-Down to refresh.',
        okText: 'Alright!',
        okType: 'button-positive'
      });
    }
  });
})
