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
			//Creating airport and routes
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
			
			//Html output of the different airport types
			var airportSelector = new HtmlAirportSelector({
				collection: collection,
				dom: "#airportTypeSelector"
			});
			airportSelector.refresh();
			
			//Object allowing zooming to a specific airport
			var cZoomer = new CameraZoomer({
				scene: widget.scene
			});
			
			//Geographic path to add the airports in
			var gPath = new GeographicPath ({
				scene: widget.scene,
				ellipsoid: widget.centralBody.getEllipsoid(),
			});
			
			//Twitter request
			var twitter = new Twitter({
				dom: "#tweets"
			});
			
			//Html output of the geographic path
			var gPathFormatter = new GeographicPathHtmlFormatter({
				dom: "#geographicPathInfo",
				gPath: gPath,
				cameraZoomer: cZoomer,
				twitter: twitter
			});
			//Represent the destination lines
			var destLines = new GeographicDestinationLines({
				scene: widget.scene,
				ellipsoid: widget.centralBody.getEllipsoid(),
			});
			
			////////////////////
			//// LISTENERS /////
			////////////////////
			collection.addEventListener('hover', function (event) {
				var infoDiv = $("#airportInfo");
				infoDiv.html("");
				infoDiv.append("<ul>");
				var list = infoDiv.children("ul");
				
				/*
				iata_code -> Code AITA
				name -> Nom
				municipality -> Ville
				longitude_deg -> Longitude
				latitude_deg -> Latitude
				elevation_ft -> Altitude (m)
				home_link -> Site Web
				wikipedia_link -> Wikipedia
				*/
				var airport = event.detail.airport;

				if(airport.meta().hasOwnProperty('iata_code')) {
					iata_code = airport.meta()['iata_code'];
					if(iata_code != "") {
						list.append("<li><strong>Code AITA: </strong>" + iata_code + "</li>");
					}
				}

				if(airport.meta().hasOwnProperty('name')) {
					name = airport.meta()['name'];
					if(name != "") {
						list.append("<li><strong>Nom: </strong>" + name + "</li>");
					}
				}
				
				if(airport.meta().hasOwnProperty('municipality')) {
					municipality = airport.meta()['municipality'];
					if(municipality != "") {
						list.append("<li><strong>Ville: </strong>" + municipality + "</li>");
					}
				}

				if(airport.meta().hasOwnProperty('longitude_deg')) {
					longitude_deg = airport.meta()['longitude_deg'];
					if(longitude_deg != "") {
						list.append("<li><strong>Longitude: </strong>" + Math.round(longitude_deg*1000)/1000 + "</li>");
					}
				}

				if(airport.meta().hasOwnProperty('latitude_deg')) {
					latitude_deg = airport.meta()['latitude_deg'];
					if(latitude_deg != "") {
						list.append("<li><strong>Latitude: </strong>" + Math.round(latitude_deg*1000)/1000 + "</li>");
					}
				}

				if(airport.meta().hasOwnProperty('elevation_ft')) {
					elevation_ft = airport.meta()['elevation_ft'];
					if(elevation_ft != "") {
						list.append("<li><strong>Altitude (m): </strong>" + (elevation_ft*0.3048).toFixed(0) + "</li>");
					}
				}

				if(airport.meta().hasOwnProperty('home_link')) {
					home_link = airport.meta()['home_link'];
					if(home_link != "") {
						list.append("<li><strong>Site web: </strong><a href=\"" + home_link + "\">" + home_link + "</a></li>");
					}
				}

				if(airport.meta().hasOwnProperty('wikipedia_link')) {
					wikipedia_link = airport.meta()['wikipedia_link'];
					if(wikipedia_link != "") {
						list.append("<li><strong>Wikipedia: </strong><a href=\"" + wikipedia_link + "\">" + wikipedia_link + "</a></li>");
					}
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