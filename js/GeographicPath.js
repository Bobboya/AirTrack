//Geographic path between airports
var GeographicPath = function (args) {
	this.scene = args.scene;
	this.ellipsoid = args.ellipsoid;
	this.primitives = this.scene.getPrimitives();
	
	this.pathDistance = 0;
	this.cartoPoints = [];
	this._wayPoints = [];
	
	this.polylines = new Cesium.PolylineCollection();
	this.polyline = this.polylines.add();
	
	var glowMaterial = Cesium.Material.fromType(Cesium.Material.PolylineGlowType);
	glowMaterial.uniforms.innerWidth = 3.0;
	glowMaterial.uniforms.color = args.color || new Cesium.Color(1.0, 0.5, 0.0, 1.0);
	this.polyline.setMaterial(glowMaterial);
	this.polyline.setWidth(10.0);
};

//Add an airport to the path
GeographicPath.prototype.addWayPoint = function (point) {
	if (this._wayPoints[this._wayPoints.length-1] == point) return;
	this._wayPoints.push(point);
	this.display();
};

//Remove an airport from the path
GeographicPath.prototype.removeWayPoint = function (index) {
	this._wayPoints[index].deselect();
	this._wayPoints.remove(index);
	this.display();
};

//Clear the path
GeographicPath.prototype.clearWayPoints = function () {
	this._wayPoints = [];
	this.display();
};

GeographicPath.prototype.getWayPoint = function (i) {
	return this._wayPoints[i];
};

GeographicPath.prototype.wayPoints = function () {
	return this._wayPoints;
};

//Display the path on the globe
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

//Build the geographic path
GeographicPath.prototype.buildPath = function () {
	this.clear();
	var self = this;
	var dist = 200;
	var pathPoints = this._wayPoints;
	
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
		buildLine(current.latLon(), entry.latLon());
		current = entry;
	});
};
