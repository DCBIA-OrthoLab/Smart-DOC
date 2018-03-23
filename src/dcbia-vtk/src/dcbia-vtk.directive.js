angular.module('dcbia-vtk-module')
.directive('dcbiaVtk', function($routeParams, $timeout, dcbiaVTKService) {

  function link($scope, $elem){

    if($scope.vtk === undefined){
      $scope.vtk = {};
    }

    $scope.initializeRenderWindow = function(){      

      $scope.vtk.rootContainer = $elem[0];        
      $scope.vtk.container = _.find($scope.vtk.rootContainer.getElementsByClassName('vtkViewPort'), function(node){
        return node.id == "vtk-vp";
      });

      _.extend($scope.vtk, dcbiaVTKService.initializeRenderWindow($scope.vtk.rootContainer, $scope.vtk.container));
                  
    }

    $scope.addActor = function(actor){
      if($scope.vtk.renderer && $scope.vtk.renderWindow){
        $scope.vtk.renderer.addActor(actor);
        $scope.vtk.renderWindow.render();
      }
    }

    $scope.removeActor = function(actor){
      if($scope.vtk.renderer && $scope.vtk.renderWindow){
        $scope.vtk.renderer.removeActor(actor);
        $scope.vtk.renderWindow.render();
      }
    }

    $scope.initializeRenderWindow();

    $scope.$watch(
      function (){
        return {
          width: $($scope.vtk.container).width(),
          height: $($scope.vtk.container).height(),
        }
      },
      function (size) {
        if(size.width != 100){
          var openGlRenderWindow = $scope.vtk.renderWindow.getViews()[0];
          openGlRenderWindow.setSize(size.width, size.height); 
          $scope.vtk.renderWindow.render();
        }
      }, //listener 
      true //deep watch
    );

    $scope.$on('addActor', function(event, actor, resetCamera){
      //obj = {
      //   actor: vtkActor,
      //   mapper: vtkMapper
      // }
      $scope.addActor(actor);
      if(resetCamera && $scope.vtk.renderer){
        $scope.vtk.renderer.resetCamera();
      }
    });

    $scope.$on('removeActor', function(event, actor){
      //obj = {
      //   actor: vtkActor,
      //   mapper: vtkMapper
      // }
      $scope.removeActor(actor);
    });

    $scope.$on('renderWindow', function(){
      if($scope.vtk.renderWindow){
        $scope.vtk.renderWindow.render();
      }
    });

    $scope.$on('resetCamera', function(){
      if($scope.vtk.renderer){
        $scope.vtk.renderer.resetCamera();
      }
    })

    
    
  }

  return {
    restrict : 'E',
      link : link,
      scope: {},
      templateUrl: './src/dcbia-vtk.template.html'
  }


});