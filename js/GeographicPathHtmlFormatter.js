var GeographicPathHtmlFormatter = function (args) {
	this._dom = $(args.dom);
	this._gPath = args.gPath;

	var self = this;
	this._dom.on("click", '.removeWayPoint', function () {
		var index = $(this).data('index');
		self._gPath.removeWayPoint(index);
		self.refresh();
	});
};

GeographicPathHtmlFormatter.prototype.refresh = function () {
	var gPath = this._gPath;
	var div = this._dom;

	div.html("");
	div.append("<div><p><strong>Distance:</strong> "+gPath.pathDistance+" km</p></div>");
	div.append("<div><p><strong>Aiports list:</strong></p></div>");
	var list = $(document.createElement("ol"));
	gPath.wayPoints().forEach(function (entry, index) {
		list.append("<li><button class='btn btn-xs btn-danger removeWayPoint' data-index='"+index+"'><span class='glyphicon glyphicon-remove-circle'></span></button> "+entry.getName()+"</li>");
	});
	div.append(list);
}