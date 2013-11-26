var AirportTypeCollection = function (args) {
	Cesium.BillboardCollection.call(this);
	
	var self = this;
	this._scene = args.scene;
	this._listeners = [];
	this._types = {};
	this._typesNumber = 0;
	this._typesLoaded = 0;
	this._hiddenTypes = {};
	this._iata = {};
	this._textureAtlas = self._scene.getContext().createTextureAtlas();
	this.setTextureAtlas(this._textureAtlas);
	
	var canvas = (function () {
		var canvas = document.createElement('canvas');
		var size = 4;
		canvas.width = size;
		canvas.height = size;
		var context2D = canvas.getContext('2d');
		context2D.fillStyle = 'rgba(255, 255, 255, 0)';
		context2D.fillRect(10, 20, 200, 100);
		return canvas;
	})();
	self._noImage = self._textureAtlas.addImage(canvas);
	
	this._addType({
		index: 0,
		types: args.types,
		lastCallback: args.lastCallback
	});
	
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
				var event = new CustomEvent('hover', {detail: {airport: airport}});
				self.dispatchEvent(event);
				hoveredAirport = airport;
			},
			Cesium.ScreenSpaceEventType.MOUSE_MOVE
		 );
		
		return handler;
	})();
};

AirportTypeCollection.prototype = Object.create(Cesium.BillboardCollection.prototype);

AirportTypeCollection.prototype._addType = function (args) {
	var typeIndex = args.index;
	var types = args.types;
	var type = args.types[typeIndex];
	var lastCallback = args.lastCallback;
	
	var self = this;
	this._types[type.type] = {
		imageSrc: type.imageSrc,
		name: type.name
	};
	this.hide(type);
	
	var image = new Image();
	image.src = type.imageSrc;
	image.onload = function() {
		var atlasIndex = self._textureAtlas.addImage(this);
		self._types[type.type].index = atlasIndex;
		if (typeIndex < types.length-1) {
			args.index++;
			self._addType(args);
		}
		else {
			lastCallback(self);
			self._finalize();
		}
	};
    
};

AirportTypeCollection.prototype.addEventListener = function (name, func) {
	this._listeners.push({name: name, func: func});
};

AirportTypeCollection.prototype.dispatchEvent = function (event) {
	this._listeners.forEach(function (entry) {
		if (entry.name === event.type) entry.func(event);
	});
};

AirportTypeCollection.prototype.addAirport = function (airport) {
	if (!this._types[airport.type()]) {
		if (this.verbose) console.warn("Type "+airport.type()+" doesn't exists in this collection");
		return;
	}
	airport._index = this._billboards.length;
	airport._billboardCollection = this;
	airport._imageIndex = this._noImage;
	this._iata[airport.meta().iata_code.toLowerCase()] = airport._index;
    this._billboards.push(airport);
    this._createVertexArray = true;
};

AirportTypeCollection.prototype.getAirportByIata = function (args) {
	var iata = args.iata.toLowerCase();
	return this._billboards[this._iata[iata]];
};

AirportTypeCollection.prototype._finalize = function () {
	this._scene.getPrimitives().add(this);
};

AirportTypeCollection.prototype.hide = function (args) {
	this._hiddenTypes[args.type] = true;
	this._updateImage();
};

AirportTypeCollection.prototype.show = function (args) {
	this._hiddenTypes[args.type] = false;
	this._updateImage();
};

AirportTypeCollection.prototype._updateImage = function () {
	var self = this;
	this._createVertexArray = true;
	this._billboards.forEach(function (airport) {
		if (self._hiddenTypes[airport.type()]) {
			airport._imageIndex = self._noImage;
		}
		else {
			airport._imageIndex = self._types[airport.type()].index;
		}
	});
};

AirportTypeCollection.prototype.getTypes = function () {
	return this._types;
};