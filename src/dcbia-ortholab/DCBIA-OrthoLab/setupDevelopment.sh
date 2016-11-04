linkModule(){
	module=$1

	cd $module
	echo npm link
	modname=$(node -e "var fs = require('fs'); var a = JSON.parse(fs.readFileSync('package.json')); console.log(a.name); process.exit('success')")
	cd ..
	echo bower link $modname 
}

linkModule home
