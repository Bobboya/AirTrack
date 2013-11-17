var AirportCollection = function (args) {
	Cesium.BillboardCollection.call(this);
	var self = this;
	this._scene = args.scene;
	this._listeners = [];
	this._primitive = undefined;
	this.name = args.name;
	this.imageSrc = args.imageSrc;
	
	var image = new Image();
	image.onload = function() {
		var textureAtlas = self._scene.getContext().createTextureAtlas({
			image : image,
		});
		self.setTextureAtlas(textureAtlas);
	};
    image.src = args.imageSrc || '../images/original-airport_24.png';
	
	//Control manager
	this.handler = (function () {
		var handler = new Cesium.ScreenSpaceEventHandler(self._scene.getCanvas());
		var hoveredAirport = undefined;
		
		handler.setInputAction(
			function (movement) {
				if (self._scene.pick(movement.position) === undefined) return;
				var airport = self._scene.pick(movement.position).primitive;
				if (airport === undefined || !(airport instanceof Airport)) return;
				var event = new CustomEvent('click', {detail: {airport: airport}});
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
				var pickedObject = self._scene.pick(movement.endPosition);
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
};

AirportCollection.prototype = Object.create(Cesium.BillboardCollection.prototype);

AirportCollection.prototype.addEventListener = function (name, func) {
	this._listeners.push({name: name, func: func});
};

AirportCollection.prototype.dispatchEvent = function (event) {
	this._listeners.forEach(function (entry) {
		if (entry.name === event.type) entry.func(event);
	});
};

AirportCollection.prototype._addAirport = function (airport) {
	airport._index = this._billboards.length;
	airport._imageIndex = 0;
    this._billboards.push(airport);
    this._createVertexArray = true;
}

AirportCollection.prototype.show = function () {
	this._scene.getPrimitives().add(this);
}

AirportCollection.prototype.hide = function () {
	this._scene.getPrimitives().remove(this);
}

AirportCollection.prototype.destroy = function () {
};