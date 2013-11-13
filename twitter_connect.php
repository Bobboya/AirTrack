<?php
require_once 'protected/TwitterAuth.php';

$tweet = new TwitterAuth("w5Y97YZ2xu7BxYTKPSnf4A", "M2iaiNlVOV1SdO0xr2a0vlqZDVW9TWNl5OR4unWAThc");
echo $tweet->connect();
