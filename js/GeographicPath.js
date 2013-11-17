
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
		if (!current.latLon()) console.log(current);
		if (!entry.latLon()) console.log(entry);
		buildLine(current.latLon(), entry.latLon());
		current = entry;
	});
};
