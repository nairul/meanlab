angular
  .module("voteFunny", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    Router
  ])
  .factory("Show", [
    "$resource",
    Show
  ])
  .controller("indexCtrl", [
    "$state",
    "Show",
    indexController
  ])
  .controller("showCtrl", [
    "$stateParams",
    "Show",
    showController
  ])

  function Router ($stateProvider) {
    $stateProvider
      .state("index", {
        url: "/shows",
        templateUrl: "/assets/js/ng-views/index.html",
        controller: "indexCtrl",
        controllerAs: "vm"
      })
      .state("show", {
        url: "/shows/:name",
        templateUrl: "/assets/js/ng-views/show.html",
        controller: "showCtrl",
        controllerAs: "vm"
      })
  }

  function Show ($resource) {
    return $resource("/api/shows/:name", {}, {
      update: { method: "PUT" }
    });
  }

  function indexController ($state, Show) {
    this.shows = Show.query()
    this.newShow = new Show()
    this.create = function () {
      this.newShow.$save().then(function(show){
        $state.go("show", { name: show.name} )
      })
    }
  }

  function showController ($stateParams, Show) {
    this.show = Show.get({name: $stateParams.name})
    this.update = function () {
      this.show.$update({name: $stateParams.name})
    }
  }