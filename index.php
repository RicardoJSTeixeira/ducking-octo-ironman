<?php

include 'inc/vars.inc.php';
include 'inc/func.inc.php';


// Ler variáveis vindas da GoContact
// Estes campos TÊM de existir na FIN
$oVars = (object)[
    "uuid" => filter_var($_GET["uuid"]),
    "contact_id" => filter_var($_GET["contactid"]),
    "agent_id" => filter_var($_GET["username"]),
    "ip" => getRealIpAddr(),
    "nome" => filter_var($_GET["contact"]),
    "morada" => filter_var($_GET["address"]),
    "localidade" => filter_var($_GET["localidade"]),
    "districto" => filter_var($_GET["districto"]),
    "telefone" => filter_var($_GET["phone"]),
    "cp" => filter_var($_GET["cp"]),
    "email" => filter_var($_GET["email"]),
    "databasename" => filter_var($_GET["databasename"]),
    "phone" => filter_var($_GET["first_phone"])
];


if (APP_TYPE == 'DEV') {

    $oVars = (object)[
        "uuid" => "fscontact_uuid",
        "contact_id" => "contact_id_TST",
        "agent_id" => "vitor-tst",
        "ip" => getRealIpAddr(),
        "nome" => "João José",
        "morada" => "Rua da Campanhã",
        "localidade" => "Álqueva",
        "districto" => "Setúbal",
        "telefone" => "936796196",
        "cp" => "1234-567",
        "email" => "si@connecta.cc",
        "databasename" => "lista-tst",
        "phone" => "936796196"
    ];


    // Tracy Debugger
    include 'inc/tracy/src/tracy.php';
    //use Tracy\Debugger;
    //Debugger::enable();
}


?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="<?= APP_COMPANY; ?>">
    <meta name="version" content="<?= APP_VERSION; ?>">
    <link rel="icon" href="favicon.ico">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>
        <?= APP_COMPANY . ' > ' . APP_NAME . ' v' . APP_VERSION; ?>
        <?php if (APP_TYPE == 'DEV') echo ' ' . APP_TYPE . ' :: ' . APP_LASTUPDATE; ?>
    </title>


    <!-- Icons -->
    <!-- 16x16 -->
    <link rel="shortcut icon" href="//cdn.nos.pt/common/favicon.ico">
    <!-- 32x32 -->
    <link rel="shortcut icon" href="//cdn.nos.pt/common/favicon.png">
    <!-- 57x57 (precomposed) for iPhone 3GS, pre-2011 iPod Touch and older Android devices -->
    <link rel="apple-touch-icon-precomposed" href="//cdn.nos.pt/common/favicon_57.png">
    <!-- 72x72 (precomposed) for 1st generation iPad, iPad 2 and iPad mini -->
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="//cdn.nos.pt/common/favicon_72.png">
    <!-- 114x114 (precomposed) for iPhone 4, 4S, 5 and post-2011 iPod Touch -->
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="//cdn.nos.pt/common/favicon_114.png">
    <!-- 144x144 (precomposed) for iPad 3rd and 4th generation -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="//cdn.nos.pt/common/favicon_144.png">

    <!--iOS -->
    <meta name="apple-mobile-web-app-title" content="NOS">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="white">

    <!-- Windows 8 / RT -->
    <meta name="msapplication-TileImage" content="//cdn.nos.pt/common/favicon_144.png">
    <meta name="msapplication-TileColor" content="#fff">
    <meta http-equiv="cleartype" content="on">


    <!-- Bootstrap -->
    <link href="css/bootstrap.min.paper.css" rel="stylesheet">
    <link
        href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,800,700,400italic,600italic,700italic,800italic,300italic"
        rel="stylesheet" type="text/css">

    <!-- DatePicker -->
    <link href="js/plugins/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <link href="css/jasny-bootstrap.min.css" rel="stylesheet" media="screen">

    <!-- Custom styles for this template -->
    <link href="css/sticky-footer-navbar.css" rel="stylesheet">

    <!-- Fonts -->
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"/>
    <link href="http://fonts.googleapis.com/css?family=Abel|Open+Sans:400,600" rel="stylesheet"/>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- msg -->
    <link media="screen" href="js/plugins/msg/jquery.msg.css" rel="stylesheet" type="text/css">

    <style>

        body {
            font-family: "Open Sans", serif;
            background: transparent;
        }

        /* Override B3 .panel adding a subtly transparent background */
        .panel {
            background-color: rgba(255, 255, 255, 0.9);
        }

        input:required:invalid, input:focus:invalid {
            /* http://www.the-art-of-web.com/html/html5-form-validation/ */
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeVJREFUeNqkU01oE1EQ/mazSTdRmqSxLVSJVKU9RYoHD8WfHr16kh5EFA8eSy6hXrwUPBSKZ6E9V1CU4tGf0DZWDEQrGkhprRDbCvlpavan3ezu+LLSUnADLZnHwHvzmJlvvpkhZkY7IqFNaTuAfPhhP/8Uo87SGSaDsP27hgYM/lUpy6lHdqsAtM+BPfvqKp3ufYKwcgmWCug6oKmrrG3PoaqngWjdd/922hOBs5C/jJA6x7AiUt8VYVUAVQXXShfIqCYRMZO8/N1N+B8H1sOUwivpSUSVCJ2MAjtVwBAIdv+AQkHQqbOgc+fBvorjyQENDcch16/BtkQdAlC4E6jrYHGgGU18Io3gmhzJuwub6/fQJYNi/YBpCifhbDaAPXFvCBVxXbvfbNGFeN8DkjogWAd8DljV3KRutcEAeHMN/HXZ4p9bhncJHCyhNx52R0Kv/XNuQvYBnM+CP7xddXL5KaJw0TMAF8qjnMvegeK/SLHubhpKDKIrJDlvXoMX3y9xcSMZyBQ+tpyk5hzsa2Ns7LGdfWdbL6fZvHn92d7dgROH/730YBLtiZmEdGPkFnhX4kxmjVe2xgPfCtrRd6GHRtEh9zsL8xVe+pwSzj+OtwvletZZ/wLeKD71L+ZeHHWZ/gowABkp7AwwnEjFAAAAAElFTkSuQmCC);
            background-position: right top;
            background-repeat: no-repeat;
            -moz-box-shadow: none;
        }

        input:required:valid {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAepJREFUeNrEk79PFEEUx9/uDDd7v/AAQQnEQokmJCRGwc7/QeM/YGVxsZJQYI/EhCChICYmUJigNBSGzobQaI5SaYRw6imne0d2D/bYmZ3dGd+YQKEHYiyc5GUyb3Y+77vfeWNpreFfhvXfAWAAJtbKi7dff1rWK9vPHx3mThP2Iaipk5EzTg8Qmru38H7izmkFHAF4WH1R52654PR0Oamzj2dKxYt/Bbg1OPZuY3d9aU82VGem/5LtnJscLxWzfzRxaWNqWJP0XUadIbSzu5DuvUJpzq7sfYBKsP1GJeLB+PWpt8cCXm4+2+zLXx4guKiLXWA2Nc5ChOuacMEPv20FkT+dIawyenVi5VcAbcigWzXLeNiDRCdwId0LFm5IUMBIBgrp8wOEsFlfeCGm23/zoBZWn9a4C314A1nCoM1OAVccuGyCkPs/P+pIdVIOkG9pIh6YlyqCrwhRKD3GygK9PUBImIQQxRi4b2O+JcCLg8+e8NZiLVEygwCrWpYF0jQJziYU/ho2TUuCPTn8hHcQNuZy1/94sAMOzQHDeqaij7Cd8Dt8CatGhX3iWxgtFW/m29pnUjR7TSQcRCIAVW1FSr6KAVYdi+5Pj8yunviYHq7f72po3Y9dbi7CxzDO1+duzCXH9cEPAQYAhJELY/AqBtwAAAAASUVORK5CYII=);
            background-position: right top;
            background-repeat: no-repeat;
        }

        .progress_ajax {
            background: #fff url("img/progress.gif") no-repeat center right;
        }

    </style>

</head>

<body>

<div class="container" style="padding: 0">


    <div class="row">

        <div class="col-md-6 panel panel-default">
            <div class="row">
                <div class="col-xs-3"><img src="img/cliente/cliente_logo.png">

                </div>
                <div class="col-xs-6" id="header">
                    <?php if (APP_TYPE == 'DEV')
                        echo '<div role="alert" class="alert alert-danger">' . APP_TYPE . ' :: ' . APP_LASTUPDATE . '</div>';
                    ?>
                </div>
            </div>
        </div>

        <div class="col-md-3 panel panel-default">
            <p><b>Operador:</b> <?= $oVars->agent_id ?></p>

            <p><b>Número:</b> <?= $oVars->telefone ? $oVars->telefone : '[SEM DADOS]' ?></p>

            <p><b>IP:</b> <?= $oVars->ip ?></p>

        </div>

        <div class="col-md-3 panel panel-default">

            <div class="form-group">
                <label
                    for="negativo_datafidelizacao">Caso cliente esteja fidelizado, indicar data de fidelização do actual serviço:</label>
                <input type="text" class="form-control input-sm" id="negativo_datafidelizacao">
            </div>
            <p>
                <button type="button" class="btn btn-sm btn-danger" id="fechar_negativo">Fechar Negativo</button>
                <!--<button type="button" class="btn btn-sm btn-info" id="testes">testes</button>-->
            </p>

        </div>
        <!-- End header -->
    </div>

    <div class="row">
        <!-- Start main content -->
        <div class="col-md-12 panel panel-default" id="container" style="padding: 0"></div>
        <!-- End main content -->
    </div>
    <!-- /container -->

    <footer class="footer" style="display: none;">
        <div class="container">
            <p class="text-muted">
                <?php

                #echo getFooter();
                if (APP_TYPE == 'DEV')
                    echo ' > ' . APP_TYPE . ' :: ' . APP_LASTUPDATE;

                ?>
            </p>
        </div>
    </footer>

    <script>

        var oVars = <?= json_encode($oVars); ?>;

    </script>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="js/plugins/jquery-1.11.2.min.js"></script>

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/plugins/bootstrap.js"></script>
    <script src="js/plugins/jasny-bootstrap.min.js"></script>
    <script src="js/plugins/jquery.validate.min.js"></script>
    <script src="js/plugins/jquery-validate.bootstrap-tooltip.min.js"></script>
    <script src="js/plugins/moment-with-locales.min.js"></script>
    <!-- msg -->
    <script type="text/javascript" src="js/plugins/msg/jquery.center.min.js"></script>
    <script type="text/javascript" src="js/plugins/msg/jquery.msg.min.js"></script>
    <script>
        //change moment local
        moment.locale("pt");
    </script>

    <script src="js/plugins/bootstrap-datetimepicker.min.js"></script>
    <script src="js/plugins/messages_pt_PT.js"></script>
    <script src="js/plugins/bootbox.min.js"></script>
    <script src="js/plugins/mustache.js"></script>
    <script src="js/plugins/lodash.min.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/app1.js"></script>
    <script src="js/app2.js"></script>
    <script src="js/app3.js"></script>
    <script src="js/app4.js"></script>
    <script src="js/app5.js"></script>
    <script src="js/app6.js"></script>
    <script src="js/controller.js"></script>

    <script>

        $("#negativo_datafidelizacao").datetimepicker({
            format: "YYYY-MM-DD"
        })

    </script>

</body>
</html>
