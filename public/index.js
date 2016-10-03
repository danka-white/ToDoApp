/**
 * Created by dana on 9/28/16.
 */

var toDo = angular.module("toDo", []);

toDo.factory('Tasks', ['$http', function ($http) {
  return $http.get('/tasks');
}]);

toDo.factory('deleteTask', ['$http', function ($http) {
  return function (id) {
    return $http.delete('/task/:' + id)
  }
}]);

toDo.factory('addTask', ['$http', function ($http) {
  return function (task) {
    return $http.post('/task', task);
  }
}]);

toDo.factory('updateTask', ['$http', function ($http) {
  return function (id, task) {
    return $http.put('/task/:' + id, task)
  }
}]);

toDo.directive('ngBlur', ['$parse', function ($parse) {
  return function (scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.on('blur', function (event) {
      scope.$apply(function () {
        fn(scope, {$event: event});
      });
    });
  };
}]);

toDo.controller('TaskController', [
  '$scope', 'Tasks', 'deleteTask', 'addTask', 'updateTask',
  function ($scope, Tasks, deleteTask, addTask, updateTask) {
    //get tasks
    Tasks.success(function (data) {
      $scope.tasks = data;
    }).error(function () {
      $scope.tasks = [];
    });
    //show field for entering new task
    $scope.addNewTask = function () {
      $scope.newTask = true;
    };
    //cancel entering new task
    $scope.cancel = function () {
      $scope.newTask = false;
      $scope.item = null;
    };
    //add task
    $scope.addItem = function (desc) {
      if (desc.length > 0) {
        var item = {id: '', desc: desc, done: 'not-done'};
        var lastInd = $scope.tasks.length - 1;
        var id = +$scope.tasks[lastInd].id + 1;// generate id:  nextId = lastId+1
        item.id = id.toString();

        addTask(item).then(function (response) {
          if (response.data.status == "inserted") {
            $scope.tasks.push(item);
            $scope.desc = null;
          }
        });
      }
    };

    //deleteTask
    $scope.removeItem = function (id) {
      deleteTask(id).then(function (response) {
        if (response.data.status == "deleted") {
          $scope.tasks = $scope.tasks.filter(task => task.id != id);
        }
      });
    };
    //updateTask
    $scope.updateItem = function (task) {
      updateTask(task.id, task).then(function (response) {
        if (response.data.status == "updated") {
          /*$scope.tasks = $scope.tasks.filter(task => task.id != id);*/
        }
      });
    };
    $scope.test = function () {
      console.log("hello from test");
    };

// Helper method for calculating the total quantity of tasks
    $scope.total = function () {
      if ($scope.tasks !== undefined)
        return $scope.tasks.length;
    };
  }])
;
