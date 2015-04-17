/**
 * Created by vitor.correia on 16-04-2015.
 * TODO Arranjar tabelas auxiliares para concelhos e localidades
 *
 */

var app4 = (function () {

    var oDados = [];
    var fnNextPag;
    var fnPreviousPag;

    function fnInit(oPageData) {
        console.log(oPageData);

        if ($("#container").find("#pag4").length) {
            $("#container").find("#pag4").show();
            return true
        }

        var aDadosTodos = oPageData;


        $.get("pages/pag4.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oPageData);

                $("#container").append(sRendered);

                fnGetDados();

                fnSetEvents();

            },
            "html")

    }

    function fnGetDados() {

        // nada a ir buscar

    }

    function fnSetEvents() {

        $("#container_agendar_instalacao").hide();
        $("#container_nib").hide();

        //previous
        $("#pag4_back").click(function () {

            fnPreviousPag();

        });
        //next page
        $("#pag4_continuar").click(function () {

            if (!fnPaginaValidada())
                return false;

            fnNextPag();

        });


        $("#validar_nib").click(function () {

            var bRes, iNib;

            iNib = $("#dados_modalidade_pagamento_nib").val().replace(/-/g, "");
            bRes = mUtil.checkNIB(iNib);

            if (bRes) {
                bootbox.alert("NIB válido");
            } else {
                bootbox.alert("NIB inválido!");
            }

        });


        //Mostrar recolha de NIB somente se a modalidade for débito directo
        $("[name='dados_modalidade_pagamento']").change(function () {

            console.log(this.value)

            //caso sim show, caso não hide
            $("#container_nib").toggle(this.value=="debito_directo");

        });

        function fnPaginaValidada() {

            var bEmailClienteExpedicao = $("#dados_email_expedicao").valid();
            return bEmailClienteExpedicao;
        }


        $("#dados_cliente_manter_dados_anteriores").click(function () {

            if ($("#dados_cliente_manter_dados_anteriores").is(":checked")) {
                $("#dados_nome_cliente_expedicao").val($("#dados_nome_cliente").val());
                $("#dados_sobrenome_cliente_expedicao").val($("#dados_sobrenome_cliente").val());
                $("#dados_morada_cliente_expedicao").val($("#dados_morada_cliente").val());
                $("#dados_cp_cliente_expedicao").val($("#dados_cp_cliente").val());
                $("#dados_concelho_cliente_expedicao").val($("#dados_concelho_cliente").val());
                $("#dados_localidade_cliente_expedicao").val($("#dados_localidade_cliente").val());
            } else {
                $("#dados_nome_cliente_expedicao").val("");
                $("#dados_sobrenome_cliente_expedicao").val("");
                $("#dados_morada_cliente_expedicao").val("");
                $("#dados_cp_cliente_expedicao").val("");
                $("#dados_concelho_cliente_expedicao").val("");
                $("#dados_localidade_cliente_expedicao").val("");
            }

        });

        $("#dados_agendar_instalacao").click(function () {

            if ($("#dados_agendar_instalacao").is(":checked")) {
                $("#container_agendar_instalacao").show();
            } else {
                $("#container_agendar_instalacao").hide();
            }

        });

        $("#dados_validade_expedicao,#dados_agendar_instalacao_dia").datetimepicker({
            format: "DD-MM-YYYY"
        })

    }


    function fnGetValues() {
        return {

            nome_cliente: $("#dados_nome_cliente").val(),
            sobrenome_cliente: $("#dados_sobrenome_cliente").val(),
            cliente_sexo: $("[name=dados_cliente_sexo]:checked").val(),
            e_actual: $("[name=actual_cliente]:checked").val(),
            morada_cliente: $("#dados_morada_cliente").val(),
            cp_cliente: $("#dados_cp_cliente").val(),
            concelho_cliente: $("#dados_concelho_cliente").val(),
            localidade_cliente: $("#dados_localidade_cliente").val(),
            nome_cliente_expedicao: $("#dados_nome_cliente_expedicao").val(),
            sobrenome_cliente_expedicao: $("#dados_sobrenome_cliente_expedicao").val(),
            agregado_familiar_expedicao: $("#dados_agregado_familiar_expedicao").val(),
            telefone_preferencial_expedicao: $("#dados_telefone_preferencial_expedicao").val(),
            telefone_alternativo_expedicao: $("#dados_telefone_alternativo_expedicao").val(),
            cp_cliente_expedicao: $("#dados_cp_cliente_expedicao").val(),
            concelho_cliente_expedicao: $("#dados_concelho_cliente_expedicao").val(),
            localidade_cliente_expedicao: $("#dados_localidade_cliente_expedicao").val(),
            nif_expedicao: $("#dados_nif_expedicao").val(),
            bicc_expedicao: $("#dados_bicc_expedicao").val(),
            validade_expedicao: $("#dados_validade_expedicao").val(),
            email_expedicao: $("#dados_email_expedicao").val(),
            agendar_instalacao: $("#dados_agendar_instalacao").is(":checked"),
            agendar_instalacao_dia: $("#dados_agendar_instalacao_dia").val(),
            agendar_instalacao_periodo: $("#dados_agendar_instalacao_periodo").is(":checked"),
            modalidade_pagamento_factura_electronica: $("#dados_modalidade_pagamento_factura_electronica").is(":checked"),
            modalidade_pagamento_referencia_mb: $("#dados_modalidade_pagamento_referencia_mb").is(":checked"),
            modalidade_pagamento_nib: $("#dados_modalidade_pagamento_nib").val(),
            observacoes_venda: $("#dados_observacoes_venda").val()
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
            $("#container").find("#pag4").hide();
        }
    }

})();