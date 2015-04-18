/**
 * Created by vitor.correia on 16-04-2015.
 * TODO Arranjar tabelas auxiliares para concelhos e localidades
 *
 */

var app4 = (function () {

    var oDados = [];
    var fnNextPag;
    var fnPreviousPag;
    var jsC;

    function fnInit(oPageData) {

        jsC = $("#container").find("#pag4");
        if (jsC.length) {
            jsC.show();
            return true
        }

        oDados = oPageData;


        $.get("pages/pag4.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oPageData);

                jsC = $("#container").append(sRendered).find("#pag4");

                fnGetDados();

                fnSetEvents();

            },
            "html")

    }

    function fnGetDados() {

        // nada a ir buscar

    }

    function fnSetEvents() {

        jsC.find("#container_agendar_instalacao").hide();
        jsC.find("#container_nib").hide();

        //previous
        jsC.find("#pag4_back").click(function () {

            fnPreviousPag();

        });
        //next page
        jsC.find("#pag4_continuar").click(function () {

            if (!fnPaginaValidada())
                return false;

            fnNextPag();

        });


        jsC.find("#validar_nib").click(function () {

            var bRes, iNib;

            iNib = jsC.find("#dados_modalidade_pagamento_nib").val().replace(/-/g, "");
            bRes = mUtil.checkNIB(iNib);

            if (bRes) {
                bootbox.alert("NIB válido");
            } else {
                bootbox.alert("NIB inválido!");
            }

        });


        //Mostrar recolha de NIB somente se a modalidade for débito directo
        jsC.find("[name='dados_modalidade_pagamento']").change(function () {

            console.log(this.value)

            //caso sim show, caso não hide
            jsC.find("#container_nib").toggle(this.value == "debito_directo");

        });

        function fnPaginaValidada() {
//todo so isto???
            var bEmailClienteExpedicao = jsC.find("#dados_email_expedicao").valid();
            return bEmailClienteExpedicao;
        }


        jsC.find("#dados_cliente_manter_dados_anteriores").click(function () {

            if ($(this).is(":checked")) {

                jsC.find("#dados_nome_cliente_expedicao").val(jsC.find("#dados_nome_cliente").val());
                jsC.find("#dados_sobrenome_cliente_expedicao").val(jsC.find("#dados_sobrenome_cliente").val());
                jsC.find("#dados_morada_cliente_expedicao").val(jsC.find("#dados_morada_cliente").val());
                jsC.find("#dados_cp_cliente_expedicao").val(jsC.find("#dados_cp_cliente").val());
                jsC.find("#dados_concelho_cliente_expedicao").val(jsC.find("#dados_concelho_cliente").val());
                jsC.find("#dados_localidade_cliente_expedicao").val(jsC.find("#dados_localidade_cliente").val());

            } else {

                jsC.find("#dados_nome_cliente_expedicao").val("");
                jsC.find("#dados_sobrenome_cliente_expedicao").val("");
                jsC.find("#dados_morada_cliente_expedicao").val("");
                jsC.find("#dados_cp_cliente_expedicao").val("");
                jsC.find("#dados_concelho_cliente_expedicao").val("");
                jsC.find("#dados_localidade_cliente_expedicao").val("");

            }

        });

        jsC.find("#dados_agendar_instalacao").click(function () {

            jsC.find("#container_agendar_instalacao").toggle($(this).is(":checked"));
            
        });

        jsC.find("#dados_validade_expedicao,#dados_agendar_instalacao_dia").datetimepicker({
            format: "DD-MM-YYYY"
        })

    }


    function fnGetValues() {
        return {

            nome_cliente: jsC.find("#dados_nome_cliente").val(),
            sobrenome_cliente: jsC.find("#dados_sobrenome_cliente").val(),
            cliente_sexo: jsC.find("[name=dados_cliente_sexo]:checked").val(),
            e_actual: jsC.find("[name=actual_cliente]:checked").val(),
            morada_cliente: jsC.find("#dados_morada_cliente").val(),
            cp_cliente: jsC.find("#dados_cp_cliente").val(),
            concelho_cliente: jsC.find("#dados_concelho_cliente").val(),
            localidade_cliente: jsC.find("#dados_localidade_cliente").val(),
            nome_cliente_expedicao: jsC.find("#dados_nome_cliente_expedicao").val(),
            sobrenome_cliente_expedicao: jsC.find("#dados_sobrenome_cliente_expedicao").val(),
            agregado_familiar_expedicao: jsC.find("#dados_agregado_familiar_expedicao").val(),
            telefone_preferencial_expedicao: jsC.find("#dados_telefone_preferencial_expedicao").val(),
            telefone_alternativo_expedicao: jsC.find("#dados_telefone_alternativo_expedicao").val(),
            cp_cliente_expedicao: jsC.find("#dados_cp_cliente_expedicao").val(),
            concelho_cliente_expedicao: jsC.find("#dados_concelho_cliente_expedicao").val(),
            localidade_cliente_expedicao: jsC.find("#dados_localidade_cliente_expedicao").val(),
            nif_expedicao: jsC.find("#dados_nif_expedicao").val(),
            bicc_expedicao: jsC.find("#dados_bicc_expedicao").val(),
            validade_expedicao: jsC.find("#dados_validade_expedicao").val(),
            email_expedicao: jsC.find("#dados_email_expedicao").val(),
            agendar_instalacao: jsC.find("#dados_agendar_instalacao").is(":checked"),
            agendar_instalacao_dia: jsC.find("#dados_agendar_instalacao_dia").val(),
            agendar_instalacao_periodo: jsC.find("#dados_agendar_instalacao_periodo").is(":checked"),
            modalidade_pagamento_factura_electronica: jsC.find("#dados_modalidade_pagamento_factura_electronica").is(":checked"),
            modalidade_pagamento_referencia_mb: jsC.find("#dados_modalidade_pagamento_referencia_mb").is(":checked"),
            modalidade_pagamento_nib: jsC.find("#dados_modalidade_pagamento_nib").val(),
            observacoes_venda: jsC.find("#dados_observacoes_venda").val()
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
            jsC.hide();
        }
    }

})();