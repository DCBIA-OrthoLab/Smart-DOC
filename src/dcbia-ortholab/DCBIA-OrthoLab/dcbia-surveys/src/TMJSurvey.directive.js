angular.module('dcbia-surveys')
.directive('tmjSurvey', function($rootScope, $location, $anchorScroll, clusterauth) {

	function link($scope){
		
		if(!$scope.formData || ($scope.formData && $scope.formData.formId !== 'TMJSurvey')){
			$scope.formData = {};
			$scope.formData.formId = 'TMJSurvey';
			var dt = new Date();
			var year = dt.getFullYear();
			var month = ((dt.getMonth()+1)>=10)? (dt.getMonth()+1) : '0' + (dt.getMonth()+1);
			var day = ((dt.getDate())>=10)? (dt.getDate()) : '0' + (dt.getDate());
			$scope.formData.date = year + "-" + month + "-" + day;

			//Default values
			$scope.formData.biteUncomfortable  = "";
			$scope.formData.duringDayGrindTeethClenchJaw = "";
			$scope.formData.excursionsMidlineDeviationSide = "";
			$scope.formData.facialPainAverageIntensity = "";
			$scope.formData.facialPainChangeRecreationalSocialFamilyActivities = "";
			$scope.formData.facialPainChangedAbilityToWork = "";
			$scope.formData.facialPainIntensity = "";
			$scope.formData.facialPainInterferedDailyActivities = "";
			$scope.formData.facialPainPersistentRecurrentOneTime = "";
			$scope.formData.facialPainRate = "";
			$scope.formData.generalHealth = "";
			$scope.formData.generalOralHealth = "";
			$scope.formData.goneToHealthProfessional = "";
			$scope.formData.grindTeethClenchWhileSleeping = "";
			$scope.formData.jawAcheOrStiffMorning = "";
			$scope.formData.jawClickChewing = "";
			$scope.formData.jawGratingGrinding = "";
			$scope.formData.jawLockCatch = "";
			$scope.formData.jawLockLimitationToEat = "";
			$scope.formData.jointSoundClosingLeft = "";
			$scope.formData.jointSoundClosingRight = "";
			$scope.formData.jointSoundExcursionsLeftSoundExcursionLeft = "";
			$scope.formData.jointSoundExcursionsLeftSoundExcursionProtrusion = "";
			$scope.formData.jointSoundExcursionsLeftSoundExcursionRight = "";
			$scope.formData.jointSoundExcursionsRightSoundExcursionLeft = "";
			$scope.formData.jointSoundExcursionsRightSoundExcursionProtrusion = "";
			$scope.formData.jointSoundExcursionsRightSoundExcursionRight = "";
			$scope.formData.jointSoundOpeningLeft = "";
			$scope.formData.jointSoundOpeningRight = "";
			$scope.formData.knowAnyoneInFamilyWithDiseases = "";
			$scope.formData.lastMonthDistressed = "";
			$scope.formData.lastMonthDistressedAwakeningEarlyMorning = "";
			$scope.formData.lastMonthDistressedBeingCaughtTrapped = "";
			$scope.formData.lastMonthDistressedBlamingYourself = "";
			$scope.formData.lastMonthDistressedCryingEasily = "";
			$scope.formData.lastMonthDistressedEverythingIsEffort = "";
			$scope.formData.lastMonthDistressedFaintnessDizziness = "";
			$scope.formData.lastMonthDistressedFeelingBlue = "";
			$scope.formData.lastMonthDistressedFeelingGuilt = "";
			$scope.formData.lastMonthDistressedFeelingHopeless = "";
			$scope.formData.lastMonthDistressedFeelingLonely = "";
			$scope.formData.lastMonthDistressedFeelingNoInterest = "";
			$scope.formData.lastMonthDistressedFeelingWeak = "";
			$scope.formData.lastMonthDistressedFeelingWorthlessness = "";
			$scope.formData.lastMonthDistressedHeadaches = "";
			$scope.formData.lastMonthDistressedHeavyFeelingsArmsLegs = "";
			$scope.formData.lastMonthDistressedHotColdSpells = "";
			$scope.formData.lastMonthDistressedLossSexualInterest = "";
			$scope.formData.lastMonthDistressedLowEnergy = "";
			$scope.formData.lastMonthDistressedLumpInThroat = "";
			$scope.formData.lastMonthDistressedMuscleSoreness = "";
			$scope.formData.lastMonthDistressedNauseaUpsetStomach = "";
			$scope.formData.lastMonthDistressedNumbnessOrTingling = "";
			$scope.formData.lastMonthDistressedOvereating = "";
			$scope.formData.lastMonthDistressedPainHeartChest = "";
			$scope.formData.lastMonthDistressedPainsLowerBack = "";
			$scope.formData.lastMonthDistressedPoorAppetite = "";
			$scope.formData.lastMonthDistressedSleepThatIsRestless = "";
			$scope.formData.lastMonthDistressedThoughsOfEndingLife = "";
			$scope.formData.lastMonthDistressedThoughtsOFDeathDying = "";
			$scope.formData.lastMonthDistressedTroubleFallingAsleep = "";
			$scope.formData.lastMonthDistressedTroubleGettingYourBreath = "";
			$scope.formData.lastMonthDistressedWorryTooMuchAboutThings = "";
			$scope.formData.lastSixMonthsProblemsWithHeadachesMigraines = "";
			$scope.formData.noisesOrRingingEars = "";
			$scope.formData.openingPattern = "";
			$scope.formData.painBeforeInjury = "";
			$scope.formData.painFaceJawTemple = "";
			$scope.formData.painLeft = "";
			$scope.formData.painLocation = "";
			$scope.formData.painRight = "";
			$scope.formData.palpationExtraoralMuscleMasseterLeft = "";
			$scope.formData.palpationExtraoralMuscleMasseterRight = "";
			$scope.formData.palpationExtraoralMuscleRemporalisLeft = "";
			$scope.formData.palpationExtraoralMuscleTemporalisRight = "";
			$scope.formData.palpationIntraoralMuscleLateralPterygoidLeft = "";
			$scope.formData.palpationIntraoralMuscleLateralPterygoidRight = "";
			$scope.formData.palpationIntraoralMuscleTendonTemporalisLeft = "";
			$scope.formData.palpationIntraoralMuscleTendonTemporalisRight = "";
			$scope.formData.palpationJointLateralPoleLeft = "";
			$scope.formData.palpationJointLateralPoleRight = "";
			$scope.formData.persistentPainAtLeastOneYear = "";
			$scope.formData.recentInjuryJawFace = "";
			$scope.formData.swollenJointsCloseToEars = "";
			$scope.formData.systemicArthriticDisease = "";
			$scope.formData.takingCareOfHealthOverall = "";
			$scope.formData.takingCareOfOralHealth = "";

			$scope.formData.beginPainYears = "";
			$scope.formData.beginPainMonths = "";
			$scope.formData.daysKeptFromUsualActivities = "";
			$scope.formData.problemOrPreventChewing = "";
			$scope.formData.problemOrPreventDrinking = "";
			$scope.formData.problemOrPreventExercising = "";
			$scope.formData.problemOrPreventEatingHardFoods = "";
			$scope.formData.problemOrPreventEatingSoftFoods = "";
			$scope.formData.problemOrPreventSmilingLaughing = "";
			$scope.formData.problemOrPreventSexualActivity = "";
			$scope.formData.problemOrPreventCleaningTeethOrFace = "";
			$scope.formData.problemOrPreventYawning = "";
			$scope.formData.problemOrPreventSwallowing = "";
			$scope.formData.problemOrPreventTalking = "";
			$scope.formData.problemOrPreventHavingUsualFaceAppearance = "";
			$scope.formData.openingPatternComments = "";
			$scope.formData.verticalRangeUnassistedWOPain = "";
			$scope.formData.verticalRangeUnassistedMax = "";
			$scope.formData.verticalRangeAssistedMax = "";
			$scope.formData.verticalRangeIncisalOverlap = "";
			$scope.formData.jointSoundOpeningRightMeasurment = "";
			$scope.formData.jointSoundOpeningLeftMeasurement = "";
			$scope.formData.jointSoundClosingRightMeasurment = "";
			$scope.formData.jointSoundClosingLeftMeasurement = "";
			$scope.formData.excursionsRightLateral = "";
			$scope.formData.excursionsLeftLateral = "";
			$scope.formData.excursionsProtrusion = "";
			$scope.formData.excursionsMidlineDeviation = "";
			$scope.formData.scope = [];


			clusterauth.getUser()
			.then(function(res){
				$scope.formData.owner = res.email;
			})
		}

		$scope.goToScroll = function(location) {
	      // set the location.hash to the id of
	      // the element you wish to scroll to.
	      $location.hash(location);

	      // call $anchorScroll()
	      $anchorScroll();
	    };
	}
	return {
    	restrict : 'E',
    	link : link,
    	scope: {
	    	formData : "=",
	    	editFields: "="
	    },
    	templateUrl: './src/TMJSurvey.template.html'
	}


});
