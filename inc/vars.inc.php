<?php

/**
 * @package NOS_Residencial
 * @author  Vitor Correia
 * @copyright Copyright (c)2015 Connecta Group
 * @license GNU General Public License version 2 or later
 */

// APP

define('APP_NAME', 'NOS Residencial');
define('APP_COMPANY', 'Connecta Portugal');
define('APP_VERSION', '1.2.2.2');
define('APP_TYPE', 'PROD'); // DEV || PROD
define('APP_LASTUPDATE', '201507241823');
define('APP_DATETIME_YMD', date('Y-m-d'));
define('APP_DATETIME_NEXTWEEK', date('Y-m-d', time() + (7 * 24 * 60 * 60))); // http://php.net/manual/en/function.time.php
define('APP_DATETIME_TIMESTAMP', date('Y-m-d H:i:s'));
define('APP_DATETIME_TIMESTAMP_FILE', date('YmdHis'));
