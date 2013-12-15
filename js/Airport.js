//An airport is a Cesium.Billboard
//Contains a list of known airport destination
var Airport = function (args) {
	Cesium.Billboard.call(this, args.options, args.collection);
	this._isSelected = false;
	this._meta = args.meta || {};
	this._type = args.type || 'NA';
	this._dests = [];
};

Airport.prototype = Object.create(Cesium.Billboard.prototype);

Airport.prototype.latLon = function () {
	return new LatLon(this._meta.latitude_deg, this._meta.longitude_deg);
};

Airport.prototype.addDestination = function (args) {
	var iata = args.iata;
	this._dests.push(iata);
};

Airport.prototype.getDestinations = function () {
	return this._dests;
};

Airport.prototype.select = function () {
	this._isSelected = true;
};

Airport.prototype.deselect = function () {
	this._isSelected = false;
};

Airport.prototype.hover = function () {
	this.setScale(1.4);
};

Airport.prototype.unhover = function () {
	this.setScale(1.0);
};

Airport.prototype.type = function () {
	return this._type;
};

Airport.prototype.meta = function () {
	return this._meta;
};

Airport.prototype.getName = function () {
	return this._meta.name;
}