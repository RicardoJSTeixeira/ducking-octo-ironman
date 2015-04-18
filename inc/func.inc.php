<?php

/*

@author Vitor Correia
@lastupdate 201504190033

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

function bdPDOMSSQLClientes()
{

    $emDebug = true;

    try {

        $pdoMSSQLClientes = new PDO(DB_DSN_MSSQL_CLIENTES, DB_USERNAME, DB_PASSWORD, array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
        );

    } catch (PDOException $exPDOMSSQL) {

        if ($emDebug) {
            exit($exPDOMSSQL->getMessage());
        } else {
            exit('Erro na ligação à BD!');
        }

    }

    return $pdoMSSQLClientes;
}

function bdPDOMSSQLDark()
{

    $emDebug = true;

    try {

        $pdoMSSQLDark = new PDO(DB_DSN_MSSQL_DARK, DB_USERNAME_DARK, DB_PASSWORD_DARK, array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
        );

    } catch (PDOException $exPDOMSSQL) {

        if ($emDebug) {
            exit($exPDOMSSQL->getMessage());
        } else {
            exit('Erro na ligação à BD!');
        }

    }

    return $pdoMSSQLDark;
}

function bdPDOMSSQLICNOSResidencial()
{

    $emDebug = true;

    try {

        $pdoMSSQLICNOSResidencial = new PDO(
            DB_DSN_MSSQL_IC_NOSRESIDENCIAL,
            DB_USERNAME_IC,
            DB_PASSWORD_IC,
            array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            )
        );

    } catch (PDOException $exPDOMSSQL) {

        if ($emDebug) {
            throw $exPDOMSSQL;
        } else {
            echo('Erro na ligação à BD!');
        }

    }

    return $pdoMSSQLICNOSResidencial;
}

function bdPDOPSQLNOSResidencial()
{
    try {
        //$oPropertiesJSON = file_get_contents("/opt/fscontact-server/modules/utils/pg/pg-settings.json");
        //$oProperties = json_decode($oPropertiesJSON);

        //$db = new PDO("pgsql:dbname=" . $oProperties->database . ";host=" . $oProperties->serverip, $oProperties->username, $oProperties->password);
        $db = new PDO("pgsql:dbname=fusionpbx;host=172.16.7.27", "postgres", "");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $db->exec("SET CLIENT_ENCODING TO 'UTF8'");
    } catch (PDOException $e) {
        echo('Connection failed: ' . $e->getMessage());
    }

    return $db;
}

// Strings


//-------------------------------------------------------------------
/**
 * StartsWith
 * Tests if a text starts with an given string.
 *
 * @param     string
 * @param     string
 * @return    bool

http://www.jonasjohn.de/snippets/php/starts-with.htm
 *
 * $ExampleText = 'Hello world!';
 *
 * if (StartsWith($ExampleText, 'Hello')){
 * print 'The text starts with hello!';
 * }
 *
 *
 * $ExampleText = 'Evil monkey.';
 *
 * if (!StartsWith($ExampleText, 'monkey')){
 * print 'The text does not start with monkey!';
 * }
 */

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
