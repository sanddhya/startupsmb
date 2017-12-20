startupSmb.directive('accessibleForm', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            // set up event handler on the form element
            elem.on('submit', function () {
                // find the first invalid element
                var firstInvalid = elem[0].querySelector('.ng-invalid');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
}]);

startupSmb.directive('passwordVerify', [function passwordVerify() {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('passwordVerify', function (val) {
                validate();
            });

            var validate = function () {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.passwordVerify;

                // set validity
                ngModel.$setValidity('passwordVerify', val1 == val2);
            };
        }
    }
}]);

startupSmb.directive('passwordReveal', ['$compile',function ($compile) {
    return {
        restrict: 'C',
        scope:{},
        link: function (scope, elem) {
            var html = '<a class="showHideText small" ng-click="toggle()">Show</a>';
            var compiledElement = $compile(html)(scope);
            elem.append(compiledElement);
            scope.toggle = function(){
                if(elem.find('a').text() == 'Show'){
                    elem.find('a').text('Hide');
                    elem.find('input').attr('type','text');
                }else{
                    elem.find('a').text('Show');
                    elem.find('input').attr('type','password');
                }
                
            }
        }
    };
}]);