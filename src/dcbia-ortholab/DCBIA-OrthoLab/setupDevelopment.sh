linkModule(){
	module=$1

	cd $module
	npm link
	modname=$(node -e "var fs = require('fs'); var a = JSON.parse(fs.readFileSync('package.json')); console.log(a.name); process.exit('success')")
	cd ..
	npm link $modname 
}

linkModule home
linkModule data-collections
linkModule dcbia-jobs
linkModule dcbia-plots
linkModule dcbia-projects
linkModule dcbia-surveys
linkModule jwtUserLogin
linkModule nav-bar
npm install
