var HtmlAirportSelector = function (args) {
	if (!args.dom) throw "You need to give a string representing a dom element";
	if (!args.factory) throw "No factory to retrive types from";
	
	this._factory = args.factory;
	this._dom = args.dom;
	var self = this;
	
	$(this._dom).on('click', 'button', function () {
		var button = $(this);

		var type = button.data('type');
		console.log(type);
		if (!button.hasClass('active')) self._factory.getTypes()[type].show();
		else self._factory.getTypes()[type].hide();
	});
};

HtmlAirportSelector.prototype.refresh = function () {
	var dom = $(this._dom);
	dom.html("");
	
	var types = this._factory.getTypes()
	for (var type in types) {
		if (types.hasOwnProperty(type)){
			dom.append("<button class='btn btn-default btn-block' data-toggle='button' data-type='"+type+"'><img src='"+types[type].imageSrc+"'/> "+types[type].name+"</button>");
		}
	}
};