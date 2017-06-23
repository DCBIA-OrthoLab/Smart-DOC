import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtk                       from 'vtk.js/Sources/vtk';
import vtkActor                  from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper                 from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkOBJReader              from 'vtk.js/Sources/IO/Misc/OBJReader';


global.vtk = vtk;
global.vtkOBJReader = vtkOBJReader;

global.readPolyData = function(url){
  const reader = vtkOBJReader.newInstance({ splitMode: 'usemtl' });
  reader.setUrl(url);
  return reader;
}

angular.module('dcbia-vtk-module')
.directive('dcbiaVtk', function($routeParams, $timeout, dcbiaVTKService) {

  function link($scope, $elem){

    $scope.initializeRenderWindow = function(){      
        
      $scope.vtk = {};

      var rootContainer = $elem[0];        
      var container = _.find(rootContainer.getElementsByClassName('vtkViewPort'), function(node){
        return node.id == "vtk-vp";
      });

      // ----------------------------------------------------------------------------
      // Standard rendering code setup
      // ----------------------------------------------------------------------------
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({ background: [255, 255, 255], rootContainer: rootContainer, container: container });
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();
      
      // -----------------------------------------------------------
      // Make some variables global so that you can inspect and
      // modify objects in your browser's developer console:
      // -----------------------------------------------------------
      
      $scope.vtk.renderer = renderer;
      $scope.vtk.renderWindow = renderWindow;
      $scope.vtk.rootContainer = rootContainer;
      $scope.vtk.container = container;            
    }

    $scope.loadPolyData = function(vtkpolydata){
      // const polydata = vtk({
      //   vtkClass: 'vtkPolyData',
      //   points: {
      //     vtkClass: 'vtkPoints',
      //     dataType: 'Float32Array',
      //     numberOfComponents: 3,
      //     values: [
      //       0, 0, 0,
      //       1, 0, 0.25,
      //       1, 1, 0,
      //       0, 1, 0.25,
      //     ],
      //   },
      //   polys: {
      //     vtkClass: 'vtkCellArray',
      //     dataType: 'Uint16Array',
      //     values: [
      //       3, 0, 1, 2,
      //       3, 0, 2, 3,
      //     ],
      //   },
      //   pointData: {
      //     vtkClass: 'vtkDataSetAttributes',
      //     activeScalars: 0,
      //     arrays: [{
      //       data: {
      //         vtkClass: 'vtkDataArray',
      //         name: 'pointScalars',
      //         dataType: 'Float32Array',
      //         values: [0, 1, 0, 1],
      //       },
      //     }],
      //   },
      //   cellData: {
      //     vtkClass: 'vtkDataSetAttributes',
      //     activeScalars: 0,
      //     arrays: [{
      //       data: {
      //         vtkClass: 'vtkDataArray',
      //         name: 'cellScalars',
      //         dataType: 'Float32Array',
      //         values: [0, 1],
      //       },
      //     }],
      //   },
      // });

      const polydata = vtk(vtkpolydata)

      // const mapper = vtkMapper.newInstance({ interpolateScalarsBeforeMapping: true });
      const mapper = vtkMapper.newInstance();
      mapper.setInputData(polydata);
      const lut = mapper.getLookupTable();
      lut.setHueRange(0.666, 0);
      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      $scope.vtk.mapper = mapper;
      $scope.vtk.lut = lut;
      $scope.vtk.actor = actor;
      $scope.vtk.renderer.addActor($scope.vtk.actor);
      $scope.vtk.renderer.resetCamera();
      $scope.vtk.renderWindow.render();
      
    }


    $scope.$watch('vtkUrl', function(){
      if($scope.vtkUrl){
        //$scope.loadPolyData();        
      }
    });

    $scope.$watch('vtkPolyData', function(){
      if($scope.vtkPolyData){
        if($scope.vtk.actor){
          $scope.vtk.renderer.removeActor($scope.vtk.actor);
        }
        $scope.loadPolyData($scope.vtkPolyData);
      }
    }, true);

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

    $scope.$watch('hueRange', function(hueRange){
      if(hueRange && $scope.vtk.lut){
        $scope.vtk.lut.setHueRange(hueRange.min, hueRange.max);
        $scope.vtk.mapper.update();
        $scope.vtk.renderWindow.render();
      }
    }, true)
    
  }

  return {
    restrict : 'E',
      link : link,
      scope: {
        vtkUrl: "=",
        vtkPolyData: "=",
        hueRange: "="
      },
      templateUrl: './src/dcbia-vtk.template.html'
  }


});