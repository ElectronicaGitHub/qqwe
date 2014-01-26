var app = angular.module('app', ['infinite-scroll' ,'ngAnimate']);


app.config(function($sceProvider) {
    $sceProvider.enabled(false);
});

app.controller('indexCtrl', function ($scope, $http) {
    var device = window.device; 

    $scope.feed = [];
    $scope.clearColumns = function() {
        $scope.column_1 = [];
        $scope.column_2 = [];
        $scope.column_3 = [];
    }
    $scope.clearColumns();
    var flag = 0,
        page = 0;

    if (device != 'PC') {
        var quantity = 15;
    } else {
        var quantity = 3; 
    }
    $scope.themeFlag = false;
    $scope.theme = '';
    var dontLoad = false;

    $scope.getAll = function() {
         if (!$scope.themeFlag) {
            url = '/dynamic/newsaddevice/' + page + '/' + quantity;
        }
        if ($scope.themeFlag) {
            url = '/dynamic/newsaddevice/' + page + '/' + quantity + '/' + $scope.theme;
        }
        if (dontLoad) { return 0 }
        $http.get(url)
        .success( function (result) {
            console.log(result)
            $scope.feed = result;
            for (_new in $scope.feed) {
                if (flag === 0) {
                    $scope.column_1.push($scope.feed[_new]);
                    flag = 1;
                } else if (flag === 1) {
                    $scope.column_2.push($scope.feed[_new]);
                    flag = 0;
                }
            }
            if ($scope.feed < quantity) { dontLoad = true; }
            page += 1;
        })
        .error(function (result) {
            console.log(result)
        })  
    }
    if (device != "PC") {
        window.onscroll = function() {
            $scope.getAll();
        }
    }

    $scope.get6 = function() {
        $scope.get3();
        $scope.get3();     
    }
    $scope.get3 = function() {
        if (!$scope.themeFlag) {
            url = '/dynamic/newsadd/' + page + '/' + quantity;
        }
        if ($scope.themeFlag) {
            url = '/dynamic/newsadd/' + page + '/' + quantity + '/' + $scope.theme;
        }
        console.log(url)
        $http.get(url)
            .success( function (result) {
                console.log(result)
                $scope.feed = result;
                for (_new in $scope.feed) {
                    if (flag === 0) {
                        $scope.column_1.push($scope.feed[_new]);
                        flag = 1;
                    } else if (flag === 1) {
                        $scope.column_2.push($scope.feed[_new]);
                        flag = 2;
                    } else if (flag === 2) {
                        $scope.column_3.push($scope.feed[_new]);
                        flag = 0;
                    }
                }
            })
            .error(function (result) {
                console.log(result)
            })          
        page += 1;
    }
    $scope.themeChange = function(theme) {
        page = 0;
        $scope.themeFlag  = true;
        $scope.theme = theme;
        $scope.clearColumns();
        if (device !='PC') {
            $scope.getAll();
        } else {
            $scope.get6();
        }
    }
    $scope.themeAll = function() {
        page = 0;
        $scope.themeFlag = false;
        $scope.clearColumns();
        if (device !='PC') {
            $scope.getAll();
        } else {
            $scope.get6();
        }
    }
    $scope.setClass = function(type) {
        if (type == 'other' || type == 'fashion' || type == 'art' || type == 'features' || type == 'craft') {
            return 'whited'
        } else {
            return 'blacked'
        }
    }

});


app.directive('feedelem', function() {
    return {
        restrict : 'E',
        scope: '=',
        templateUrl : 'feedElement.html',
        link : function(scope, elem) {
            $('.content').imagesLoaded(function(){
                $('.img-wrapper').each(function() {
                    var a = $( this ).children('img').height();
                    var imgHeight = a;
                    a = imgHeight;
                    $( this ).height(imgHeight);
                })
            });
            console.log(scope.block.type)
        }
    }
})
app.filter("decode",function(){
    return function (str){ 
        var el = document.createElement("p");
        el.innerHTML = str;
        str =  el.innerText || el.textContent;
        return str;
    }
})
