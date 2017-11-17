
var anetPay = angular.module('anetPayment',[]);

/* Form component */
   anetPay.directive('anetPaymentForm', ['$window', function($window) { 
   "use strict";
    function paymentFormController($scope){
      var link=document.createElement('link');
      link.href='paymentComponent/1_0/assets/paymentForm.css';
      link.rel='stylesheet';
      var length = document.getElementsByTagName('head')[0].getElementsByTagName('link').length-1  ;
      var lastElement = angular.element(document.getElementsByTagName('head')[0].getElementsByTagName('link')[length]);
      $(link).insertAfter(lastElement);
      $scope.isValidCreditCard = true;
      $scope.isValidExpDate = true;

      $scope.isBrowserIE9 = function (){
        var doc = $window.document;
        var isIE9 = (!!doc.documentMode) ? ((doc.documentMode === 9) ? true : false) : false ;
        return isIE9;
      };

      $scope.getIE9LabelClass = function (flag , isValid){
        var labelClass = flag === true ? 'ie9FocusInLabelClass label-color' : 'ie9FocusOutLabelClass' ;
        labelClass = isValid === false ? 'ie9FocusInErrorLabelClass' : labelClass ;
        return labelClass;
      };

    }
    paymentFormController.$inject = ['$scope'];
    return { 
        restrict: 'E', 
        templateUrl: 'paymentComponent/1_0/assets/paymentForm.html',
        scope:{ opt:'='
        }, 
         replace:true,
        controller:paymentFormController
    };    
  }]);

anetPay.directive('showCardImage', [function() {
	"use strict";
    function showCardImageController($scope, $element, $attrs) {
      $scope.getCardIssuerImagePosition = function (){ 
          var pos =  $scope.getCardIssuer($scope.opt.creditCard.model);
          if($scope.isValidCreditCard){
            return pos;
          }
          else{
            return "-242px";
          }      
       };
      $scope.getCardIssuer = function(cardnum){
            cardnum =  typeof(cardnum) != "undefined" ? cardnum.replace(/\s*/g, '') : "";

              if (/^4[0-9]{6,}$/.test(cardnum)) {return "2px";} //Visa
              else if (/^5[1-5][0-9]{5,}$/.test(cardnum)) {return "-29px";} // mastercard
              else if (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(cardnum)) {return "-90px";} // discover
              else if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(cardnum)) { return "-151px";} // Diners Club 
              else if (/^3[47][0-9]{5,}$/.test(cardnum)) { return "-59px";} // amex 
              else if (/^(?:2131|1800|35\d{3})\d{11}$/.test(cardnum)){return "-121px";} //JCB
              else  return "-182px";
          };
  }
  showCardImageController.$inject = ['$scope', '$element', '$attrs'];
  return {
        restrict: 'A',
        template: '<div id="cardiconimg"  ng-attr-style="background: url(scripts/components/paymentComponent/1_0/assets/icons.png);background-position: {{getCardIssuerImagePosition()}};" class="CCImage"></div>', 
        controller: showCardImageController
  };
}]);


anetPay.directive('creditcardDirective', ['$timeout', function($timeout) {  
     "use strict";  
    function cardNumCtrl($scope, $element, $attrs){
      $scope.creditCardFocusOut = function (){
        $scope.hasCardFocus=false;
        angular.element('#cardNum').removeClass('bg-border-color') ;
        if( $scope.opt.creditCard.model.split(' ').join('').length < 13 || (! $scope.luhnCheck())){
          $scope.isValidCreditCard=false;
        }
        if($scope.opt.creditCard.model === 0 && $scope.isValidCreditCard){
          angular.element('#cardNum').attr("placeholder", ""); 
        }
      };

      $scope.getCreditCardClass = function (){
              var className = $scope.isValidCreditCard === false ? 'inValidBorderBottom' : '' ;
              return className ;
      };

      $scope.creditCardFocusIn = function (){
        $scope.hasCardFocus=true;
        angular.element('#cardNum').attr("placeholder", "1234 5678 9012 3456");
        if($scope.opt.creditCard.model && $scope.opt.creditCard.model.indexOf("XXXX") == 0){
          $scope.opt.creditCard.model = '';
          $scope.isValidCreditCard = true ;
        }
        if($scope.isValidCreditCard === true){
          angular.element('#cardNum').addClass('bg-border-color') ;
        } 
      };
      $scope.cardNumChange = function (){
          var number = $scope.opt.creditCard.model;
          
          // change $scope.opt.creditCard.model = $scope.formateNumber(number);
          var updatedNumber = $scope.formateNumber(number.replace(/[^0-9*]+/g, ''));
          var caretPosition;
          if (updatedNumber !== number) {
             caretPosition = $element[0].childNodes[0].selectionStart ;
             console.log(caretPosition)
              $scope.opt.creditCard.model = updatedNumber;
          }
          $timeout(function(args) {
            var $element=args[0],updatedNumber=args[1],number=args[2],caretPosition=args[3];
            if (typeof caretPosition === 'number') {
              if(updatedNumber.length === number.length+1 && number.length === caretPosition)
              { 
                $element[0].childNodes[0].selectionStart = $element[0].childNodes[0].selectionEnd = caretPosition+1;
              }
              else{
                  $element[0].childNodes[0].selectionStart = $element[0].childNodes[0].selectionEnd = caretPosition;
              }
            }
            number = $scope.opt.creditCard.model.replace(/[^0-9*]+/g, '');
            if(((/^4[0-9]{6,}$/.test(number)) || (/^5[1-5][0-9]{5,}$/.test(number)) || (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(number)) || (/^(?:2131|1800|35\d{3})\d{11}$/.test(number))) && number.length === 16){//Visa,MasterCard,Discover,JCB   
                $scope.moveFocus();
            }
            else if(/^3[47][0-9]{5,}$/.test(number) && number.length === 15){//amex
                $scope.moveFocus();
            }
            else if(/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(number) && number.length === 14){// Diners Club
                $scope.moveFocus();
            }  
          },10,false,[$element,updatedNumber,number,caretPosition]);

         
      };
      $scope.moveFocus = function(){
          var check = $scope.luhnCheck();
          $scope.isValidCreditCard=check;
            if(check){
              $timeout(function() {
                angular.element('#expiryDate').focus();
              },20);       
            }
      };

      $scope.getInputFieldClass = function (){
       var inputClass = ($scope.hasCardFocus === true || $scope.opt.creditCard.model.length !== 0) ? 'floating-placeholder-float-cc floating-placeholder-cc':($scope.isValidCreditCard === true ? 'floating-placeholder-cc' : 'floating-placeholder-float-cc floating-placeholder-cc') ;
       return inputClass ;
      };

      $scope.getCardLabelClass = function (){
        var inputclass = '';
        if($scope.hasCardFocus === undefined){
            if($scope.opt.creditCard.model.length !== 0){
              inputclass = 'cardScaleundefinedeffect';
            }
            else{
            inputclass = 'cardScaleundefinedEmptyeffect' ;
            }
          }
          else if($scope.hasCardFocus === true){
            inputclass = 'cardScaleundefinedeffect label-color' ;
          }
          else{
          inputclass = 'cardScaleundefinedeffect cardfocuscolorGreyEffect';
          }

          if($scope.isValidCreditCard === false){
          inputclass = 'errorLabelColor'; 
          }
        return inputclass;
      };

      $scope.luhnCheck = function (){
          // The Luhn Algorithm.
          var nCheck = 0,
              nDigit = 0,
              bEven = false,
          cardnumber = $scope.opt.creditCard.model.replace(/\D/g, "");
          for (var n = cardnumber.length - 1; n >= 0; n--) {
              var cDigit = cardnumber.charAt(n);
              nDigit = parseInt(cDigit, 10);
              if (bEven) {
                  if ((nDigit *= 2) > 9)
                      nDigit -= 9;
              }
              nCheck += nDigit;
              bEven = !bEven;
          }
          if ((nCheck % 10) !== 0) {     
              return false;
          }
          return true;
      };
      $scope.formateNumber = function (number){
          if (!number) { return ''; }
          number = String(number);
                 // Will return formattedNumber.
          var formattedNumber = number;
                 // VISA
          if (/^4[0-9]{6,}$/.test(number)) {
              var visa_firstFour = number.substring(0,4);
              var visa_secondFour = number.substring(4,8);
              var visa_thirdFour = number.substring(8,12);
              var visa_forthFour = number.substring(12,16);
              $scope.isValidCreditCard=true;
              if (visa_firstFour) {
                formattedNumber = visa_firstFour;
              }
              if (visa_secondFour) {
                formattedNumber += (' ' + visa_secondFour);
              }
              if (visa_thirdFour) {
                formattedNumber += (' ' + visa_thirdFour);
              }
              if (visa_forthFour) {
                formattedNumber += (' ' + visa_forthFour);
              }
            }

            // MasterCard
            if (/^5[1-5][0-9]{5,}$/.test(number)) {
              var masterCard_firstFour = number.substring(0,4);
              var masterCard_secondFour = number.substring(4,8);
              var masterCard_thirdFour = number.substring(8,12);
              var masterCard_forthFour = number.substring(12,16);
              $scope.isValidCreditCard=true;
              if (masterCard_firstFour) {
                formattedNumber = masterCard_firstFour;
              }
              if (masterCard_secondFour) {
                formattedNumber += (' ' + masterCard_secondFour);
              }
              if (masterCard_thirdFour) {
                formattedNumber += (' ' + masterCard_thirdFour);
              }
              if (masterCard_forthFour) {
                formattedNumber += (' ' + masterCard_forthFour);
              }
            }

            // Discover
            if (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(number)) {
              var discoverCard_firstFour = number.substring(0,4);
              var discoverCard_secondFour = number.substring(4,8);
              var discoverCard_thirdFour = number.substring(8,12);
              var discoverCard_forthFour = number.substring(12,16);
              $scope.isValidCreditCard=true;
              if (discoverCard_firstFour) {
                formattedNumber = discoverCard_firstFour;
              }
              if (discoverCard_secondFour) {
                formattedNumber += (' ' + discoverCard_secondFour);
              }
              if (discoverCard_thirdFour) {
                formattedNumber += (' ' + discoverCard_thirdFour);
              }
              if (discoverCard_forthFour) {
                formattedNumber += (' ' + discoverCard_forthFour);
              }
            }

          // Diners Club
          if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(number)) {
            var DinersCard_firstFour = number.substring(0,4);
            var DinersCard_secondFour = number.substring(4,8);
            var DinersCard_thirdFour = number.substring(8,12);
            var DinersCard_forthFour = number.substring(12,14);
            $scope.isValidCreditCard=true;
            if (DinersCard_firstFour) {
              formattedNumber = DinersCard_firstFour;
            }
            if (DinersCard_secondFour) {
              formattedNumber += (' ' + DinersCard_secondFour);
            }
            if (DinersCard_thirdFour) {
              formattedNumber += (' ' + DinersCard_thirdFour);
            }
            if (DinersCard_forthFour) {
              formattedNumber += (' ' + DinersCard_forthFour);
            }
          }

         // JCB
        if (/^(?:2131|1800|35\d{3})\d{11}$/.test(number)) {
          var jcbCard_firstFour = number.substring(0,4);
          var jcbCard_secondFour = number.substring(4,8);
          var jcbCard_thirdFour = number.substring(8,12);
          var jcbCard_forthFour = number.substring(12,16);
          $scope.isValidCreditCard=true;
          if (jcbCard_firstFour) {
            formattedNumber = jcbCard_firstFour;
          }
          if (jcbCard_secondFour) {
            formattedNumber += (' ' + jcbCard_secondFour);
          }
          if (jcbCard_thirdFour) {
            formattedNumber += (' ' + jcbCard_thirdFour);
          }
          if (jcbCard_forthFour) {
            formattedNumber += (' ' + jcbCard_forthFour);
          }
        }

        // AMEX
        if (/^3[47][0-9]{5,}$/.test(number)) {
          var amex_firstFour = number.substring(0,4);
          var amex_secondSix = number.substring(4,10);
          var amex_thirdFive = number.substring(10,15);
          $scope.isValidCreditCard=true;
          if (amex_firstFour) {
            formattedNumber = amex_firstFour;
          }
          if (amex_secondSix) {
            formattedNumber += (' ' + amex_secondSix);
          }
          if (amex_thirdFive) {
            formattedNumber += (' ' + amex_thirdFive);
          }
        }
        return formattedNumber;
        };
      }
cardNumCtrl.$inject=['$scope', '$element', '$attrs'];
  return {
    restrict: 'E',
    scope: false,
    template: '<input type="tel" id="cardNum" name="cardNum" ng-model="opt.creditCard.model"  my-maxlength="19"  ng-focus="creditCardFocusIn()" ng-blur="creditCardFocusOut()" ng-change="cardNumChange()" autocomplete="off"  autocorrect="off" autocapitalize="off" ng-class="getCreditCardClass()">',
    controller: cardNumCtrl
  };
}]);

anetPay.directive('expDate', ['$timeout', function($timeout) {
	"use strict";
   function expDateCtrl($scope, $element, $attrs){
     $scope.testExpDate = function (modelValue){
          var expiryArray = modelValue.split('/');
          var expMonthRegex =/^(0[1-9]|1[012])$/;
          var month = expiryArray[0];
          var year = expiryArray[1];    
          if(!expMonthRegex.exec(month) ){
                return false;
          }
          //debugger;
          var today, someday;
          today = new Date();

          if(year === undefined) return false; 
          
          year = year.length == 2 ? 20 + year : year;
          someday = new Date(year, month, 0);
          if (someday < today) {
            return false;
           }
        return true;
      };
      $scope.expDateFocusIn = function (){
        $scope.hasExpiryFocus=true;
        //$attrs['placeholder'] = 
        angular.element('#expiryDate').attr("placeholder", $scope.opt.expDate.placeHolder);
        if($scope.isValidExpDate === true){
          angular.element('#expiryDate').addClass('bg-border-color') ;
        } 
      };
      $scope.getExpInputFieldClass = function (){
        return ($scope.hasExpiryFocus === true || $scope.opt.expDate.model.length !== 0 || $scope.isValidExpDate === false ? 'floating-placeholder-float floating-placeholder':'floating-placeholder');
      };

       $scope.getExpDateLabelClass = function (flag , isValid){
        var labelClass = flag === true ? 'focuscolorEffect label-color' : 'focuscolorGreyEffect' ;
        labelClass = isValid === false ? 'errorLabelColor' : labelClass ;
        return labelClass;
      };

      $scope.getExpDateClass = function (){
              var className = $scope.isValidExpDate === false  ? 'inValidBorderBottom text-intent' : 'text-intent' ;
              return className ;
            };
    

      $scope.expDateFocusOut = function(){
         $scope.hasExpiryFocus=false;
         angular.element('#expiryDate').removeClass('bg-border-color');
        if($scope.opt.expDate.model!== undefined && $scope.opt.expDate.model.length === 0 ){
          angular.element('#expiryDate').attr("placeholder", $scope.opt.expDate.placeHolder);
          $scope.isValidExpDate= false;
        }
        else{
          if(! $scope.testExpDate($scope.opt.expDate.model)) {
             $scope.isValidExpDate= false;
          }
          else {
            $scope.isValidExpDate= true;
          }
        }
      };
        
    }
    expDateCtrl.$inject=['$scope', '$element', '$attrs'];
    return {
        restrict: 'E',
        scope: false,
        replace: true,
        controller: expDateCtrl,
        template: '<input type="tel" name="expiryDate" id="expiryDate" autocomplete="off"  autocorrect="off" autocapitalize="off" ng-focus = "expDateFocusIn()"  ng-blur="expDateFocusOut()" ng-model="opt.expDate.model" my-maxlength="5" ng-click="hasExpiryFocus=true"  ng-class="getExpDateClass()" ></input>',
        link: function(scope, element, attrs) {
          scope.$watch('opt.expDate.model', function(value, oldValue) {
            if (scope.opt.expDate.model=== undefined || scope.opt.expDate.model==="" || scope.opt.expDate.model.length !== element[0].selectionStart) return;
            var expDateLocal =  scope.opt.expDate.model;
          
            var date_array = expDateLocal.split("/");
            var month = date_array[0];
            var year = date_array[1] !== undefined ? date_array[1]: "";
            
            // non number handling
            month = isNaN(month)? month.substring(0, month.length - 1):month;
            year = isNaN(year) ? year.substring(0, year.length - 1) : year;
            
            expDateLocal = expDateLocal.replace(/[^0-9]+/g, ''); //getting the numbers only
            switch(expDateLocal.length)
            {
              case 1: // only one digit is there
                if(month>1 && month<=9)
                  month = '0'+month; 
                break;

              case 2:
                 if(oldValue.length==3) {
                    month = month.substring(0, 1); 
                  }
                  else if(month>12 || parseInt(month)<=0){
                   month = month.substring(0, month.length - 1);  
                  }          
                break;

              case 3:
                if(year==='0')
                  year='' ; 
                break;

              case 4:
                if(!scope.testExpDate(scope.opt.expDate.model))  year = year.substring(0, year.length - 1); 
                else{
                   scope.isValidExpDate = true; 
                   $timeout(function() {
                      angular.element('#cvv').focus();
                    },20) ;
                   } 
                break;
            }
            var oldExpirey = scope.opt.expDate.model;
            var caretPosition = element[0].selectionStart;
            if(month.length===2) month = month+"/";
            {
               scope.opt.expDate.model = month+year;
            }
            
            var expDateLocal = month+year;
            // fixing the curson position 
             $timeout(function(args) {
              var $element=args[0],newExp=args[1],oldExp=args[2],caretPosition=args[3];
              if (typeof caretPosition === 'number') {
                
                if(newExp.length === oldExp.length+1 && oldExp.length === caretPosition)
                { 
                  $element[0].selectionStart = $element[0].selectionEnd = caretPosition+1;
                }
                else{
                    $element[0].selectionStart = $element[0].selectionEnd = caretPosition;
                }
              }
            },10,false,[element,expDateLocal,oldExpirey,caretPosition]); 
            
          });  
    }
    };
}]);


anetPay.directive('myMaxlength', ['$compile', function($compile) {
	"use strict";
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
                var maxlength = parseInt(attrs.myMaxlength, 10);
                ctrl.$parsers.push(function (value) {
                    if (value.length > maxlength)
                    {
                        value = value.substr(0, maxlength);
                        ctrl.$setViewValue(value);
                        ctrl.$render();
                    }
                    return value;
                });
      }
    };
  }]);
  
  anetPay.directive('cvvInput', [function() {
	  "use strict";
    function cvvInputController($scope, $element, $attrs){
      $scope.validateCVV = function (){
                $scope.opt.cvv.model = $scope.opt.cvv.model.replace(/[^0-9]+/g, '');
      };
      $scope.cvvFocusIn = function (){
          angular.element('#cvv').attr("placeholder",  $scope.opt.cvv.placeHolder);
          $scope.hasCVVFocus=true;
          angular.element('#cvv').addClass('bg-border-color');
      };
  
      $scope.getCVVLabelClass = function (flag , isValid){
        var labelClass = flag === true ? 'focuscolorEffect label-color' : 'focuscolorGreyEffect' ;
        return labelClass;
      };

      $scope.getCVVInputFieldClass = function (){
       var inputClass = $scope.hasCVVFocus === true || $scope.opt.cvv.model.length !== 0 ? 'floating-placeholder-float floating-placeholder':'floating-placeholder' ;
       return inputClass ;
      };

      $scope.getCVVClass = function (){
              var className = $scope.isCVVMandatory === true ? 'inValidBorderBottom text-intent' : 'text-intent' ;
              return className ;
            };

      $scope.cvvFocusOut = function (){
        $scope.hasCVVFocus=false;
        angular.element('#cvv').removeClass('bg-border-color');
          if($scope.opt.cvv.model.length === 0){
            angular.element('#cvv').attr("placeholder", "");
          }
        $scope.isCVVMandatory = $scope.opt.cvv.isRequired && $scope.opt.cvv.model.length === 0 && $scope.opt.cvv.isReadonly === false  ? true : false ;
      };
    }
    cvvInputController.$inject = ['$scope','$element', '$attrs'];
    return {
        restrict: 'E',
        scope: false,
        replace: true,
        template: '<div><input id="cvv" ng-focus="cvvFocusIn()" ng-blur="cvvFocusOut()" ng-model="opt.cvv.model" my-maxlength="5" name="cvv" type="tel" autocomplete="off"  autocorrect="off" autocapitalize="off" ng-change="validateCVV()" ng-readonly="opt.cvv.isReadonly" ng-class="getCVVClass()"></input></div>',
    controller: cvvInputController
    };
}]);

