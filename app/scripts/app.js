'use strict';

/**
 * @ngdoc overview
 * @name reactLeadApp
 * @description
 * # reactLeadApp
 *
 * Main module of the application.
 */
angular
  .module('reactLeadApp', [
    'ngCookies',
    'ui.router',
    'restangular',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.cellNav',
    'reactLead.controllers',
    'reactLead.services'
  ])
  .run(function() {

  });