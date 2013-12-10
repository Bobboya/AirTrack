var CameraZoomer = function (args) {
	this._scene = args.scene;
};

CameraZoomer.prototype.zoomTo = function (args) {
	var latLon = args.latLon;
	var destination = Cesium.Cartographic.fromDegrees(latLon.lon(), latLon.lat(), 9000.0);

	var flight = Cesium.CameraFlightPath.createAnimationCartographic(this._scene, {
		destination : destination
	});
	this._scene.getAnimations().add(flight);
};