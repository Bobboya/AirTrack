//Javascript class to request twitter API
var Twitter = function (args) {
	this._dom = $(args.dom);
	
	this._dom.on("click", '.removeWayPoint', function () {
		var index = $(this).data('index');
		self._gPath.removeWayPoint(index);
		self.refresh();
	});
	
	this.radius = "5km";
	this.auth = {
		message: 'Not authentified'
	};
};

//Retrieve the token necessary to request twitter.com
Twitter.prototype.connect = function () {
	var self = this;
	$.ajax({
		url: '/twitter_connect.php',
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data.token_type == 'bearer') {
				self.auth = data;
			}
		},
		error: function (data) {
			self.auth = data;
		}
	});
};

//Query the tweet coming from a specific lat lon
Twitter.prototype.request = function (args) {
	var self = this;
	var url = "/twitter_request.php";
	var lat = args.lat || 0;
	var lon = args.lon || 0;
	$.ajax({
		url: url,
		dataType: 'json',
		data: {
			token: self.auth.access_token,
			lat: lat,
			lon: lon
		},
		success: function (data) {
			console.log(data);
			self._dom.html("");
			data.statuses.forEach(function (v) {
				self._dom.append("<p>"+v.text+"</p>");
			});
		},
		error: function (data) {
			console.log(data);
		}
	});
};