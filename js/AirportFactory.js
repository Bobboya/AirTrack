var AirportFactory = function (args) {
	if (!args.ellipsoid) {
		throw "No ellipsoid specified";
	}
	this._ellipsoid = args.ellipsoid;
};

AirportFactory.prototype.create = function (airportDef) {
	if (!airportDef.type) throw "No type defined for the airport";
	if (!airportDef.longitude_deg) throw "No longitude specified";
	if (!airportDef.latitude_deg) throw "No latitude specified";
	
	var billboard = {
		position: this._ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(airportDef.longitude_deg, airportDef.latitude_deg)),
	};
	
	var airport = new Airport({
		options: billboard,
		meta: airportDef,
		type: airportDef.type
	});
	
	return airport;
};