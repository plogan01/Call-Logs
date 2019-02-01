define(['angular', 'components/shared/index'], function (angular) {

    /*Create module. rspeApp must match name in html file*/
    var rspeApp = angular.module('rspeApp', ['powerSchoolModule']);

    //This will create a controller which will be used in our app
    rspeApp.controller('rspeController', function ($rootScope, $scope, $compile, getService, postService) {

        loadingDialog();

        $scope.Log = [];

        getService.getData('/admin/students/RSPE/scripts/logCat.json').then(function (retData) {
            retData.pop();
            $scope.Log = retData;

            $scope.StudentLogs = [];

            getService.getData('/admin/students/RSPE/scripts/student_RSPE.json?id=' + $j('#dcid').html() + '&cat=' + $scope.Log[0].ID).then(function (retData) {
                retData.pop();
                $scope.StudentLogs = retData;

            });
        });

        closeLoading();

        $scope.sort = 'date';
        $scope.sortReverse = false;
        $scope.clearFilter = function () {
            $scope.search = {};
        };


        //Submit Data
        $scope.logSubmit = function (formID) {
			$scope.missing = 0;
			$j('[required]:visible').each(function(){
				if($j(this).val() == '' || $j(this).val().trim().length < 1){
					$j(this).css("background-color", "yellow");
					$j('#warning').removeClass('hidden');
					$scope.missing++
				}
			});
			if($scope.missing == 0){
				var dataString = $j(formID).serialize();
                var postURL = '/admin/students/RSPE/scripts/student_RSPE.json?id=' + $j('#dcid').html() + '&cat=' + $scope.Log[0].ID;
				postService.postData(postURL, dataString).then(function (retData) {
					retData.pop();
					$scope.StudentLogs = retData;
					psDialogClose();
				});
			}
        };

        $scope.logDelete = function (formID) {
            var dataString = $j(formID).serialize();
            var postURL = '/admin/students/RSPE/scripts/student_RSPE.json?dcid=' + $j('#dcid').html() + '&cat=' + $scope.Log[0].ID;
            postService.postData(postURL, dataString).then(function (retData) {
                retData.pop();
                $scope.StudentLogs = retData;
                psDialogClose();
            });
        };

        //Open Dialog Control
        $scope.openDialog = function (id, url) {
            $rootScope.currentID = id;
            $rootScope.currenturl = url;
            var dialogContent = '<div class="dialogContent hide"></div>';
            angular.element('body').append(dialogContent);
            $compile(dialogContent)($scope);
        };  //Close Dialog Control
 
    }); //Close controller

    rspeApp.directive('dialogContent', function ($rootScope, $compile) {
        return {
            restrict: "C",
            templateUrl: function (element, args) {
                return $rootScope.currenturl + $rootScope.currentID + '&rnd=' + Math.floor(Math.random() * Math.pow(2, 32));
            },

            link: function (scope, element, args) {
                psDialog({ content: element.detach().removeClass('hide'), type: "dialogM", docked: "east" });
            }
        }

    }); //Close directive

    rspeApp.factory('getService', function ($http) {
        return {
            getData: function (dataFile) {
                //Return promise directly
                return $http.get(dataFile).then(function (result) {
                    return result.data;
                });
            }
        };
    }); //Close Factory

    rspeApp.factory('postService', function ($http) {
        //return the promise directly
        return {
            postData: function (retUrl, postStr) {
                return $http.post(retUrl, postStr, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (postResult) {
                    return postResult.data;
                });
            }
        };
    }); //Close post factory


    rspeApp.filter('unique', function () {
        return function (input, key) {
            var unique = {};
            var uniqueList = [];
            for (var i = 0; i < input.length; i++) {
                if (typeof unique[input[i][key]] == "undefined") {
                    unique[input[i][key]] = "";
                    uniqueList.push(input[i]);
                }
            }
            return uniqueList;
        };
    });

    rspeApp.filter('ampersand', function () {
        return function (input) {
            return input ? input.replace(/&amp;/, '&') : '';
        }
    });

}); //Close define