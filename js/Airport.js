var Airport = function (args) {
	Cesium.Billboard.call(this, args.options, args.collection);
	this._isSelected = false;
	this._meta = args.meta || {};
	this._type = args.type || 'NA';
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
	this._scale = 2.0;
};

Airport.prototype.unhover = function () {
	this._scale = 1.0;
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