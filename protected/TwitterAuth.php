<?php

class TwitterAuth {
	
	private $key;
	private $secret;
	
	public function __construct ($key, $secret) {
		$this->key = $key;
		$this->secret = $secret;
	}
	
	public function connect () {
		$url = "https://api.twitter.com/oauth2/token";
		$hash = base64_encode($this->key.":".$this->secret);
		$data = "grant_type=client_credentials";
		
		$http = curl_init($url);
		curl_setopt($http, CURLOPT_POST, true);
		curl_setopt($http, CURLOPT_HTTPHEADER, array(
			"User-Agent: GLAirports",
			"Authorization: Basic ".$hash,
			"Content-Type: application/x-www-form-urlencoded;charset=UTF-8",
			"Host: api.twitter.com"
		));
		curl_setopt($http, CURLOPT_POSTFIELDS, $data);
		curl_setopt($http, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($http, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($http, CURLOPT_SSL_VERIFYHOST, false);
		
		return curl_exec($http);
	}
}