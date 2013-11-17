function main () {
	var widget = new Cesium.CesiumWidget('cesiumContainer');
				
	var airportFactory = new AirportFactory({
		scene: widget.scene,
		ellipsoid: widget.centralBody.getEllipsoid(),
	});
	largeAirports = airportFactory.createAirportCollection({
		type: 'large_airport',
		imageSrc: '../images/large-airport_24.png',
		name: 'Large airport'
	});
	mediumAirports = airportFactory.createAirportCollection({
		type: 'medium_airport',
		imageSrc: '../images/medium-airport_24.png',
		name: 'Medium airport'
	});
	/*smallAirports = airportFactory.createAirportCollection({
		type: 'small_airport',
		imageSrc: '../images/small-airport_24.png',
		name: 'Small airport'
	});*/
	heliAirports = airportFactory.createAirportCollection({
		type: 'heliport',
		imageSrc: '../images/helicopter-airport_24.png',
		name: 'Heliport'
	});
	seaAirports = airportFactory.createAirportCollection({
		type: 'seaplane_base',
		imageSrc: '../images/seaplane-airport_24.png',
		name: 'Seaplane base'
	});
	
	airports.forEach(function (entry) {
		try {
			airportFactory.create(entry);
		}
		catch (err) {}
	});
	
	airportSelector = new HtmlAirportSelector({
		factory: airportFactory,
		dom: "#airportTypeSelector"
	});
	airportSelector.refresh();
	
	
};