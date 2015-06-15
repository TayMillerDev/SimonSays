var app = angular.module('simonApp');
console.log("I THINK SO!")
app.service('simonService', function(fb, $firebaseObject){
	console.log("Working?")
	this.scoresPage = new Firebase("https://simonsays.firebaseio.com/scores");


	this.postScore = function(uname, points){ 
		console.log(uname, points)
		this.scoresPage.push({
			username: uname,
			score: points
		});
	}

})