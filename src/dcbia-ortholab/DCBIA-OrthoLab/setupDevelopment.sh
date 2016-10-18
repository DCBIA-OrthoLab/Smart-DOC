linkModule(){
	module=$1

	cd $module
	bower link
	modname=$(node -e "var fs = require('fs'); var a = JSON.parse(fs.readFileSync('bower.json')); console.log(a.name); process.exit('success')")
	cd ..
	bower link $modname 
}

linkModule boxPlot
linkModule circlePlot
linkModule clinicalData
linkModule dcbia-plots
linkModule d3Plots
linkModule dcbia-surveys
linkModule home
linkModule jwtUserLogin
linkModule morphologicalData
linkModule navBar
linkModule usersManager
