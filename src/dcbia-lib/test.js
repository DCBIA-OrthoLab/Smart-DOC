var dcbia = require("./index");


dcbia.start()
.then(function(res){
	return dcbia.importMorphologicalData("/work/jprieto/data/1_New_Imaging_data_for_34_condyles/allvtk.csv");
})
