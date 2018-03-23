import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtk                       from 'vtk.js/Sources/vtk';
import vtkActor                  from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper                 from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkOBJReader              from 'vtk.js/Sources/IO/Misc/OBJReader';
import vtkPolyDataReader from 'vtk.js/Sources/IO/Legacy/PolyDataReader';

global.vtk = vtk;

angular.module("dcbia-vtk-module")
.service("dcbiaVTKService", function(){

    var nextId = 0;

    return {
    	initializeRenderWindow: function(rootContainer, container){

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

	      return {
	      	renderer: renderer,
	      	renderWindow: renderWindow
	      }
	      
    	},
    	getUniqueId: function(){
    		nextId++;
    		return Promise.resolve(nextId);
	    }, 
	    parsePolyData: function(data){
	    	const reader = vtkPolyDataReader.newInstance();
	    	reader.parse(data);
	    	reader.update();
	    	return reader.getOutputData();
	    },
	    addPointDataArray: function(polydata, array, name, dataType){
	    	name = name? name: 'pointScalars';
	    	dataType = dataType? dataType: 'Float32Array';

	    	if(polydata && polydata.getPointData()){
	    		var pointdata = polydata.getPointData();
				
				pointdata.setScalars(vtk({
					vtkClass: 'vtkDataArray',
					name: name,
					dataType: dataType,
					values: array
				}));
				
	    	}
	    },
	    newActor: function(polydata){
	    	// const mapper = vtkMapper.newInstance({ interpolateScalarsBeforeMapping: true });
	      const mapper = vtkMapper.newInstance();
	      mapper.setInputData(polydata);

	      const actor = vtkActor.newInstance();
	      actor.setMapper(mapper);

	      return {
	      	mapper: mapper,
	      	actor: actor
	      }

	    },
	    parseVTK1: function(data){
	    	  // connectivity of the triangles
		      var indices = [];

		      // triangles vertices
		      var positions = [];

		      // red, green, blue colors in the range 0 to 1
		      var colors = [];

		      // normal vector, one per vertex
		      var normals = [];

		      var result;

		      // pattern for reading vertices, 3 floats or integers
		      var pat3Floats = /(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)/g;

		      // pattern for connectivity, an integer followed by any number of ints
		      // the first integer is the number of polygon nodes
		      var patConnectivity = /^(\d+)\s+([\s\d]*)/;

		      // indicates start of vertex data section
		      var patPOINTS = /^POINTS /;

		      // indicates start of polygon connectivity section
		      var patPOLYGONS = /^POLYGONS /;

		      // indicates start of triangle strips section
		      var patTRIANGLE_STRIPS = /^TRIANGLE_STRIPS /;

		      // POINT_DATA number_of_values
		      var patPOINT_DATA = /^POINT_DATA[ ]+(\d+)/;

		      // CELL_DATA number_of_polys
		      var patCELL_DATA = /^CELL_DATA[ ]+(\d+)/;

		      // Start of color section
		      var patCOLOR_SCALARS = /^COLOR_SCALARS[ ]+(\w+)[ ]+3/;

		      // NORMALS Normals float
		      var patNORMALS = /^NORMALS[ ]+(\w+)[ ]+(\w+)/;

		      var inPointsSection = false;
		      var inPolygonsSection = false;
		      var inTriangleStripSection = false;
		      var inPointDataSection = false;
		      var inCellDataSection = false;
		      var inColorSection = false;
		      var inNormalsSection = false;

		      var lines = data.split( '\n' );

		      for ( var i in lines ) {

		        var line = lines[ i ];

		        if ( inPointsSection ) {

		          // get the vertices
		          while ( ( result = pat3Floats.exec( line ) ) !== null ) {

		            var x = parseFloat( result[ 1 ] );
		            var y = parseFloat( result[ 2 ] );
		            var z = parseFloat( result[ 3 ] );
		            positions.push( x, y, z );

		          }

		        } else if ( inPolygonsSection ) {

		          if ( ( result = patConnectivity.exec( line ) ) !== null ) {
		            
		            var inds = result[ 0 ].split( /\s+/ );

		            indices.push( parseInt( inds[ 0 ] ), parseInt( inds[ 1 ] ), parseInt( inds[ 2 ] ), parseInt( inds[ 3 ] ) );

		          }

		        } else if ( inTriangleStripSection ) {

		          if ( ( result = patConnectivity.exec( line ) ) !== null ) {

		            // numVertices i0 i1 i2 ...
		            var numVertices = parseInt( result[ 1 ] );
		            var inds = result[ 2 ].split( /\s+/ );

		            if ( numVertices >= 3 ) {

		              var i0, i1, i2;
		              // split the polygon in numVertices - 2 triangles
		              for ( var j = 0; j < numVertices - 2; j ++ ) {

		                if ( j % 2 === 1 ) {

		                  i0 = parseInt( inds[ j ] );
		                  i1 = parseInt( inds[ j + 2 ] );
		                  i2 = parseInt( inds[ j + 1 ] );
		                  indices.push( i0, i1, i2 );

		                } else {

		                  i0 = parseInt( inds[ j ] );
		                  i1 = parseInt( inds[ j + 1 ] );
		                  i2 = parseInt( inds[ j + 2 ] );
		                  indices.push( i0, i1, i2 );

		                }

		              }

		            }

		          }

		        } else if ( inPointDataSection || inCellDataSection ) {

		          if ( inColorSection ) {

		            // Get the colors

		            while ( ( result = pat3Floats.exec( line ) ) !== null ) {

		              var r = parseFloat( result[ 1 ] );
		              var g = parseFloat( result[ 2 ] );
		              var b = parseFloat( result[ 3 ] );
		              colors.push( r, g, b );

		            }

		          } else if ( inNormalsSection ) {

		            // Get the normal vectors

		            while ( ( result = pat3Floats.exec( line ) ) !== null ) {

		              var nx = parseFloat( result[ 1 ] );
		              var ny = parseFloat( result[ 2 ] );
		              var nz = parseFloat( result[ 3 ] );
		              normals.push( nx, ny, nz );

		            }

		          }

		        }

		        if ( patPOLYGONS.exec( line ) !== null ) {

		          inPolygonsSection = true;
		          inPointsSection = false;
		          inTriangleStripSection = false;

		        } else if ( patPOINTS.exec( line ) !== null ) {

		          inPolygonsSection = false;
		          inPointsSection = true;
		          inTriangleStripSection = false;

		        } else if ( patTRIANGLE_STRIPS.exec( line ) !== null ) {

		          inPolygonsSection = false;
		          inPointsSection = false;
		          inTriangleStripSection = true;

		        } else if ( patPOINT_DATA.exec( line ) !== null ) {

		          inPointDataSection = true;
		          inPointsSection = false;
		          inPolygonsSection = false;
		          inTriangleStripSection = false;

		        } else if ( patCELL_DATA.exec( line ) !== null ) {

		          inCellDataSection = true;
		          inPointsSection = false;
		          inPolygonsSection = false;
		          inTriangleStripSection = false;

		        } else if ( patCOLOR_SCALARS.exec( line ) !== null ) {

		          inColorSection = true;
		          inNormalsSection = false;
		          inPointsSection = false;
		          inPolygonsSection = false;
		          inTriangleStripSection = false;

		        } else if ( patNORMALS.exec( line ) !== null ) {

		          inNormalsSection = true;
		          inColorSection = false;
		          inPointsSection = false;
		          inPolygonsSection = false;
		          inTriangleStripSection = false;

		        }

		      }

		      // var polydata = {
		      // 	vtkClass: 'vtkPolyData',
		      // 	points: {
		      // 		vtkClass: 'vtkPoints',
		      // 		dataType: 'Float32Array',
		      // 		numberOfComponents: 3,
		      // 		values: [
		      // 		0, 0, 0,
		      // 		1, 0, 0.25,
		      // 		1, 1, 0,
		      // 		0, 1, 0.25,
		      // 		],
		      // 	},
		      // 	polys: {
		      // 		vtkClass: 'vtkCellArray',
		      // 		dataType: 'Uint16Array',
		      // 		values: [
		      // 		3, 0, 1, 2,
		      // 		3, 0, 2, 3,
		      // 		],
		      // 	},
		      // 	pointData: {
		      // 		vtkClass: 'vtkDataSetAttributes',
		      // 		activeScalars: 0,
		      // 		arrays: [{
		      // 			data: {
		      // 				vtkClass: 'vtkDataArray',
		      // 				name: 'pointScalars',
		      // 				dataType: 'Float32Array',
		      // 				values: [0, 1, 0, 1],
		      // 			},
		      // 		}],
		      // 	},
		      // 	cellData: {
		      // 		vtkClass: 'vtkDataSetAttributes',
		      // 		activeScalars: 0,
		      // 		arrays: [{
		      // 			data: {
		      // 				vtkClass: 'vtkDataArray',
		      // 				name: 'cellScalars',
		      // 				dataType: 'Float32Array',
		      // 				values: [0, 1],
		      // 			},
		      // 		}],
		      // 	}
		      // };
		      var polydata = {
		      	vtkClass: 'vtkPolyData'
		      }
		      var stagger = 'point';

		      if ( colors.length == indices.length ) {

		        stagger = 'cell';

		      }

		      if ( stagger == 'point' ) {

		      	polydata.points = {
		      		vtkClass: 'vtkPoints',
		      		dataType: 'Float32Array',
		      		numberOfComponents: 3, 
		      		values: new Float32Array( positions )
		      	}

		      	var colorarray;
		        if ( colors.length == positions.length ) {
		        	colorarray = {
		      			data: {
		      				vtkClass: 'vtkDataArray',
		      				name: 'colors',
		      				dataType: 'Float32Array',
		      				values: new Float32Array( colors ),
		      			},
		      		}
		        }

		        var normalarray;
		        if ( normals.length == positions.length ) {
		        	normalarray = {
		      			data: {
		      				vtkClass: 'vtkDataArray',
		      				name: 'normals',
		      				dataType: 'Float32Array',
		      				values: new Float32Array( normals ),
		      			}
		      		}
		        }

		        if(colorarray || normalarray){
		        	
		        	polydata.pointData = {
			      		vtkClass: 'vtkDataSetAttributes',
			      		activeScalars: 0,			      		
			      		arrays: _.compact([colorarray, normalarray]),
			      	}
		        }

		        polydata.polys = {
		      		vtkClass: 'vtkCellArray',
		      		dataType: 'Uint16Array',
		      		values: new Uint16Array(indices)
		      	}

		      	polydata.addPointDataArray = function(dataarray, name, type){
		      		if(!this.pointData){
		      			this.pointData = {
		      				vtkClass: 'vtkDataSetAttributes',
			      			activeScalars: 0,
			      			arrays: []
		      			}
		      		}
		      		var addarray = true;
		      		this.pointData.arrays.forEach(function(array){
		      			if(array.data && array.data.name === name){
		      				addarray = false;
		      				array.data.dataType = type;
		      				array.data.values = dataarray;		      				
		      			}
		      		})

		      		if(addarray){
		      			this.pointData.arrays.push({
			      			data: {
			      				vtkClass: 'vtkDataArray',
			      				name: name,
			      				dataType: type,
			      				values: dataarray,
			      			},
			      		})
		      		}
		      	}

		      } else {

		        // Cell centered colors. The only way to attach a solid color to each triangle
		        // is to use Geometry, which is less efficient than BufferGeometry
		        //geometry = new THREE.Geometry();

		        var numTriangles = indices.length / 3;
		        var numPoints = positions.length / 3;
		        var va, vb, vc;
		        var face;
		        var ia, ib, ic;
		        var x, y, z;
		        var r, g, b;

		        for ( var j = 0; j < numPoints; ++ j ) {

		          x = positions[ 3 * j + 0 ];
		          y = positions[ 3 * j + 1 ];
		          z = positions[ 3 * j + 2 ];
		          // geometry.vertices.push( new THREE.Vector3( x, y, z ) );

		        }

		        for ( var i = 0; i < numTriangles; ++ i ) {

		          ia = indices[ 3 * i + 0 ];
		          ib = indices[ 3 * i + 1 ];
		          ic = indices[ 3 * i + 2 ];
		          // geometry.faces.push( new THREE.Face3( ia, ib, ic ) );

		        }

		        if ( colors.length == numTriangles * 3 ) {

		          for ( var i = 0; i < numTriangles; ++ i ) {

		            face = geometry.faces[ i ];
		            r = colors[ 3 * i + 0 ];
		            g = colors[ 3 * i + 1 ];
		            b = colors[ 3 * i + 2 ];
		            // face.color = new THREE.Color().setRGB( r, g, b );

		          }

		        }

		      }

		      return polydata;
	    }
    }

});