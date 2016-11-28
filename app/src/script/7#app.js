angular.module("xte", ["ngRoute", "ngSanitize", "template"])
.config(function($routeProvider) {
    $routeProvider
    .when("/login", {
        templateUrl : "view/login"
    })
    .when("/xte", {
        templateUrl : "view/messenger"
    });
})

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.directive('ngEnter', function () {
    return function (scope, element, attributes) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attributes.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.directive('ngRepeatEnd', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attributes) {
			scope.$eval(attributes.ngRepeatEnd);
			if (scope.$last) {
				$timeout(function () {
					scope.$eval(attributes.ngRepeatEnd);
				});
			}
		}
	}
})

.run(function($window, $rootScope){

	$rootScope.online = navigator.onLine;
		$window.addEventListener("offline", function () {
			$rootScope.$apply(function() { $rootScope.online = false; });
	}, false);
	$window.addEventListener("online", function () {
		$rootScope.$apply(function() { $rootScope.online = true; });
	}, false);

	$rootScope.u = {}
	$rootScope.u.find = function(array, key){
		var result;
		for(index in key){
			result = array.find(function(object){ return object[index] == key[index] })
			if(typeof result == 'object') return true;
		}
		if(typeof result == 'object') return true;
		return false;
	}
	$rootScope.u.getCookie = function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
		    while (c.charAt(0) == ' ') {
		        c = c.substring(1);
		    } if (c.indexOf(name) == 0) {
		        return c.substring(name.length, c.length);
		    }} return "";
	}

	if(!$rootScope.u.getCookie('fullname')) { window.location.href = '#/login' }
	else { window.location.href = '#/xte' }

	$(window).bind('beforeunload', function(){
		$.post('/api/logout', { fullname: $rootScope.u.getCookie('fullname') }, function(result){});
		$rootScope.$digest()
	});
	
	$("#ms-list").scrollTop($("#ms-list > ul").height());

	$rootScope.messages = []
	$rootScope.online_guys = []
	$rootScope.username = $rootScope.u.getCookie('fullname');
})

.service('splash_service', ['$rootScope', function(scope){
	this.start = function(text){
		scope.splash = 'visible'; scope.splash_text = text
		if(!scope.$$phase) scope.$digest()
	}
	this.change_text = function(text){
		scope.splash_text = text
		if(!scope.$$phase) scope.$digest()
	}
	this.stop = function(){
		scope.splash = 'hidden'
		if(!scope.$$phase) scope.$digest()
	}
}])


.controller('app_ctrl', ['$rootScope', '$http', 'splash_service', function(scope, http, splash){

	splash.start('Connecting ...')
	
	scope.$watch('online', function(newStatus){});

	var socket = io.connect(':7620');
	socket.on('connect', function (socket) {
		scope.status = 'online'
		splash.stop()
	});
	socket.on('disconnect', function (socket) {
		scope.status = 'offline'
		splash.start('Connecting ...')
	});

	socket.on('message', function(response){
		if(response.data.sender==scope.messages[0].sender){
			scope.messages[0].text += '<hr>' + response.data.text
			if(!scope.$$phase) scope.$apply()
		} else {
			scope.messages.unshift(response.data)
			if(!scope.$$phase) scope.$apply()
		}
		$("#ms-list").scrollTop($("#ms-list > ul").height());
	})
	socket.on('guyOn', function(response){
		var exist;
		if(response.data.fullname==scope.username) {
			scope.status = 'online';
			if(!scope.$$phase) scope.$apply()
			return
		}
		scope.online_guys.forEach(function(guy){
			exist = (guy.fullname == response.data.fullname)
		}); if(!exist) scope.online_guys.push({fullname:response.data.fullname})
		if(!scope.$$phase) scope.$apply()
	})
	socket.on('guyOff', function(response){
		if(response.data.fullname==scope.username) {
			scope.status = 'offline';
			if(!scope.$$phase) scope.$apply()
			return
		}
		scope.online_guys.splice(scope.online_guys.findIndex(function(g){
			return g.fullname == response.data.fullname
		}), 1)
		if(!scope.$$phase) scope.$apply()
	})
	socket.on('typing', function(response){
		if(response.data.fullname==scope.username) {
			scope.status = 'online';
			if(!scope.$$phase) scope.$apply()
			return
		}
		scope.who_is_typing = response.data.fullname;
		if(!scope.$$phase) scope.$apply()
	})

	this.send_message = function(message){
		http.post('/api/messages', message).then(function(result){
		}, function(error){ })
	}

	this.login = function(fullname){
		if(!fullname){
			swal({
				title: 'Login',
				text: 'Fullname is required',
				animation: false,
				confirmButtonText: 'OK',
	  			confirmButtonClass: 'link-btn'
			}); return
		}
		splash.start('Logging ...');
		http.post('/api/login', { fullname: fullname }).then(function(result){
			if(result.data.status != 0) {
				splash.stop()
				switch(result.data.status){
					case 2:
						swal({
							title: 'Login',
							text: 'Another user with same name was logged in, try another name or wait for that user logout.',
							animation: false,
							confirmButtonText: 'OK',
				  			confirmButtonClass: 'link-btn'
						})
					    break;
				}
				return }
			document.cookie = 'fullname=' + fullname + '; path=/'
			scope.username = scope.u.getCookie('fullname');
			result.data.data.messages.forEach( function(message, i) {
				if(i > 0 && result.data.data.messages[i-1].sender == message.sender) {
					scope.messages[scope.messages.length-1].text = message.text + '<hr>' + scope.messages[scope.messages.length-1].text
				} else {
					scope.messages.push(message);
				}
				//result.data.data.messages;
			});
			scope.online_guys = result.data.data.guys
			window.location.href = '#/xte'
			splash.stop()
		}, function(error){ location.reload(); })
	}
	
	this.logout = function(fullname){
		splash.start('Please wait ...');
		http.post('/api/logout', { fullname: fullname }).then(function(result){
			if(result.data.status != 0) return	
			scope.messages = []
			scope.online_guys = []
			window.location.href = '#/login'
			splash.stop()
		}, function(error){ location.reload(); })
	}

	this.relogin = function(fullname){

		swal({
			title: 'Login as another name ?',
			animation: false,
			showCancelButton: true,
			confirmButtonClass: 'link-btn',
			cancelButtonClass: 'link-btn',
			confirmButtonText: 'Yes!'
		}).then(function () {
			document.cookie = 'fullname=; path=/'
			this.logout(fullname);	
		})
	}

	this.mention = function(user){
		scope.text_message = scope.text_message? scope.text_message:''
		if(scope.text_message.search('@' + user)==-1) {
			scope.text_message = '@' + user + ' ' + scope.text_message
		} else { scope.text_message = scope.text_message.replace('@' + user, '').trim(); }
		$("#message_textbox").focus();
	}

	var typing = false;
	this.is_typing = function(){
		if(typing) return;
		typing = true;
		socket.emit('typing', { data: { fullname: scope.username }});
		setTimeout(function(){
			socket.emit('typing', { data: { fullname: false }});
			typing = false
		}, 2000)
	}

	this.og_alert = function(){
		var guys='';
		scope.online_guys.forEach(function(guy, i){
			guys += '<li class="md-text">' + guy.fullname + '</li>'
		})
		swal({
			title: 'Online Guys',
			text: '<hr><ul class="og-list">' + guys + '</ul>',
			animation: false,
			confirmButtonText: 'Close',
  			confirmButtonClass: 'link-btn'
		})
	}

	var bunch_num = 2, lock_scroll_end = false, last_scroll = 0, called;
	this.ms_scroll = function(){
		$("#ms-list").scrollTop(document.getElementById("ms-list").scrollHeight - $("#ms-list").height() - last_scroll)
	}

	scope.$on('$viewContentLoaded', function(){
		$('#ms-list').on( 'scroll', function(){
			last_scroll = 0
			if($("#ms-list").scrollTop() < 1 && !lock_scroll_end && bunch_num >= 0){
				lock_scroll_end = true
				bunch_num += 1
				last_scroll = document.getElementById("ms-list").scrollHeight - $("#ms-list").height()
				http.get('/api/messages/' + bunch_num).then(function(result){
					if(result.data.status != 0) return
					if(result.data.data.length < 17){
						bunch_num = -1
						scope.no_message = true
					}
					result.data.data.forEach(function(message, i){
						if(i > 0 && result.data.data[i-1].sender == message.sender){
							scope.messages[scope.messages.length-1].text = message.text + '<hr>' + scope.messages[scope.messages.length-1].text
						} else { scope.messages.push(message); }
					});
					lock_scroll_end = false
				}, function(error){ })
			}
		});
  	});

	if(scope.u.getCookie('fullname')) { this.login(scope.u.getCookie('fullname')) }
}])