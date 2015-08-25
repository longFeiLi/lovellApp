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
    'reactLead.controllers',
    'reactLead.services'
  ])
  .run(function () {

  });
