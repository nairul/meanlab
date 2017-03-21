angular
  .module("voteFunny", [
    "ui.router",
    "ngResource",
    "ngSanitize"
  ])
  .config([
    "$stateProvider",
    Router
  ])
  .config(
    function($sceDelegateProvider){
       $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://www.youtube.com/**'
  ]);
    }
  )
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
    "$state",
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

  function showController ($state, $stateParams, Show) {
    this.show = Show.get({name: $stateParams.name})
    this.vote = function () {
      this.show.vote += 1
      this.show.$update({name: $stateParams.name})
    }
    this.update = function () {
      this.show.$update({name: $stateParams.name})
    }
    this.destroy = function () {
    this.show.$delete({name: $stateParams.name}).then(function(){
        $state.go("index")
      })
    }
  }