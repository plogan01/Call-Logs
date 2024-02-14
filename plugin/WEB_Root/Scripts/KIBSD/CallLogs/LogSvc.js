define(['angular', 'components/shared/index'], function (angular) {

    /*Create module. logApp must match name in html file*/
    var logApp = angular.module('logApp', ['powerSchoolModule']);

    //This will create a controller which will be used in our app
    logApp.controller('logController', function ($rootScope, $scope, $compile, getService, postService) {
        $scope.studentfrn = '001' + $j('#dcid').val();
        loadingDialog();

        getService.getData('/admin/students/call_log/json/logCat.json').then(function (retData) {
            retData.pop();
            $scope.Log = retData[0].ID;

            $scope.StudentLogs = [];

            getService.getData('/admin/students/call_log/json/call_log.json?id=' + $j('#id').html() + '&cat=' + $scope.Log).then(function (retData) {
                retData.pop();
                $scope.StudentLogs = retData;

            });
        });

        closeLoading();

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
                var postURL = '/admin/students/call_log/json/call_log.json?id=' + $j('#id').html() + '&cat=' + $scope.Log;
				postService.postData(postURL, dataString).then(function (retData) {
					retData.pop();
					$scope.StudentLogs = retData;
					psDialogClose();
				});
			}
        };

        $scope.logDelete = function (formID) {
            var dataString = $j(formID).serialize();
            var postURL = '/admin/students/call_log/json/call_log.json?dcid=' + $j('#id').html() + '&cat=' + $scope.Log;
            postService.postData(postURL, dataString).then(function (retData) {
                retData.pop();
                $scope.StudentLogs = retData;
                psDialogClose();
            });
        };

        //Open Dialog Control
        $scope.openDialog = function (id) {
            $rootScope.currenturl = 'logedit.html?logTypeId=' + $scope.Log + '&frn=008' + id;
            var dialogContent = '<div class="dialogContent hide"></div>';
            angular.element('body').append(dialogContent);
            $compile(dialogContent)($scope);
        };  //Close Dialog Control
 
    }); //Close controller

    logApp.directive('dialogContent', function ($rootScope, $compile) {
        return {
            restrict: "C",
            templateUrl: function (element, args) {
                return $rootScope.currenturl + '&rnd=' + Math.floor(Math.random() * Math.pow(2, 32));
            },

            link: function (scope, element, args) {
                psDialog({ content: element.detach().removeClass('hide'), type: "dialogM", docked: "east" });
            }
        }

    }); //Close directive

    logApp.factory('getService', function ($http) {
        return {
            getData: function (dataFile) {
                //Return promise directly
                return $http.get(dataFile).then(function (result) {
                    return result.data;
                });
            }
        };
    }); //Close Factory

    logApp.factory('postService', function ($http) {
        //return the promise directly
        return {
            postData: function (retUrl, postStr) {
                return $http.post(retUrl, postStr, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (postResult) {
                    return postResult.data;
                });
            }
        };
    }); //Close post factory

    logApp.filter('ampersand', function () {
        return function (input) {
            return input ? input.replace(/&amp;/, '&') : '';
        }
    });

}); //Close define