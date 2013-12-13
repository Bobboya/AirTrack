// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

function main () {
	var widget = new Cesium.CesiumWidget('cesiumContainer');
	
	var factory = new AirportFactory ({
		ellipsoid: widget.centralBody.getEllipsoid(),
	});
	
	var collection = new AirportTypeCollection({
		scene: widget.scene,
		types: [
			{
				type: 'large_airport',
				imageSrc: '../images/large-airport_24.png',
				name: 'Large airport'
			},
			{
				type: 'medium_airport',
				imageSrc: '../images/medium-airport_24.png',
				name: 'Medium airport'
			},
			{
				type: 'small_airport',
				imageSrc: '../images/small-airport_24.png',
				name: 'Small airport'
			},
			{
				type: 'heliport',
				imageSrc: '../images/helicopter-airport_24.png',
				name: 'Heliport'
			},
			{
				type: 'seaplane_base',
				imageSrc: '../images/seaplane-airport_24.png',
				name: 'Seaplane base'
			},
			{
				type: 'closed',
				imageSrc: '../images/closed-airport_24.png',
				name: 'Closed airport'
			},
		],
		lastCallback: function (collection) {
			airports.forEach(function (entry) {
				var airport = factory.create(entry);
				collection.addAirport(airport);
			});
			delete airports;
			
			routes.forEach(function (entry, index) {
				var source = collection.getAirportByIata({
					iata: entry['SourceAirport']
				});
				var dest = collection.getAirportByIata({
					iata: entry['DestinationAirport']
				});
				if (!source || !dest) {
					return;
				}
				source.addDestination({
					iata: entry['DestinationAirport']
				});
			});
			delete routes;
			
			var airportSelector = new HtmlAirportSelector({
				collection: collection,
				dom: "#airportTypeSelector"
			});
			airportSelector.refresh();
			
			var cZoomer = new CameraZoomer({
				scene: widget.scene
			});

			var gPath = new GeographicPath ({
				scene: widget.scene,
				ellipsoid: widget.centralBody.getEllipsoid(),
			});

			var twitter = new Twitter({
				dom: "#tweets"
			});
			var gPathFormatter = new GeographicPathHtmlFormatter({
				dom: "#geographicPathInfo",
				gPath: gPath,
				cameraZoomer: cZoomer,
				twitter: twitter
			});
			
			var destLines = new GeographicDestinationLines({
				scene: widget.scene,
				ellipsoid: widget.centralBody.getEllipsoid(),
			});
			
			collection.addEventListener('hover', function (event) {
				var infoDiv = $("#airportInfo");
				infoDiv.html("");
				infoDiv.append("<ul>");
				var list = infoDiv.children("ul");
				
				var airport = event.detail.airport;
				for (key in airport.meta()) {
					if (airport.meta().hasOwnProperty(key)) {
						if(key == "wikipedia_link") {
							list.append("<li>"+key+": <a href=\""+airport.meta()[key]+"\">"+airport.meta()[key]+"</a></li>");
						} else {
							list.append("<li>"+key+": "+airport.meta()[key]+"</li>");
						}
					};
				}
			});
			
			collection.addEventListener('click', function (event) {
				var airport = event.detail.airport;
				gPath.addWayPoint(airport);
			});
			
			collection.addEventListener('click', function (event) {
				var airport = event.detail.airport;
				destLines.setStart(airport);
				var dests = airport.getDestinations();
				dests.forEach(function (entry) {
					var dest = collection.getAirportByIata({
						iata: entry
					});
					destLines.addDestination(dest);
				});
				destLines.display();
			});

			collection.addEventListener('click', function (event) {
				gPathFormatter.refresh();
			});
			
			
			twitter.connect();
		},
	});
};