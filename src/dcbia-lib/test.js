var dcbia = require("./index");
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');

var root = argv["root"];


dcbia.start()
.then(function(res){
	return dcbia.importMorphologicalData("/Users/prieto/Google Drive/Prelim_test2_webbased_deeplearning_Clinical_Biological_Imaging_markers/Webbased_statistics_BCI/For_Stats/1_New_Imaging_data_for_34_condyles/allvtk.csv", root);
})
