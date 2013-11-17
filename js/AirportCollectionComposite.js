var AirportCollectionComposite = function () {
	this._airports = [];
}

AirportCollectionComposite.prototype.addCollection = function (args) {
	this._airports.push(airportCollection);
};

AirportCollectionComposite.prototype.addEventListener = function (name, func) {
	this._airports.forEach(function (entry) {
		entry.addEventListener(name, func);
	});
};

AirportCollectionComposite.prototype.dispatchEvent = function (event) {
	this._airports.forEach(function (entry) {
		entry.dispatchEvent(event);
	});
};

AirportCollectionComposite.prototype.show = function () {
	this._airports.forEach(function (entry) {
		entry.show();
	});
}

AirportCollectionComposite.prototype.hide = function () {
	this._airports.forEach(function (entry) {
		entry.hide();
	});
}

AirportCollection.prototype.addAirport = function (airport) {
	
}
