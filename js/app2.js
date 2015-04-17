/**
 * Created by vitor.correia on 10-04-2015.
 */

var app2 = (function () {

    var oDados = [];
    var fnNextPag;
    var fnPreviousPag;


    function fnInit() {
        if ($("#container").find("#pag2").length) {
            $("#container").find("#pag2").show();
            return true
        }

        $.get("pages/pag2.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oVars);

                $("#container").append(sRendered);

                fnGetDados();

                fnSetEvents();

            },
            "html")

    }

    function fnSetNextPage(fn) {
        fnNextPag = fn;
    }

    function fnSetPreviousPage(fn) {
        fnPreviousPag = fn;
    }

    function fnGetDados() {

        // vai buscar os dados dos perfis de entrada, para um array local
        $.get("ajax/request.php",
            {action: "GetPerfil"},
            function (aDadosRecebidos) {
                oDados = aDadosRecebidos;

                fnPopulate();
            }, "json")

    }

    function fnPopulate() {


        var sOptions = "<option value='nothing'>[Seleccione uma opção]</option>\
        <option data-pacote='" + JSON.stringify({tipo_pacote: "-", operadora: ""}) + "' >SEM PERFIL</option>";


        oDados.aOperadoras.forEach(function (sOperadora) {

            oDados.aoPacotes.forEach(function (oPacote) {

                oPacote.operadora = sOperadora;
                sOptions += "<option data-pacote='" + JSON.stringify(oPacote) + "' >" + sOperadora + '_' + oPacote.tipo_pacote + "</option>"

            })
        });
        $("#perfil_entrada").append(sOptions);

    }

    function fnSetEvents() {
        $("#perfil_entrada").change(function () {

            // limpar formatações derivadas de filtros
            $(".tag_servicos")
                .removeClass("label label-primary")
                .removeClass("label label-info")
                .removeClass("label label-success")
                .removeClass("label label-warning")
                .removeClass("label label-danger");


            var oPacote = $(":selected", this).data("pacote"); // recolhe o index do SELECT do Perfil de Entrada

            var bOk = !_.isEmpty(oPacote); // se não estiver vazio, é porque pode continuar
            $("#pag2_continuar").toggle(bOk);

            if (!bOk)//Se not ok salta fora
                return false;


            // vai buscar os dados ao array local, filtrando pelo index recolhido
            var oDados = $(":selected", this).data("pacote");

            var sOperadora = oDados.operadora.toLowerCase();

            if (oDados.tem_tv) {
                //$("#tem_tv").addClass("bg-primary");
                //$("#tem_tv_" + sOperadora).addClass("bg-primary")
                $("#tem_tv").addClass("label label-primary");
                $("#tem_tv_" + sOperadora).addClass("label label-primary")
            }
            if (oDados.tem_net_fixa) {
                $("#tem_net_fixa").addClass("label label-info");
                $("#tem_net_fixa_" + sOperadora).addClass("label label-info")
            }
            if (oDados.tem_telefone) {
                $("#tem_telefone").addClass("label label-success");
                $("#tem_telefone_" + sOperadora).addClass("label label-success")
            }
            if (oDados.tem_telemovel) {
                $("#tem_telemovel").addClass("label label-warning");
                $("#tem_telemovel_" + sOperadora).addClass("label label-warning")
            }
            if (oDados.tem_net_movel) {
                $("#tem_net_movel").addClass("label label-danger");
                $("#tem_net_movel_" + sOperadora).addClass("label label-danger")
            }
        });

        // permitir apenas floats nas mensalidades
        $('#mensalidade_total').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $('#tem_tv_mensalidade').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $('#tem_net_fixa_mensalidade').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $('#tem_telefone_mensalidade').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        $('#tem_net_movel_mensalidade').keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        //next page
        $("#pag2_continuar").click(function () {

            if (!fnPaginaValidada())
                return false;

            fnNextPag();

        });

        //previous
        $("#pag2_back").click(function () {

            fnPreviousPag();

        });
    }

    function fnGetValues() {
        return {

            pacote: $("#perfil_entrada :selected").data("pacote"),
            tecnologia: $("[name=tecnologia]:checked").val(),
            zona_concorrencia: $("[name=zona_concorrencia]:checked").val(),
            cliente_actual: $("[name=actual_cliente]:checked").val(),
            mensalidade_total: $("#mensalidade_total").val(),
            televisao: {
                fidelizado: $("#tem_tv_fidelizado").is(":checked"),
                mensalidade: $("#tem_tv_mensalidade").val(),
                tipo_canais_tem: $("[name=tipo_canais_tem]:checked").val(),
                tipo_canais_gostava_ver: $("#tipo_canais_gostava_ver").val()
            },
            net_fixa: {
                fidelizado: $("#tem_net_fixa_fidelizado").is(":checked"),
                mensalidade: $("#tem_net_fixa_mensalidade").val(),
                tem_computador_portatil: $("[name=tem_computador_portatil]:checked").val(),
                velocidade_em_casa: $("[name=velocidade_em_casa]:checked").val()
            },
            telefone: {
                fidelizado: $("#tem_telefone_fidelizado").is(":checked"),
                mensalidade: $("#tem_telefone_mensalidade").val(),
                tipo_chamadas_inclui: $("#tipo_chamadas_inclui").val(),
                familiares_no_estrangeiro: $("[name=tem_familiares_estrangeiro]:checked").val()
            },
            telemovel: {
                fidelizado: $("#tem_telemovel_fidelizado").is(":checked"),
                mensalidade: $("#tem_telemovel_mensalidade").val(),
                costuma_ligar_sms_outras_redes: $("[name=ligar_enviar_sms_outras_redes]:checked").val(),
                telemoveis_agregado_familiar: $("#telemoveis_agregado_familiar").val()
            },
            net_movel: {
                fidelizado: $("#tem_net_movel_fidelizado").is(":checked"),
                mensalidade: $("#tem_net_movel_mensalidade").val(),
                utiliza_tablet_smartphone: $("[name=utiliza_tablet_smartphone]:checked").val()
            }
        }
    }

    function fnPaginaValidada() {

        var bPerfilEntrada = $("#perfil_entrada").valid();
        var bMensalidadeTotal = $("#mensalidade_total").valid();

        return bPerfilEntrada && bMensalidadeTotal;
    }

    return {
        init: fnInit,
        getValues: fnGetValues,
        valid: fnPaginaValidada,
        setNextPage: fnSetNextPage,
        setPreviousPage: fnSetPreviousPage,
        hide: function () {
            $("#container").find("#pag2").hide();
        }
    }

})();
