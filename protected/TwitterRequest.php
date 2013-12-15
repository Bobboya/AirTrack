<?php

/*
 * Handle requests to the twitter API
 */
class TwitterRequest {
	
	public function __construct ($token, $lat, $lon) {
		$this->token = $token;
		$this->lat = $lat;
		$this->lon = $lon;
		//5km radius around the airport position
		$this->radius = "5km";
		$this->type = "Bearer";
		$this->url = "https://api.twitter.com/1.1/search/tweets.json";
	}
	
	public function request() {
		$data = array(
			'q'=>'',
			'locale'=>'fr',
			'geocode'=>"$this->lat,$this->lon,$this->radius",
		);
		$args = http_build_query($data) . "\n";
		
		$http = curl_init("$this->url?$args");
		curl_setopt($http, CURLOPT_HTTPGET, true);
		curl_setopt($http, CURLOPT_HTTPHEADER, array(
			"User-Agent: GLAirports",
			"Authorization: $this->type $this->token",
			"Content-Type: application/x-www-form-urlencoded;charset=UTF-8",
			"Host: api.twitter.com"
		));
		curl_setopt($http, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($http, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($http, CURLOPT_SSL_VERIFYHOST, false);
		
		return curl_exec($http);
	}
}