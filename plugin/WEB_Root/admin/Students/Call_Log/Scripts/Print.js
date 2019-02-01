define(['angular', 'components/shared/index'], function (angular) {
    var printApp = angular.module('printApp', ['powerSchoolModule']);

    //This will create a controller which will be used in our app
    printApp.controller('printController', function ($scope, getService) {

        $scope.data = [];

        getService.getData('/admin/students/RSPE/scripts/printRSPE.json?DCID=' + $j('#DCID').html() + '&ID=' + $j('#ID').html()).then(function (retData) {
            retData.pop();
            $scope.data = retData[0];

            $scope.data.age = 0;

            var today = new Date();

            var birthDate = new Date($scope.data.dob);

            var age = today.getFullYear() - birthDate.getFullYear();

            var m = today.getMonth() - birthDate.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {

                age--;

                if (m < 0) {

                    m = 12 + m

                }

            }

            $scope.data.age = age + " years " + m + " months";
            
        });

        


    }); //Close controller

    printApp.factory('getService', function ($http) {
        return {
            getData: function (dataFile) {
                //Return promise directly
                return $http.get(dataFile).then(function (result) {
                    return result.data;
                });
            }
        };
    }); //Close Factory

    printApp.filter('ampersand', function () {
        return function (input) {
            return input ? input.replace(/&amp;/, '&') : '';
        }
    });

});