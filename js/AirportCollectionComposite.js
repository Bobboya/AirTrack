var AirportTypeCollection = function () {
	this._types = {};
	this._airports = [];
}

AirportTypeCollection.prototype.addType = function (args) {
	this._types[args.type] = this._airports.length;
	this._airports.push(args.collection);
};

AirportTypeCollection.prototype.getTypes = function () {
	return this._types;
};

AirportTypeCollection.prototype.getType = function (args) {
	return this._airports[this._types[args.type]];
}

AirportTypeCollection.prototype.addEventListener = function (name, func) {
	this._airports.forEach(function (entry) {
		entry.addEventListener(name, func);
	});
};

AirportTypeCollection.prototype.dispatchEvent = function (event) {
	this._airports.forEach(function (entry) {
		entry.dispatchEvent(event);
	});
};

AirportTypeCollection.prototype.show = function () {
	this._airports.forEach(function (entry) {
		entry.show();
	});
};

AirportTypeCollection.prototype.hide = function () {
	this._airports.forEach(function (entry) {
		entry.hide();
	});
};

AirportTypeCollection.prototype.addAirport = function (args) {
	var collection = this.getType(args);
	if (!collection) throw "No type added for :"+args.type;
	
	collection._addAirport(args.airport);
};