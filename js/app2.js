/**
 * Created by vitor.correia on 10-04-2015.
 */

var app2 = (function () {

    var oDados = [];
    var fnNextPag;
    var fnPreviousPag;
    var jqC;


    function fnInit() {

        jqC = $("#container").find("#pag2");

        if (jqC.length) {
            jqC.show();
            return true
        }

        $.get("pages/pag2.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oVars);

                jqC = $("#container").append(sRendered).find("#pag2");

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
                        <option data-pacote='" + JSON.stringify({
                tipo_pacote: "-",
                operadora: ""
            }) + "' >SEM PERFIL</option>";


        oDados.aOperadoras.forEach(function (sOperadora) {

            oDados.aoPacotes.forEach(function (oPacote) {

                oPacote.operadora = sOperadora;
                sOptions += "<option data-pacote='" + JSON.stringify(oPacote) + "' >" + sOperadora + '_' + oPacote.tipo_pacote + "</option>"

            })
        });

        jqC.find("#perfil_entrada").append(sOptions);

    }

    function fnSetEvents() {
        jqC.find("#perfil_entrada").change(function () {

            app3.restartPropostas();

            // limpar formatações derivadas de filtros
            jqC.find(".tag_servicos")
                .removeClass("label label-primary")
                .removeClass("label label-info")
                .removeClass("label label-success")
                .removeClass("label label-warning")
                .removeClass("label label-danger");


            var oPacote = $(":selected", this).data("pacote"); // recolhe o index do SELECT do Perfil de Entrada

            var bOk = !_.isEmpty(oPacote); // se não estiver vazio, é porque pode continuar
            jqC.find("#pag2_continuar").toggle(bOk);

            if (!bOk)//Se not ok salta fora
                return false;


            // vai buscar os dados ao array local, filtrando pelo index recolhido
            var oDados = jqC.find(":selected", this).data("pacote");

            var sOperadora = oDados.operadora.toLowerCase();

            if (oDados.tem_tv) {
                jqC.find("#tem_tv").addClass("label label-primary");
                jqC.find("#tem_tv_" + sOperadora).addClass("label label-primary")
            }
            if (oDados.tem_net_fixa) {
                jqC.find("#tem_net_fixa").addClass("label label-info");
                jqC.find("#tem_net_fixa_" + sOperadora).addClass("label label-info")
            }
            if (oDados.tem_telefone) {
                jqC.find("#tem_telefone").addClass("label label-success");
                jqC.find("#tem_telefone_" + sOperadora).addClass("label label-success")
            }
            if (oDados.tem_telemovel) {
                jqC.find("#tem_telemovel").addClass("label label-warning");
                jqC.find("#tem_telemovel_" + sOperadora).addClass("label label-warning")
            }
            if (oDados.tem_net_movel) {
                jqC.find("#tem_net_movel").addClass("label label-danger");
                jqC.find("#tem_net_movel_" + sOperadora).addClass("label label-danger")
            }
        });

        // permitir apenas floats nas mensalidades
        jqC.find('#mensalidade_total,#tem_tv_mensalidade,#tem_net_fixa_mensalidade,#tem_telefone_mensalidade,#tem_net_movel_mensalidade')
            .keypress(function (event) {
                if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });

        //next page
        jqC.find("#pag2_continuar").click(function () {

            if (!fnPaginaValidada())
                return false;

            fnNextPag();

        });

        //previous
        jqC.find("#pag2_back").click(function () {

            fnPreviousPag();

        });
    }

    function fnGetValues() {
        return {

            pacote: jqC.find("#perfil_entrada :selected").data("pacote"),
            tecnologia: jqC.find("[name=tecnologia]:checked").val(),
            zona_concorrencia: jqC.find("[name=zona_concorrencia]:checked").val(),
            cliente_actual: jqC.find("[name=actual_cliente]:checked").val(),
            mensalidade_total: jqC.find("#mensalidade_total").val(),
            televisao: {
                fidelizado: jqC.find("#tem_tv_fidelizado").is(":checked"),
                mensalidade: jqC.find("#tem_tv_mensalidade").val(),
                tipo_canais_tem: jqC.find("[name=tipo_canais_tem]:checked").val(),
                tipo_canais_gostava_ver: jqC.find("#tipo_canais_gostava_ver").val()
            },
            net_fixa: {
                fidelizado: jqC.find("#tem_net_fixa_fidelizado").is(":checked"),
                mensalidade: jqC.find("#tem_net_fixa_mensalidade").val(),
                tem_computador_portatil: jqC.find("[name=tem_computador_portatil]:checked").val(),
                velocidade_em_casa: jqC.find("[name=velocidade_em_casa]:checked").val()
            },
            telefone: {
                fidelizado: jqC.find("#tem_telefone_fidelizado").is(":checked"),
                mensalidade: jqC.find("#tem_telefone_mensalidade").val(),
                tipo_chamadas_inclui: jqC.find("#tipo_chamadas_inclui").val(),
                familiares_no_estrangeiro: jqC.find("[name=tem_familiares_estrangeiro]:checked").val()
            },
            telemovel: {
                fidelizado: jqC.find("#tem_telemovel_fidelizado").is(":checked"),
                mensalidade: jqC.find("#tem_telemovel_mensalidade").val(),
                costuma_ligar_sms_outras_redes: jqC.find("[name=ligar_enviar_sms_outras_redes]:checked").val(),
                telemoveis_agregado_familiar: jqC.find("#telemoveis_agregado_familiar").val()
            },
            net_movel: {
                fidelizado: jqC.find("#tem_net_movel_fidelizado").is(":checked"),
                mensalidade: jqC.find("#tem_net_movel_mensalidade").val(),
                utiliza_tablet_smartphone: jqC.find("[name=utiliza_tablet_smartphone]:checked").val()
            }
        }
    }

    function fnPaginaValidada() {

        var bPerfilEntrada = jqC.find("#perfil_entrada").valid();
        var bMensalidadeTotal = jqC.find("#mensalidade_total").valid();

        return bPerfilEntrada && bMensalidadeTotal;
    }

    return {
        init: fnInit,
        getValues: fnGetValues,
        valid: fnPaginaValidada,
        setNextPage: fnSetNextPage,
        setPreviousPage: fnSetPreviousPage,
        hide: function () {
            jqC.hide();
        }
    }

})();
