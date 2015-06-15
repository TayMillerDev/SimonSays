var app = angular.module('simonApp');

app.controller('simonCtrl', function($scope, $timeout, $q, simonService, $firebaseObject, $firebaseArray){
	$scope.simon = "SIMON SAYS!"
// SOUNDS!
	var cTriad = new Audio('sounds/cutCTriad.mp3');
	var gTriad = new Audio('sounds/cutGTriad.mp3');
	var fTriad = new Audio('sounds/cutFTriad.mp3');
	var amTriad = new Audio('sounds/cutAMTriad.mp3');
	var backupTrack = new Audio('sounds/backupTrack.mp3');
	var wrong = new Audio('sounds/cutWrong.mp3');
	var gameOver = new Audio('sounds/GameOver.mp3');
// Last Clicked!
	$scope.clickedArr = [];
// SHOW/HIDE Values
	$scope.hider = true;
	$scope.hideStart =true;
	$scope.score = $scope.points;
// OPENING SEQUENCE
	var opener = function(){
		console.log('Welcome to Simon Says');
		$timeout(function(){$scope.select('tl')}, 500);
		$timeout(function(){$scope.select('tr')}, 1000);
		$timeout(function(){$scope.select('bl')}, 1500);
		$timeout(function(){$scope.select('br')}, 2000);
	}
	opener();
// SELECT FUNCTION
	$scope.select = function(button) {
		lastClicked = button;
		$scope.clickedArr.push(button);
		if (button === "tl") {
			$scope.topRed = {'background': '#FF6A6A', 'box-shadow' : '0px 0px 200px #FF6a6a'};
				cTriad.play();
				console.log("Red!" , button);
			$timeout(function(){
				$scope.topRed = "";
			}, 500);
		}
		else if (button === "tr"){
			$scope.topYellow = {'background' : '#FDFD96' , 'box-shadow' : '0px 20px 100px #FFFF33'};
			gTriad.cuttentTime= 0;
			gTriad.play();
			console.log('Yellow!', button);
			$timeout(function(){
				$scope.topYellow = "";
			}, 500);
		}
		else if (button === "bl") {
			console.log('Blue!', button);
			$scope.blue = {'background' : '#87CeFa', 'box-shadow' : '0px 0px 50px #0070FF'};
			fTriad.play();
			$timeout(function(){
				$scope.blue = "";
			}, 500);
		}
		else if (button === "br") {
			$scope.green = {'background' : '#CCFFCC', 'box-shadow' : '0px 0px 50px #76EE00'};
			amTriad.play();
			console.log('Green!', button);
			$timeout(function(){
				$scope.green = "";
			}, 500);
		}
		else {
			console.log("Counld not find!", button)
		}
		return button;
	};
//MAKING SIMON
	var simonsArray= [];
	$scope.playerArray = [];
	var simonAdder = function(){
		var random = Math.floor(Math.random()*4)+1;
		switch(random) {
			case 1:
				simonsArray.push('tl');
				break;
			case 2:
				simonsArray.push('tr');
				break;
			case 3:
				simonsArray.push('bl');
				break;
			case 4:
				simonsArray.push('br');
				break;
		}
		if(!simonsArray[2]){
			simonAdder();
		}
		console.log(random, simonsArray)	
	};	
// Start GAME!
	$scope.startGame = function(callBack){
		$scope.hideStart = false;
		console.log("New Game Started");
		simonAdder();
		backupTrack.play();
		$scope.beginSimon = {"box-shadow" : "0px 0px 200px red"}
		$scope.userArray = [];
		var defer = $q.defer();
		simonsTurn(simonsArray).then(function(simonsArray){
		});	
	}
//SIMONS TURN
	var simonsTurn = function(arr) {
	 	var defer = $q.defer();
	 	var delay = 500;
	 	var timer = function(str, delay){
	 		$timeout(function(){
	 			console.log("This is the str", str);
	 			$scope.select(str);
			}, delay)	
 		};
	 	for (var i = 0; i < arr.length; i++) {
	 		timer(arr[i], delay);
	 		delay += 700;
	 	};
	 	defer.resolve(simonsArray)
	 	return defer.promise;
	};
// ACTIVATE TURNS
	$scope.userArray = [];
	$scope.points = 0;
	$scope.turns = function(playerArray){
		if (simonsArray[2]) {
			$scope.beginSimon = {"box-shadow" : "0px 0px 200px green"}
			if ($scope.userArray.length < simonsArray.length) {	
				for (var i = 0; i < $scope.userArray.length; i++) {
					if (simonsArray[i] === $scope.userArray[i]) {
						$scope.points = $scope.points + 10;
					}
					else {
						gameXOver();
					}
				};
			}
			else {	
				for (var i = 0; i < $scope.userArray.length; i++) {
					if (simonsArray[i] === $scope.userArray[i]) {
						$scope.points = $scope.points + 10;
					}
					else {
						gameXOver();
					}
				};
				$timeout(function(){
					$scope.userArray = [];
					simonAdder();
					$scope.beginSimon = {"box-shadow" : "0px 0px 200px red"}
					simonsTurn(simonsArray);
				},1000);
			}
		};	
		console.log($scope.points);
	}
// GAME X OVER 
	var gameXOver = function() {
		backupTrack.pause();
		backupTrack.currentTime = 0;
		wrong.play();			
		$timeout(function(){
			gameOver.play();
		}, 1000);			
		$scope.beginSimon = '';
		$scope.hider = false;
		simonsArray = []; 
	}
// SUBMIT SCORE & EXIT
	$scope.exit = function(){
		gameOver.pause();
		gameOver.currentTime = 0;
		$scope.hider = true;
		$scope.points = 0;
		$scope.userName= "";
		$scope.hideStart = true;
	};
//Submit to Firebase
	$scope.submit = function() {
		console.log($scope.userName);
		gameOver.pause();
		gameOver.currentTime = 0;
		$scope.hider = true;
		simonService.postScore($scope.userName, $scope.points);
		$scope.points = 0;
		$scope.hideStart = true;
	}
// Create Score List
	var ref = simonService.scoresPage;
	console.log("Rrrref",ref)
	var allScores = $firebaseObject(ref);
	allScores.$bindTo($scope, "AllScores").then(function(){
		console.log("Alll Scores OB", allScores)	
	})

});


