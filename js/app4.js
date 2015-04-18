/**
 * Created by vitor.correia on 16-04-2015.
 * TODO Arranjar tabelas auxiliares para concelhos e localidades
 *
 */

var app4 = (function () {

    var oDados = [];
    var fnNextPag;
    var fnPreviousPag;
    var jqC;

    function fnInit(oPageData) {

        jqC = $("#container").find("#pag4");
        if (jqC.length) {
            jqC.show();
            return true
        }

        oDados = oPageData;


        $.get("pages/pag4.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oPageData);

                jqC = $("#container").append(sRendered).find("#pag4");

                fnGetDados();

                fnSetEvents();

            },
            "html")

    }

    function fnGetDados() {

        // nada a ir buscar

    }

    function fnSetEvents() {

        jqC.find("#container_agendar_instalacao").hide();
        jqC.find("#container_nib").hide();

        //previous
        jqC.find("#pag4_back").click(function () {

            fnPreviousPag();

        });
        //next page
        jqC.find("#pag4_continuar").click(function () {

            if (!fnPaginaValidada())
                return false;

            fnNextPag();

        });


        jqC.find("#validar_nib").click(function () {

            var bRes, iNib;

            iNib = jqC.find("#dados_modalidade_pagamento_nib").val().replace(/-/g, "");
            bRes = mUtil.checkNIB(iNib);

            if (bRes) {
                bootbox.alert("NIB válido");
            } else {
                bootbox.alert("NIB inválido!");
            }

        });


        //Mostrar recolha de NIB somente se a modalidade for débito directo
        jqC.find("[name='dados_modalidade_pagamento']").change(function () {

            console.log(this.value)

            //caso sim show, caso não hide
            jqC.find("#container_nib").toggle(this.value == "debito_directo");

        });

        function fnPaginaValidada() {
//todo so isto??? é o único required, os restantes dependem de circunstancias que ATM não estão claras
            var bEmailClienteExpedicao = jqC.find("#dados_email_expedicao").valid();
            return bEmailClienteExpedicao;
        }


        jqC.find("#dados_cliente_manter_dados_anteriores").click(function () {

            if ($(this).is(":checked")) {

                jqC.find("#dados_nome_cliente_expedicao").val(jqC.find("#dados_nome_cliente").val());
                jqC.find("#dados_sobrenome_cliente_expedicao").val(jqC.find("#dados_sobrenome_cliente").val());
                jqC.find("#dados_morada_cliente_expedicao").val(jqC.find("#dados_morada_cliente").val());
                jqC.find("#dados_cp_cliente_expedicao").val(jqC.find("#dados_cp_cliente").val());
                jqC.find("#dados_concelho_cliente_expedicao").val(jqC.find("#dados_concelho_cliente").val());
                jqC.find("#dados_localidade_cliente_expedicao").val(jqC.find("#dados_localidade_cliente").val());

            } else {

                jqC.find("#dados_nome_cliente_expedicao").val("");
                jqC.find("#dados_sobrenome_cliente_expedicao").val("");
                jqC.find("#dados_morada_cliente_expedicao").val("");
                jqC.find("#dados_cp_cliente_expedicao").val("");
                jqC.find("#dados_concelho_cliente_expedicao").val("");
                jqC.find("#dados_localidade_cliente_expedicao").val("");

            }

        });

        jqC.find("#dados_agendar_instalacao").click(function () {

            jqC.find("#container_agendar_instalacao").toggle($(this).is(":checked"));
            
        });

        jqC.find("#dados_validade_expedicao,#dados_agendar_instalacao_dia").datetimepicker({
            format: "DD-MM-YYYY"
        })

    }


    function fnGetValues() {
        return {

            nome_cliente: jqC.find("#dados_nome_cliente").val(),
            sobrenome_cliente: jqC.find("#dados_sobrenome_cliente").val(),
            cliente_sexo: jqC.find("[name=dados_cliente_sexo]:checked").val(),
            e_actual: jqC.find("[name=actual_cliente]:checked").val(),
            morada_cliente: jqC.find("#dados_morada_cliente").val(),
            cp_cliente: jqC.find("#dados_cp_cliente").val(),
            concelho_cliente: jqC.find("#dados_concelho_cliente").val(),
            localidade_cliente: jqC.find("#dados_localidade_cliente").val(),
            nome_cliente_expedicao: jqC.find("#dados_nome_cliente_expedicao").val(),
            sobrenome_cliente_expedicao: jqC.find("#dados_sobrenome_cliente_expedicao").val(),
            agregado_familiar_expedicao: jqC.find("#dados_agregado_familiar_expedicao").val(),
            telefone_preferencial_expedicao: jqC.find("#dados_telefone_preferencial_expedicao").val(),
            telefone_alternativo_expedicao: jqC.find("#dados_telefone_alternativo_expedicao").val(),
            cp_cliente_expedicao: jqC.find("#dados_cp_cliente_expedicao").val(),
            concelho_cliente_expedicao: jqC.find("#dados_concelho_cliente_expedicao").val(),
            localidade_cliente_expedicao: jqC.find("#dados_localidade_cliente_expedicao").val(),
            nif_expedicao: jqC.find("#dados_nif_expedicao").val(),
            bicc_expedicao: jqC.find("#dados_bicc_expedicao").val(),
            validade_expedicao: jqC.find("#dados_validade_expedicao").val(),
            email_expedicao: jqC.find("#dados_email_expedicao").val(),
            agendar_instalacao: jqC.find("#dados_agendar_instalacao").is(":checked"),
            agendar_instalacao_dia: jqC.find("#dados_agendar_instalacao_dia").val(),
            agendar_instalacao_periodo: jqC.find("[name=dados_agendar_instalacao_periodo]:checked").val(),
            modalidade_pagamento_factura_electronica: jqC.find("#dados_modalidade_pagamento_factura_electronica").is(":checked"),
            modalidade_pagamento_referencia_mb: jqC.find("#dados_modalidade_pagamento_referencia_mb").is(":checked"),
            modalidade_pagamento_nib: jqC.find("#dados_modalidade_pagamento_nib").val(),
            observacoes_venda: jqC.find("#dados_observacoes_venda").val()
        }
    }


    function fnSetNextPage(fn) {
        fnNextPag = fn;
    }

    function fnSetPreviousPage(fn) {
        fnPreviousPag = fn;
    }

    return {
        init: fnInit,
        getValues: fnGetValues,
        setNextPage: fnSetNextPage,
        setPreviousPage: fnSetPreviousPage,
        hide: function () {
            jqC.hide();
        }
    }

})();