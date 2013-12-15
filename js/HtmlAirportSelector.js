//Html selector of the different airport types available
var HtmlAirportSelector = function (args) {
	if (!args.dom) throw "You need to give a string representing a dom element";
	if (!args.collection) throw "No collection to retrieve types from";
	
	this._collections = args.collection;
	this._dom = args.dom;
	var self = this;
	
	$(this._dom).on('click', 'button', function () {
		var button = $(this);

		var type = button.data('type');
		if (!button.hasClass('active')) self._collections.show({type: type});
		else self._collections.hide({type: type});
	});
};

HtmlAirportSelector.prototype.refresh = function () {
	var dom = $(this._dom);
	dom.html("");

	var types = this._collections.getTypes();
	for (var type in types) {
		if (types.hasOwnProperty(type)){
			var collection = types[type];
			dom.append("<button class='btn btn-default btn-block' data-toggle='button' data-type='"+type+"'><img src='"+collection.imageSrc+"'/> "+collection.name+"</button>");
		}
	}
};