var AnetHostedProfile = angular.module("HostedProfileApp",['anetPayment']);
AnetHostedProfile.controller('mainController',['$scope', function($scope){
    "use strict";
    
    $scope.showComponent = true ;
    createPaymentConfigObj();
    function createPaymentConfigObj(){
        $scope.paymentOpt = {};
        $scope.paymentOpt.creditCard = {};
        $scope.paymentOpt.creditCard.label = "CARD NUMBER";
        $scope.paymentOpt.creditCard.placeHolder = "1234 5678 9012 3456";
        $scope.paymentOpt.creditCard.errorText = "PLEASE ENTER CORRECT CARD NUMBER";
        $scope.paymentOpt.creditCard.model = "";

        $scope.paymentOpt.expDate = {};
        $scope.paymentOpt.expDate.label = "EXP. DATE";
        $scope.paymentOpt.expDate.placeHolder = "MM/YY";
        $scope.paymentOpt.expDate.errorText = "PLEASE ENTER CORRECT DATE";
        $scope.paymentOpt.expDate.model = "";


        $scope.paymentOpt.cvv = {};
        $scope.paymentOpt.cvv.label = "CARD CODE";
        $scope.paymentOpt.cvv.placeHolder = "CVV";
        $scope.paymentOpt.cvv.model = "";
        $scope.paymentOpt.cvv.isReadonly = false;
        
        $scope.paymentOpt.cvv.isRequired = true;
    }

    
}]);
