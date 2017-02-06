angular.module('dcbiaOrtholab')
.directive('directiveThreejs', function($routeParams, $location, $rootScope, clusterauth, $window){

    function link($scope, element){

    	
    	var child = _.find(element.children(), function(child){
    		return child.id === "threejs";
    	});

    	var height = child.clientHeight;
    	var width = child.clientWidth;

    	if(!height){
    		height = $scope.height;
    	}

    	var camera = new THREE.PerspectiveCamera( 60, width/height, 0.01, 1e10 );
		camera.position.z = 100;

		var controls = new THREE.TrackballControls( camera, child );

		controls.rotateSpeed = 5.0;
		controls.zoomSpeed = 0.5;
		controls.panSpeed = 2;

		controls.noZoom = true;
		controls.noPan = false;

		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		var scene = new THREE.Scene();

		scene.add( camera );

		// light

		var dirLight = new THREE.DirectionalLight( 0xffffff );
		dirLight.position.set( 200, 200, 1000 ).normalize();

		camera.add( dirLight );
		camera.add( dirLight.target );
	    

	    $scope.loadMesh = function(data){
    		if(scene.children[1]){
    			scene.remove(scene.children[1]);
    		}
	    	var loader = new THREE.VTKLoader();
			var geometry = loader.parse( data);

			geometry.center();
			geometry.computeVertexNormals();

			var material = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide } );

			var mesh = new THREE.Mesh( geometry, material );
			scene.add( mesh );
			controls.noZoom = false;
			
	    }
	    

		var material = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide } );

		// renderer

		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );
		
		child.appendChild(renderer.domElement);

		angular.element($window).bind('resize', function() {
			$scope.onWindowResize(child.clientWidth, child.clientHeight);
        });

		$scope.onWindowResize = function(width, height) {

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize( width, height );

			controls.handleResize();

		}

		$scope.animate = function() {

			requestAnimationFrame( $scope.animate );

			controls.update();
			renderer.render( scene, camera );

		}
		
		$scope.animate();


	    $scope.$watch("data", function(){
	    	if($scope.data){
	    		$scope.loadMesh($scope.data);
	    	}
	    });
	}



    return {
        restrict : 'E',
        link : link,
        scope: {
            data : "=",
            height: "=",
            width: "="
        },
        template: '<div id="threejs" style="width:100%"></div>'
    }
});

