var Airport = function (args) {
	Cesium.Billboard.call(this, args.options, args.collection);
	this._isSelected = false;
	this._meta = args.meta || {};
};

Airport.prototype = Object.create(Cesium.Billboard.prototype);

Airport.prototype.latLon = function () {
	return new LatLon(this._meta.latitude_deg, this._meta.longitude_deg);
};

Airport.prototype.select = function () {
	this._isSelected = true;
};

Airport.prototype.deselect = function () {
	this._isSelected = false;
};

Airport.prototype.hover = function () {
};

Airport.prototype.unhover = function () {
};