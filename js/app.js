var Airport = function (options, collection) {
	this._meta = options.meta || {};
	this._isSelected = false;
	this._defaultColor = options.defaultColor || {red: 0.25, green:0.7, blue:0.7, alpha:1.0};
	this._defaultSelectedColor = options.defaultSelectedColor || { red : 0.0, green : 1.0, blue : 0.0, alpha : 1.0 };
	this._defaultHoverColor = options.defaultHoverColor || { red: 1.0, green : 0.0, blue : 0.0, alpha : 1.0 };
	options.color = this._defaultColor;
	Cesium.Billboard.call(this, options, collection);
};

Airport.prototype = Object.create(Cesium.Billboard.prototype);

Airport.prototype.latLon = function () {
	return new LatLon(this._meta.latitude, this._meta.longitude);
};

Airport.prototype.select = function () {
	this._isSelected = true;
	this.setColor(this._defaultSelectedColor);
};

Airport.prototype.deselect = function () {
	this._isSelected = false;
	this.setColor(this._defaultColor);
};

Airport.prototype.hover = function () {
	this.setColor(this._defaultHoverColor);
};

Airport.prototype.unhover = function () {
	if (this._isSelected) this.setColor(this._defaultSelectedColor);
	else this.setColor(this._defaultColor);
};

Airport.prototype.getName = function () {
	return this._meta.asciiname;
};

Airport.prototype.printInDiv = function (div) {
	div.html('');
	div.append('<p><strong>Name: </strong>'+this._meta.asciiname+'</p>');
	div.append('<p><strong>Timezone: </strong>'+this._meta.timezone+'</p>');
	if (!this._meta.elevation) return;
	div.append('<p><strong>Altitude: </strong>'+this._meta.elevation+' m</p>');
};

/*-----------------------------------------------*/

var GeographicPath = function (data) {
	this.scene = data.scene;
	this.ellipsoid = data.ellipsoid;
	this.primitives = this.scene.getPrimitives();
	
	this.pathDistance = 0;
	this.cartoPoints = [];
	this.wayPoints = [];
	
	this.polylines = new Cesium.PolylineCollection();
	this.polyline = this.polylines.add();
	
	var glowMaterial = Cesium.Material.fromType(Cesium.Material.PolylineGlowType);
	glowMaterial.uniforms.innerWidth = 3.0;
	glowMaterial.uniforms.color = new Cesium.Color(1.0, 0.5, 0.0, 1.0);
	this.polyline.setMaterial(glowMaterial);
	this.polyline.setWidth(10.0);
};

GeographicPath.prototype.addWayPoint = function (point) {
	if (this.wayPoints[this.wayPoints.length-1] == point) return;
	if (point.select) point.select();
	this.wayPoints.push(point);
	this.display();
};

GeographicPath.prototype.removeWayPoint = function (index) {
	this.wayPoints[index].deselect();
	this.wayPoints.remove(index);
	this.display();
}

GeographicPath.prototype.clearWayPoints = function () {
	this.wayPoints = [];
	this.display();
}

GeographicPath.prototype.display = function () {
	this.buildPath();
	this.polyline.setPositions(this.cartoPoints);
	this.primitives.add(this.polylines);
};

GeographicPath.prototype.clear = function () {
	this.pathDistance = 0;
	this.cartoPoints = [];
	this.polyline.setPositions(this.cartoPoints);
};

GeographicPath.prototype.printInDiv = function (div) {
	div.html("");
	div.append("<div><p><strong>Distance:</strong> "+this.pathDistance.toFixed(2)+" km</p></div>");
	div.append("<div><p><strong>Aiports list:</strong></p></div>");
	var list = $(document.createElement("ol"));
	this.wayPoints.forEach(function (entry, index) {
		list.append("<li><button class='btn btn-xs btn-danger deleteWayPoint' data-index='"+index+"'><span class='glyphicon glyphicon-remove-circle'></span></button> "+entry.getName()+"</li>");
	});
	div.append(list);
}

GeographicPath.prototype.buildPath = function () {
	this.clear();
	var self = this;
	var dist = 50;
	var pathPoints = this.wayPoints;
	
	var addCartoPoint = function addCartoPoint (point, height) {
		var h = (height === undefined ? 9000 : height);
		var cartoPoint = Cesium.Cartographic.fromDegrees(point.lon(), point.lat(), h);
		var cartePoint = self.ellipsoid.cartographicToCartesian(cartoPoint);
		self.cartoPoints.push(cartePoint);
	}
	
	function buildLine (start, end) {
		var distance = start.distanceTo(end);
		self.pathDistance += parseFloat(distance);
		var currentDistance = 0;
		
		function buildPoint(p1) {
			var brng = p1.bearingTo(end);
			var point = p1.destinationPoint(brng, dist);
			addCartoPoint(point);
			return point;
		}
		
		addCartoPoint(start, 0);
		
		while ((currentDistance+dist) < distance) {
			currentDistance += dist;
			start = buildPoint(start);
		}
		
		addCartoPoint(end, 0);
	}
	
	var current = pathPoints[0];
	pathPoints.forEach(function (entry) {
		if (current === entry) return;
		if (!current.latLon) console.log(current);
		if (!entry.latLon) console.log(entry);
		buildLine(current.latLon(), entry.latLon());
		current = entry;
	});
};

/* ------------------------------------------------------ */

var Airports = function (attr) {
	var self = this;
	var scene = attr.scene;
	var ellipsoid = attr.ellipsoid;
	var scale = attr.scale || 0.5;
	var canvas = attr.canvas || (function () {
		var canvas = document.createElement('canvas');
		var size = 12;
		canvas.width = size;
		canvas.height = size;
		var context2D = canvas.getContext('2d');
		context2D.beginPath();
		context2D.arc(size/2, size/2, size/2-1, 0, Cesium.Math.TWO_PI, true);
		context2D.closePath();
		context2D.lineWidth = 1;
		context2D.fillStyle = 'rgb(255, 255, 255)';
		context2D.strokeStyle = 'rgb(0,0,0)'; // red
		context2D.fill();
		context2D.stroke();
		return canvas;
	})();
	var airportsData = attr.airportsData;
	
	this.handler = (function () {
		var handler = new Cesium.ScreenSpaceEventHandler(scene.getCanvas());
		var hoveredAirport;
		
		handler.setInputAction(
			function (movement) {
				if (scene.pick(movement.position) === undefined) return;
				var airport = scene.pick(movement.position).primitive;
				if (airport === undefined || !(airport instanceof Airport)) return;
				var event = new CustomEvent('click', {detail: {point: airport}});
				self.dispatchEvent(event);
			},
			Cesium.ScreenSpaceEventType.LEFT_CLICK
		);
	
		handler.setInputAction(
			function (movement) {
				if (hoveredAirport) {
					hoveredAirport.unhover();
					hoveredAirport = undefined;
				}
				var pickedObject = scene.pick(movement.endPosition);
				if (pickedObject === undefined) return;
				var airport = pickedObject.primitive;
				if (airport === undefined || !(airport instanceof Airport)) return;
				airport.hover();
				var event = new CustomEvent('hover', {detail: {point: airport}});
				self.dispatchEvent(event);
				hoveredAirport = airport;
			},
			Cesium.ScreenSpaceEventType.MOUSE_MOVE
		 );
		
		return handler;
	})();
	
	this.listeners = [];
	this.billboards = new Cesium.BillboardCollection();
	this.textureAtlas = scene.getContext().createTextureAtlas({
		image : canvas
	});
	this.billboards.setTextureAtlas(this.textureAtlas);

	airportsData.features.forEach(function (entry) {
		if (!entry.properties.alternaten) return;
		var billboard = {
			position: ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(entry.geometry.coordinates[0], entry.geometry.coordinates[1])),
			color: self.defaultColor,
			scale: self.scale,
			imageIndex: 0,
			meta: entry.properties
		};
		var airport = new Airport(billboard, self.billboards);
        airport._index = self.billboards._billboards.length;
        self.billboards._billboards.push(airport);
        self.billboards._createVertexArray = true;
	});
	scene.getPrimitives().add(this.billboards);
};

Airports.prototype.addEventListener = function (name, func) {
	this.listeners.push({name: name, func: func});
};

Airports.prototype.dispatchEvent = function (event) {
	this.listeners.forEach(function (entry) {
		if (entry.name === event.type) entry.func(event);
	});
};
/* ---------------------------------------------------------------------------------- */

var Twitter = function () {};

Twitter.prototype.connect = function () {
	var self = this;
	$.ajax({
		url: "twitter_connect.php",
		dataType: "json",
		success: function (data) {
			if (data.token_type === "bearer") {
				self.token = data.access_token;
			}
		},
		error: function (data) {
			self.token = undefined;
		},
		complete: function (data) {
			console.log(self.token);
			if (!self.token) {
				alert("could not connect to twitter");
			}
		}
	});
};

Twitter.prototype.requestFromGeo = function (opt) {
	var self = this;
	if (!self.token) self.connect();
	if (!self.token) return;
	
	var options = opt || {};
	var params = {
		q: "",
		geocode: options.lat+","+options.lon+",10km",
		count: 50,
		result_type: "popular",
	};
	$.ajax({
		url: "https://api.twitter.com/1.1/search/tweets.json",
		dataType: "json",
		data: $.param(params),
		headers: {
			'Authorization': 'Basic '+self.token
		},
		success: function () {
			
		}
	});
};