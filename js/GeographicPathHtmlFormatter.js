var GeographicPathHtmlFormatter = function (args) {
	this._dom = $(args.dom);
	this._gPath = args.gPath;

	var self = this;
	this._dom.on("click", '.removeWayPoint', function () {
		var index = $(this).data('index');
		self._gPath.removeWayPoint(index);
		self.refresh();
	});

	this._zoomer = args.cameraZoomer;
	if (this._zoomer) {
		this._dom.on("click", '.zoomTo', function () {
			var index = $(this).data('index');
			var airport = self._gPath.getWayPoint(index);
			self._zoomer.zoomTo({
				latLon: airport.latLon()
			});
		});
	}
};

GeographicPathHtmlFormatter.prototype.refresh = function () {
	var gPath = this._gPath;
	var div = this._dom;

	div.html("");
	div.append("<div><p><strong>Distance:</strong> "+gPath.pathDistance+" km</p></div>");
	div.append("<div><p><strong>Aiports list:</strong></p></div>");
	var list = $(document.createElement("ol"));
	gPath.wayPoints().forEach(function (entry, index) {
		list.append("<li> \
			<button class='btn btn-xs btn-danger removeWayPoint' data-index='"+index+"'> \
				<span class='glyphicon glyphicon-remove-circle'></span> \
			</button>\
			<button class='btn btn-xs btn-success zoomTo' data-index='"+index+"'> \
				<span class='glyphicon glyphicon-screenshot'></span> \
			</button> "+entry.getName()+"</li>");
	});
	div.append(list);
}