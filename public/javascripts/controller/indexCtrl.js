var socket = io.connect('', {
        reconnect: false
    });

    socket.on('disconnect', function() {
        setTimeout(reconnect, 500);
    });

    var app = angular.module('app', []);
    app.directive('stat', function() {
        return {
            restrict : 'E',
            template : '<p> {{ phrase | uppercase }} {{ data }}</p>',
            link : function($scope, element) {
                $scope.phrase = 'ценят:';
                plus = true;
                socket.on('count', function (data) {
                    $scope.data = data.data;
                    $scope.$apply();
                    console.log(data);
                });

            }
        }
    })
    function reconnect() {
        socket.once('error', function() {
            setTimeout(reconnect, 500);
        });
        socket.socket.connect();
    }