angular.module('dcbia-vtk-module').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('./src/dcbia-vtk.template.html',
    "<div class=\"col-md-12\">\n" +
    "	<!-- <div class=\"button-group\">\n" +
    "		<button class=\"btn btn-default\">hola</button>\n" +
    "	</div> -->\n" +
    "	\n" +
    "	<div class=\"vtkViewPort\" id=\"vtk-vp\"></div>\n" +
    "	\n" +
    "</div>"
  );

}]);
