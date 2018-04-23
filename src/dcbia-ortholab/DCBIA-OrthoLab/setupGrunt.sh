gruntDev(){
	module=$1

	cd $module
	npm install --only=dev
	cd ..
}

gruntDev data-collections
gruntDev dcbia-jobs
gruntDev dcbia-plots
gruntDev dcbia-projects
gruntDev dcbia-surveys
gruntDev jwtUserLogin
gruntDev nav-bar