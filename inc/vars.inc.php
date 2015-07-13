<?php

/*
* @author Vitor Correia
*/


// APP

define('APP_NAME', 'NOS Residencial');
define('APP_COMPANY', 'Connecta Portugal');
define('APP_VERSION', '1.2.1.9');
define('APP_TYPE', 'DEV'); // DEV || PROD
define('APP_LASTUPDATE', '201507131502');
define('APP_DATETIME_YMD', date('Y-m-d'));
define('APP_DATETIME_NEXTWEEK', date('Y-m-d', time() + (7 * 24 * 60 * 60))); // http://php.net/manual/en/function.time.php
define('APP_DATETIME_TIMESTAMP', date('Y-m-d H:i:s'));
define('APP_DATETIME_TIMESTAMP_FILE', date('YmdHis'));
