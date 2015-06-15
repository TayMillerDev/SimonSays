var app = angular.module('simonApp');
app.directive('simonDir', function(){	
	return {
		restrict: 'EA',
		scope: {
			color: "@",
			array: "=",
			func: "&",
		},
		link: function(scope, elem, attr){
			elem.on("click", function(){
				scope.array.push(scope.color);
				console.log(scope.array)
				scope.func(scope.array);
			})
		},
	}
})