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
			$scope.formData.biteUncomfortable  = 0;
			$scope.formData.duringDayGrindTeethClenchJaw = 0;
			$scope.formData.excursionsMidlineDeviationSide = 0;
			$scope.formData.facialPainAverageIntensity = 0;
			$scope.formData.facialPainChangeRecreationalSocialFamilyActivities = 0;
			$scope.formData.facialPainChangedAbilityToWork = 0;
			$scope.formData.facialPainIntensity = 0;
			$scope.formData.facialPainInterferedDailyActivities = 0;
			$scope.formData.facialPainPersistentRecurrentOneTime = 0;
			$scope.formData.facialPainRate = 0;
			$scope.formData.generalHealth = 0;
			$scope.formData.generalOralHealth = 0;
			$scope.formData.goneToHealthProfessional = 0;
			$scope.formData.grindTeethClenchWhileSleeping = 0;
			$scope.formData.jawAcheOrStiffMorning = 0;
			$scope.formData.jawClickChewing = 0;
			$scope.formData.jawGratingGrinding = 0;
			$scope.formData.jawLockCatch = 0;
			$scope.formData.jawLockLimitationToEat = 0;
			$scope.formData.jointSoundClosingLeft = 0;
			$scope.formData.jointSoundClosingRight = 0;
			$scope.formData.jointSoundExcursionsLeftSoundExcursionLeft = 0;
			$scope.formData.jointSoundExcursionsLeftSoundExcursionProtrusion = 0;
			$scope.formData.jointSoundExcursionsLeftSoundExcursionRight = 0;
			$scope.formData.jointSoundExcursionsRightSoundExcursionLeft = 0;
			$scope.formData.jointSoundExcursionsRightSoundExcursionProtrusion = 0;
			$scope.formData.jointSoundExcursionsRightSoundExcursionRight = 0;
			$scope.formData.jointSoundOpeningLeft = 0;
			$scope.formData.jointSoundOpeningRight = 0;
			$scope.formData.knowAnyoneInFamilyWithDiseases = 0;
			$scope.formData.lastMonthDistressed = 0;
			$scope.formData.lastMonthDistressedAwakeningEarlyMorning = 0;
			$scope.formData.lastMonthDistressedBeingCaughtTrapped = 0;
			$scope.formData.lastMonthDistressedBlamingYourself = 0;
			$scope.formData.lastMonthDistressedCryingEasily = 0;
			$scope.formData.lastMonthDistressedEverythingIsEffort = 0;
			$scope.formData.lastMonthDistressedFaintnessDizziness = 0;
			$scope.formData.lastMonthDistressedFeelingBlue = 0;
			$scope.formData.lastMonthDistressedFeelingGuilt = 0;
			$scope.formData.lastMonthDistressedFeelingHopeless = 0;
			$scope.formData.lastMonthDistressedFeelingLonely = 0;
			$scope.formData.lastMonthDistressedFeelingNoInterest = 0;
			$scope.formData.lastMonthDistressedFeelingWeak = 0;
			$scope.formData.lastMonthDistressedFeelingWorthlessness = 0;
			$scope.formData.lastMonthDistressedHeadaches = 0;
			$scope.formData.lastMonthDistressedHeavyFeelingsArmsLegs = 0;
			$scope.formData.lastMonthDistressedHotColdSpells = 0;
			$scope.formData.lastMonthDistressedLossSexualInterest = 0;
			$scope.formData.lastMonthDistressedLowEnergy = 0;
			$scope.formData.lastMonthDistressedLumpInThroat = 0;
			$scope.formData.lastMonthDistressedMuscleSoreness = 0;
			$scope.formData.lastMonthDistressedNauseaUpsetStomach = 0;
			$scope.formData.lastMonthDistressedNumbnessOrTingling = 0;
			$scope.formData.lastMonthDistressedOvereating = 0;
			$scope.formData.lastMonthDistressedPainHeartChest = 0;
			$scope.formData.lastMonthDistressedPainsLowerBack = 0;
			$scope.formData.lastMonthDistressedPoorAppetite = 0;
			$scope.formData.lastMonthDistressedSleepThatIsRestless = 0;
			$scope.formData.lastMonthDistressedThoughsOfEndingLife = 0;
			$scope.formData.lastMonthDistressedThoughtsOFDeathDying = 0;
			$scope.formData.lastMonthDistressedTroubleFallingAsleep = 0;
			$scope.formData.lastMonthDistressedTroubleGettingYourBreath = 0;
			$scope.formData.lastMonthDistressedWorryTooMuchAboutThings = 0;
			$scope.formData.lastSixMonthsProblemsWithHeadachesMigraines = 0;
			$scope.formData.noisesOrRingingEars = 0;
			$scope.formData.openingPattern = 0;
			$scope.formData.painBeforeInjury = 0;
			$scope.formData.painFaceJawTemple = 0;
			$scope.formData.painLeft = 0;
			$scope.formData.painLocation = 0;
			$scope.formData.painRight = 0;
			$scope.formData.palpationExtraoralMuscleMasseterLeft = 0;
			$scope.formData.palpationExtraoralMuscleMasseterRight = 0;
			$scope.formData.palpationExtraoralMuscleRemporalisLeft = 0;
			$scope.formData.palpationExtraoralMuscleTemporalisRight = 0;
			$scope.formData.palpationIntraoralMuscleLateralPterygoidLeft = 0;
			$scope.formData.palpationIntraoralMuscleLateralPterygoidRight = 0;
			$scope.formData.palpationIntraoralMuscleTendonTemporalisLeft = 0;
			$scope.formData.palpationIntraoralMuscleTendonTemporalisRight = 0;
			$scope.formData.palpationJointLateralPoleLeft = 0;
			$scope.formData.palpationJointLateralPoleRight = 0;
			$scope.formData.persistentPainAtLeastOneYear = 0;
			$scope.formData.recentInjuryJawFace = 0;
			$scope.formData.swollenJointsCloseToEars = 0;
			$scope.formData.systemicArthriticDisease = 0;
			$scope.formData.takingCareOfHealthOverall = 0;
			$scope.formData.takingCareOfOralHealth = 0;

			$scope.formData.beginPainYears = 0;
			$scope.formData.beginPainMonths = 0;
			$scope.formData.daysKeptFromUsualActivities = 0;
			$scope.formData.problemOrPreventChewing = 0;
			$scope.formData.problemOrPreventDrinking = 0;
			$scope.formData.problemOrPreventExercising = 0;
			$scope.formData.problemOrPreventEatingHardFoods = 0;
			$scope.formData.problemOrPreventEatingSoftFoods = 0;
			$scope.formData.problemOrPreventSmilingLaughing = 0;
			$scope.formData.problemOrPreventSexualActivity = 0;
			$scope.formData.problemOrPreventCleaningTeethOrFace = 0;
			$scope.formData.problemOrPreventYawning = 0;
			$scope.formData.problemOrPreventSwallowing = 0;
			$scope.formData.problemOrPreventTalking = 0;
			$scope.formData.problemOrPreventHavingUsualFaceAppearance = 0;
			$scope.formData.openingPatternComments = "";
			$scope.formData.verticalRangeUnassistedWOPain = 0;
			$scope.formData.verticalRangeUnassistedMax = 0;
			$scope.formData.verticalRangeAssistedMax = 0;
			$scope.formData.verticalRangeIncisalOverlap = 0;
			$scope.formData.jointSoundOpeningRightMeasurment = 0;
			$scope.formData.jointSoundOpeningLeftMeasurement = 0;
			$scope.formData.jointSoundClosingRightMeasurment = 0;
			$scope.formData.jointSoundClosingLeftMeasurement = 0;
			$scope.formData.excursionsRightLateral = 0;
			$scope.formData.excursionsLeftLateral = 0;
			$scope.formData.excursionsProtrusion = 0;
			$scope.formData.excursionsMidlineDeviation = 0;
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
