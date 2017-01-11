"use strict";
var AnetUX = angular.module("UX_Components",['ngAnimate','ui.router','ui.mask']);
AnetUX.config(function($stateProvider,$urlRouterProvider) {
	$urlRouterProvider.otherwise("home");
	$stateProvider
		// route for the settings page
		.state('acceptjs', {
			url:"/acceptjs",
			templateUrl : 'AcceptCheckoutjs.html'
			//controller  : 'address'
		})
		.state('home', {
			url:"/home",
			templateUrl : 'home.html'
			//controller  : 'aboutController'
		})
		.state('acceptjsdemo', {
			url:"/acceptjsdemo",
			templateUrl : 'acceptjs.html',
			
			//controller  : 'aboutController'
		})
		.state('AcceptUI', {
			url:"/AcceptUI",
			templateUrl : 'acceptUICheckout.html'
			//controller  : 'aboutController'
		})
		.state('AcceptUIForm', {
			url:"/AcceptUIForm",
			templateUrl : 'acceptUITestPage.html'
			//controller  : 'aboutController'
		})
		
});
AnetUX.controller("paymentController",['$scope',function($scope){
	$scope.opt = {
	    "Fields": {
	        "fax": {
	            "active": "false"
	        },
	        "cvv": {
	            "value": ""
	        },
	        "month": {
	            "value": "12"
	        }
	    },
	    "saveCallback": "mySaveFunction",
	    "cancelCallback": "myCancelFunction"
	};
	$scope.mySaveFunction = function(opt){
		console.log("I am called with "+opt.Fields.cvv);
		
	};
	$scope.myCancelFunction = function(opt){
		console.log("I am called with "+opt.Fields.cvv);
	}


}])