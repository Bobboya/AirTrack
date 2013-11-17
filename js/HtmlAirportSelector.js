var HtmlAirportSelector = function (args) {
	if (!args.dom) throw "You need to give a string representing a dom element";
	if (!args.factory) throw "No factory to retrive types from";
	
	this._collections = args.factory.getAirportCollection();
	this._dom = args.dom;
	var self = this;
	
	$(this._dom).on('click', 'button', function () {
		var button = $(this);

		var type = button.data('type');
		console.log(type);
		console.log(self._collections.getType({type: type}));
		if (!button.hasClass('active')) self._collections.getType({type: type}).show();
		else self._collection.getType({type: type}).hide();
	});
};

HtmlAirportSelector.prototype.refresh = function () {
	var dom = $(this._dom);
	dom.html("");

	var types = this._collections.getTypes();
	for (var type in types) {
		if (types.hasOwnProperty(type)){
			var collection = this._collections.getType({type: type});
			dom.append("<button class='btn btn-default btn-block' data-toggle='button' data-type='"+type+"'><img src='"+collection.imageSrc+"'/> "+collection.name+"</button>");
		}
	}
};