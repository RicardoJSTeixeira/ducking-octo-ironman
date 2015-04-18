/**
 * Created by vitor.correia on 10-04-2015.
 */

var app2 = (function () {

    var oDados = [];
    var fnNextPag;
    var fnPreviousPag;
    var jsC;


    function fnInit() {

        jsC = $("#container").find("#pag2");

        if (jsC.length) {
            jsC.show();
            return true
        }

        $.get("pages/pag2.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oVars);

                jsC = $("#container").append(sRendered).find("#pag2");

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
        
        jsC.find("#perfil_entrada").append(sOptions);

    }

    function fnSetEvents() {
        jsC.find("#perfil_entrada").change(function () {

            // limpar formatações derivadas de filtros
            jsC.find(".tag_servicos")
                .removeClass("label label-primary")
                .removeClass("label label-info")
                .removeClass("label label-success")
                .removeClass("label label-warning")
                .removeClass("label label-danger");


            var oPacote = $(":selected", this).data("pacote"); // recolhe o index do SELECT do Perfil de Entrada

            var bOk = !_.isEmpty(oPacote); // se não estiver vazio, é porque pode continuar
            jsC.find("#pag2_continuar").toggle(bOk);

            if (!bOk)//Se not ok salta fora
                return false;


            // vai buscar os dados ao array local, filtrando pelo index recolhido
            var oDados = jsC.find(":selected", this).data("pacote");

            var sOperadora = oDados.operadora.toLowerCase();

            if (oDados.tem_tv) {
                jsC.find("#tem_tv").addClass("label label-primary");
                jsC.find("#tem_tv_" + sOperadora).addClass("label label-primary")
            }
            if (oDados.tem_net_fixa) {
                jsC.find("#tem_net_fixa").addClass("label label-info");
                jsC.find("#tem_net_fixa_" + sOperadora).addClass("label label-info")
            }
            if (oDados.tem_telefone) {
                jsC.find("#tem_telefone").addClass("label label-success");
                jsC.find("#tem_telefone_" + sOperadora).addClass("label label-success")
            }
            if (oDados.tem_telemovel) {
                jsC.find("#tem_telemovel").addClass("label label-warning");
                jsC.find("#tem_telemovel_" + sOperadora).addClass("label label-warning")
            }
            if (oDados.tem_net_movel) {
                jsC.find("#tem_net_movel").addClass("label label-danger");
                jsC.find("#tem_net_movel_" + sOperadora).addClass("label label-danger")
            }
        });

        // permitir apenas floats nas mensalidades
        jsC.find('#mensalidade_total,#tem_tv_mensalidade,#tem_net_fixa_mensalidade,#tem_telefone_mensalidade,#tem_net_movel_mensalidade')
            .keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

        //next page
        jsC.find("#pag2_continuar").click(function () {

            if (!fnPaginaValidada())
                return false;

            fnNextPag();

        });

        //previous
        jsC.find("#pag2_back").click(function () {

            fnPreviousPag();

        });
    }

    function fnGetValues() {
        return {

            pacote: jsC.find("#perfil_entrada :selected").data("pacote"),
            tecnologia: jsC.find("[name=tecnologia]:checked").val(),
            zona_concorrencia: jsC.find("[name=zona_concorrencia]:checked").val(),
            cliente_actual: jsC.find("[name=actual_cliente]:checked").val(),
            mensalidade_total: jsC.find("#mensalidade_total").val(),
            televisao: {
                fidelizado: jsC.find("#tem_tv_fidelizado").is(":checked"),
                mensalidade: jsC.find("#tem_tv_mensalidade").val(),
                tipo_canais_tem: jsC.find("[name=tipo_canais_tem]:checked").val(),
                tipo_canais_gostava_ver: jsC.find("#tipo_canais_gostava_ver").val()
            },
            net_fixa: {
                fidelizado: jsC.find("#tem_net_fixa_fidelizado").is(":checked"),
                mensalidade: jsC.find("#tem_net_fixa_mensalidade").val(),
                tem_computador_portatil: jsC.find("[name=tem_computador_portatil]:checked").val(),
                velocidade_em_casa: jsC.find("[name=velocidade_em_casa]:checked").val()
            },
            telefone: {
                fidelizado: jsC.find("#tem_telefone_fidelizado").is(":checked"),
                mensalidade: jsC.find("#tem_telefone_mensalidade").val(),
                tipo_chamadas_inclui: jsC.find("#tipo_chamadas_inclui").val(),
                familiares_no_estrangeiro: jsC.find("[name=tem_familiares_estrangeiro]:checked").val()
            },
            telemovel: {
                fidelizado: jsC.find("#tem_telemovel_fidelizado").is(":checked"),
                mensalidade: jsC.find("#tem_telemovel_mensalidade").val(),
                costuma_ligar_sms_outras_redes: jsC.find("[name=ligar_enviar_sms_outras_redes]:checked").val(),
                telemoveis_agregado_familiar: jsC.find("#telemoveis_agregado_familiar").val()
            },
            net_movel: {
                fidelizado: jsC.find("#tem_net_movel_fidelizado").is(":checked"),
                mensalidade: jsC.find("#tem_net_movel_mensalidade").val(),
                utiliza_tablet_smartphone: jsC.find("[name=utiliza_tablet_smartphone]:checked").val()
            }
        }
    }

    function fnPaginaValidada() {

        var bPerfilEntrada = jsC.find("#perfil_entrada").valid();
        var bMensalidadeTotal = jsC.find("#mensalidade_total").valid();

        return bPerfilEntrada && bMensalidadeTotal;
    }

    return {
        init: fnInit,
        getValues: fnGetValues,
        valid: fnPaginaValidada,
        setNextPage: fnSetNextPage,
        setPreviousPage: fnSetPreviousPage,
        hide: function () {
            jsC.hide();
        }
    }

})();
