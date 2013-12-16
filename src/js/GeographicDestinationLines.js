//Polyline collection displaying destination of a LatLon point
//It creates geographic polylines originating from a point and going to one or more destinations
var GeographicDestinationLines = function (args) {
	this._scene = args.scene;
	this.ellipsoid = args.ellipsoid;
	this._color = args.color || new Cesium.Color(0.2, 0.7, 0.2, 1.0);
	
	this._start = args.start;
	this._polylines = new Cesium.PolylineCollection();
};

//Add a LatLon destination
GeographicDestinationLines.prototype.addDestination = function (point) {
	this._addLine(this._start.latLon(), point.latLon());
};

//Should be private
//Create a cesium polyline from an array of point
GeographicDestinationLines.prototype._newPolyline = function (args) {
	var positions = args.positions;
	
	var polyline = this._polylines.add({
		positions: positions
	});
	polyline.setWidth(3.0);
	
	var glowMaterial = Cesium.Material.fromType(Cesium.Material.PolylineGlowType);
	glowMaterial.uniforms.color = this._color;
	glowMaterial.uniforms.innerWidth = 1.0;
	polyline.setMaterial(glowMaterial);
	
	return polyline;
};

GeographicDestinationLines.prototype._cartoPoint = function (point, height) {
	var h = (height === undefined ? 9000 : height);
	var cartoPoint = Cesium.Cartographic.fromDegrees(point.lon(), point.lat(), h);
	var cartePoint = this.ellipsoid.cartographicToCartesian(cartoPoint);
	return cartePoint;
};

//Set the origin point
GeographicDestinationLines.prototype.setStart = function (start) {
	this._start = start;
	this.clear();
}

//Create a geographic line between two points
GeographicDestinationLines.prototype._addLine = function (start, end) {
	var dist = 200;
	var cartoPoints = [];
	
	var distance = start.distanceTo(end);
	var currentDistance = 0;
	
	cartoPoints.push(this._cartoPoint(start, 0));
	
	while ((currentDistance+dist) < distance) {
		currentDistance += dist;
		var brng = start.bearingTo(end);
		var point = start.destinationPoint(brng, dist);
		cartoPoints.push(this._cartoPoint(point, 0));
		start = point;
	}
	
	cartoPoints.push(this._cartoPoint(end, 0));
	this._newPolyline({
		positions: cartoPoints
	});
};

GeographicDestinationLines.prototype.clear = function () {
	this._polylines.removeAll();
};

GeographicDestinationLines.prototype.display = function () {
	this._primitive = this._scene.getPrimitives().add(this._polylines);
};
