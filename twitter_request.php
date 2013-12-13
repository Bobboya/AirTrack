<?php
require_once 'protected/TwitterRequest.php';

$tweet = new TwitterRequest($_GET["token"], $_GET["lat"], $_GET["lon"]);
echo $tweet->request();
