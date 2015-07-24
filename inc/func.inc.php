<?php

/**
 * @package NOS_Residencial
 * @author  Vitor Correia
 * @copyright Copyright (c)2015 Connecta Group
 * @license GNU General Public License version 2 or later
 */

function getFooter()
{
    return APP_NAME . " v." . APP_VERSION . ' - ' . APP_COMPANY;
}

function getAppName()
{
    return APP_NAME;
}

function getAppCompany()
{
    return APP_COMPANY;
}


// BDs
Class DB
{

    private $oDBs;

    public function __construct()
    {

        $this->oDBs = $this->fnGetFile();
        return $this;

    }

    public function Get($dbName)
    {

        if (!isset($this->oDBs->{$dbName}))
            throw new Exception("No DB Name :: $dbName");
        else
            $db = $this->oDBs->{$dbName};

        $emDebug = true;

        try {

            $connection = new PDO($db->connect_string, $db->user, $db->pass, array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );

            if ($dbName == "FS") {
                $connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $connection->exec("SET CLIENT_ENCODING TO 'UTF8'");
            }

        } catch (PDOException $exPDOMSSQL) {

            if ($emDebug) {
                exit($exPDOMSSQL->getMessage());
            } else {
                exit('Erro na ligação à BD!');
            }

        }

        return $connection;
    }

    private function fnGetFile()
    {

        $sPath = "../configs/dbs.json";

        if (!file_exists($sPath))
            throw new Exception("File Config doesn't Exists!");

        $sDB_config_raw = file_get_contents($sPath);

        $oDB = json_decode($sDB_config_raw);

        if (json_last_error() !== JSON_ERROR_NONE)
            throw new Exception("File Config Bad Format!");

        return $oDB;

    }

}

// Strings

function StartsWith($Haystack, $Needle)
{
    // Recommended version, using strpos
    return strpos($Haystack, $Needle) === 0;
}

// Another way, using substr
function StartsWithOld($Haystack, $Needle)
{
    return substr($Haystack, 0, strlen($Needle)) == $Needle;
}

//-------------------------------------------------------------------

// Networking

function getRealIpAddr()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
    {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
    {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

function getNameFromIp($ip)
{

    return gethostbyaddr($ip);

}


// Validações Connecta

function verificarPrefixTelefValid($telefone)
{

    $linkCaress = bdPDOMSSQLClientes();

    $sql = "SELECT Count(Telefone) AS CONTAGEM FROM clientes.[PrefixTelefValid] WITH(NOLOCK) WHERE Telefone = '" . substr($telefone, 0, 3) . "'";
    $testarPrefixTelefValid = $linkCaress->prepare($sql);
    $testarPrefixTelefValid->execute();
    $resultado = $testarPrefixTelefValid->fetch();

    $linkCaress = null;

    //var_dump($resultado);
    //exit();

    if ($resultado['CONTAGEM'] > 0) {

        return true;

    } else {

        return false;

    }

}
