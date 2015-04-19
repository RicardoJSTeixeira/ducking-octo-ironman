<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

/*
 * TODO Criar logs de txt com as várias interacções do script e gravar o oVars final
 */

include '../inc/vars.inc.php';
include '../inc/func.inc.php';

$REQVARS = ${"_" . $_SERVER['REQUEST_METHOD']};


$action = filter_var($REQVARS["action"]);

$DBs = new DB();

switch ($action) {

    case "GetPerfil":
        echo json_encode(Script::getPerfil());
        break;

    case "GetProposta":
        $dados = filter_var_array($REQVARS["dados_perfil"]);
        $nr_proposta = filter_var($REQVARS["nr_proposta"]);

        $db = $DBs->Get("FS");
        echo json_encode(Script::getInfoMatriz($db, $dados, $nr_proposta));
        break;

    case "Save":
        $db = $DBs->Get("NOS_Residencial");
        $dados = filter_var_array($REQVARS["dados_chamada"]);
        echo json_encode(Script::save($db, $dados));
        break;

    default:
        die("WTF!?");
}



Class Script
{

    public static function save(PDO $db, $dados)
    {
        // se gravou com sucesso, return true; se não return false

        $oVars = Script::fnMakeInsert($dados);

        try {
            $sqlInsercao = 'INSERT INTO [dbo].[FIN] (' . $oVars["keys"] . ') VALUES (' . $oVars["vals"] . ')';
            $stmt = $db->prepare($sqlInsercao);
            return $stmt->execute($oVars["vars"]);

        } catch (PDOException $ex) {
            echo $ex->getMessage();
            return false;
        }

    }

    private static function fnMakeInsert($aData)
    {
        $sKeys = "";
        $sVals = "";
        $aVars = [];

        Script::fnMakeInsertRecursive($aData, $sKeys, $aVars, $sVals);

        return [
            "keys" => rtrim($sKeys, ","),
            "vals" => rtrim($sVals, ","),
            "vars" => $aVars,
        ];
    }

    private static function fnMakeInsertRecursive($aData, &$sKeys, &$aVars, &$sVals, $thisRoot = "")
    {

        if (!empty($thisRoot))
            $thisRoot = $thisRoot . "_";

        foreach ($aData as $thatKey => $val) {

            if (is_array($val)) {
                Script::fnMakeInsertRecursive($val, $sKeys, $aVars, $sVals, $thisRoot . $thatKey);
                continue;
            }
            $thisKey = "$thisRoot$thatKey";

            $sKeys .= " $thisKey,";
            $sVals .= " :$thisKey,";
            $aVars[":$thisKey"] = $val;

        }
    }

    public static function getPerfil()
    {

        return [
            "aOperadoras" => [
                "VODAFONE",
                "CABOVISAO",
                "CTT - PHONE-IX",
                "ONI",
                "AR TELECOM",
                "COLT",
                "MEO",
                "NOS",
                "OUTROS"
            ],
            "aoPacotes" => [
                [
                    "tem_tv" => false,
                    "tem_net_fixa" => false,
                    "tem_telefone" => false,
                    "tem_telemovel" => true,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "1P_MOVEL"
                ],
                [
                    "tem_tv" => false,
                    "tem_net_fixa" => true,
                    "tem_telefone" => false,
                    "tem_telemovel" => false,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "1P_NET"
                ],
                [
                    "tem_tv" => true,
                    "tem_net_fixa" => false,
                    "tem_telefone" => false,
                    "tem_telemovel" => false,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "1P_TV"
                ],
                [
                    "tem_tv" => false,
                    "tem_net_fixa" => false,
                    "tem_telefone" => true,
                    "tem_telemovel" => false,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "1P_VOZ"
                ],
                [
                    "tem_tv" => false,
                    "tem_net_fixa" => true,
                    "tem_telefone" => true,
                    "tem_telemovel" => false,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "2P_NET_VOZ"
                ],
                [
                    "tem_tv" => true,
                    "tem_net_fixa" => true,
                    "tem_telefone" => false,
                    "tem_telemovel" => false,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "2P_TV_NET"
                ],
                [
                    "tem_tv" => true,
                    "tem_net_fixa" => false,
                    "tem_telefone" => true,
                    "tem_telemovel" => false,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "2P_TV_VOZ"
                ],
                [
                    "tem_tv" => true,
                    "tem_net_fixa" => true,
                    "tem_telefone" => true,
                    "tem_telemovel" => false,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "3P"
                ],
                [
                    "tem_tv" => true,
                    "tem_net_fixa" => true,
                    "tem_telefone" => true,
                    "tem_telemovel" => true,
                    "tem_net_movel" => false,
                    "tipo_pacote" => "4P"
                ],
                [
                    "tem_tv" => true,
                    "tem_net_fixa" => true,
                    "tem_telefone" => true,
                    "tem_telemovel" => true,
                    "tem_net_movel" => true,
                    "tipo_pacote" => "5P"
                ]
            ]
        ];
    }

    public static function getInfoMatriz(PDO $db, $oDados, $nr)
    {

        $propostas = ["primeira_proposta", "segunda_proposta", "terceira_proposta"];

        $where = "";
        $vars = [];

        $where .= " a.tecnologia=:tecnologia ";
        $vars[":tecnologia"] = $oDados['tecnologia'];

        $where .= " AND a.zona_concorrencia=:zona_concorrencia ";
        $vars[":zona_concorrencia"] = $oDados['zona_concorrencia'];

        $bNovoClient = $oDados['cliente_actual'] == 'Sim';
        $where .= " AND a.novo_cliente=:novo_cliente ";
        $vars[":novo_cliente"] = $bNovoClient ? '1' : '';

        if (!$bNovoClient)
            $where .= " AND b.novo_cliente='3' ";

        $where .= " AND a.perfil_de_entrada=:perfil_de_entrada ";
        $vars[":perfil_de_entrada"] = $oDados['pacote']['tipo_pacote'];

        if ($oDados['net_fixa']['tem_computador_portatil'] !== 'Sim') {
            $where .= " AND a.tem_pc=:tem_pc ";
            $vars[":tem_pc"] = '1';
        }

        $where .= " AND a.fid_tv=:fid_tv ";
        $vars["fid_tv"] = $oDados['televisao']['fidelizado'] ? '1' : '';

        $where .= " AND a.fid_movel=:fid_movel ";
        $vars[":fid_movel"] = $oDados['telemovel']['fidelizado'] ? '1' : '';

        $query = "SELECT
                        b.id,
                        grupo,
                        tipo_pacote,
                        perfil,
                        pacote,
                        tv_canais,
                        tv_creditos,
                        tv_horas_gravacao,
                        net,
                        net_movel,
                        telefone,
                        movel_cartoes,
                        movel_minutos,
                        movel_internet,
                        mens_1,
                        mens_1a12,
                        mens_13a24,
                        mens_24,
                        outras_ofertas,
                        envio_cartao_nos,
                        equip_tv,
                        equip_net,
                        pacote_comercial,
                        notas_televisao,
                        notas_net_movel,
                        notas_net,
                        notas_telefone
                  FROM fsdatabases.nos_residencial_propostas b
                  INNER JOIN fsdatabases.nos_residencial_matriz_decisao a ON a." . $propostas[$nr] . " = b.grupo AND a.tecnologia=b.tecnologia
                  where $where ";


        $stmt = $db->prepare($query);
        $stmt->execute($vars);

        $rs = $stmt->fetchAll(PDO::FETCH_OBJ);
        return $rs;

    }

    public static function getInfoProposta(PDO $db)
    {

        $query = "SELECT
                      [id],
                      [grupo],
                      [filtro1],
                      [filtro2],
                      [filtro3],
                      [tipo_pacote],
                      [perfil],
                      [pacote],
                      [tv_canais],
                      [tv_creditos],
                      [tv_horas_gravacao],
                      [net],
                      [net_movel],
                      [telefone],
                      [movel_cartoes],
                      [movel_minutos],
                      [movel_internet],
                      [mens_1],
                      [mens_1a12],
                      [mens_13a24],
                      [mens_24],
                      [outras_ofertas],
                      [envio_cartao_nos],
                      [equip_tv],
                      [equip_net],
                      [pacote_comercial],
                      [notas_televisao],
                      [notas_net_movel],
                      [notas_telefone]
                  FROM [dbo].[Propostas]";

        $stmt = $db->prepare($query);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);

    }
}