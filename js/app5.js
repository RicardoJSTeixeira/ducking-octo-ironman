/**
 * Created by rteixeira on 16-04-2015.
 */
/**
 * Created by vitor.correia on 16-04-2015.
 */

var app5 = (function () {

    var oDados = [];
    var fnNextPag;
    var fnPreviousPag;
    var jqC;

    function fnInit(oPageData) {

        jqC = $("#container").find("#pag5");
        if (jqC.length) {
            jqC.show();
            return true
        }

        oDados = oPageData;


        $.get("pages/pag5.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oPageData);

                //faz append do html e devolve o container, depois fazemos find no container e devolve a pag5
                jqC = $("#container").append(sRendered).find("#pag5");

                fnGetDados();

                fnSetEvents();

            },
            "html")

    }

    function fnGetDados() {


    }

    function fnSetEvents() {
        //agora so pesquisamos dentro da pagina evitando conflitos
        jqC.find("#container_portabilidade").hide();

        //previous
        jqC.find("#pag5_back").click(function () {

            fnPreviousPag();

        });

        //next page
        jqC.find("#pag5_continuar").click(function () {

            /* if (!fnPaginaValidada())
             return false;*/

            fnNextPag();

        });


        //Mostrar container_portabilidade apenas se houver portabilidade
        jqC.find("[name='portabilidade']").change(function () {

            //caso sim show, caso não hide
            jqC.find("#container_portabilidade").toggle(this.value == "Sim");

        });


        jqC.find("#portabilidade_validade_doc_identificacao,\
        #portabilidade_alteracao_validade_doc_identificacao,\
        #processamento_informacao_data_transferencia_data")
            .datetimepicker({
                format: "DD-MM-YYYY"
            })

    }

    function fnGetValues() {

        return {
            ha_portabilidade: jqC.find("[name=portabilidade]:checked").val(),
            portabilidade_fixo: jqC.find("#portabilidade_fixo").is(":checked"),
            portabilidade_movel: jqC.find("#portabilidade_movel").is(":checked"),
            quantos_cartoes: jqC.find("#portabilidade_quantos_cartoes").val(),
            quantos_cartoes_novos: jqC.find("#portabilidade_quantos_cartoes_novos").val(),
            portabilidade_a_operadora_actual: jqC.find("#portabilidade_a_operadora_actual").val(),
            portabilidade_nome_cliente: jqC.find("#portabilidade_nome_cliente").val(),
            portabilidade_sobrenome_cliente: jqC.find("#portabilidade_sobrenome_cliente").val(),
            tipo_doc_identificacao: jqC.find("[name=doc_identificacao]:checked").val(),
            numero_doc_identificacao: jqC.find("#portabilidade_numero_doc_identificacao").val(),
            validade_doc_identificacao: jqC.find("#portabilidade_validade_doc_identificacao").val(),
            portabilidade_numero_contribuinte: jqC.find("#portabilidade_numero_contribuinte").val(),
            portabilidade_alteracao_nome_cliente: jqC.find("#portabilidade_alteracao_nome_cliente").val(),
            portabilidade_alteracao_sobrenome_cliente: jqC.find("#portabilidade_alteracao_sobrenome_cliente").val(),
            tipo_doc_identificacao_alteracao: jqC.find("[name=doc_identificacao_alteracao]:checked").val(),
            portabilidade_alteracao_numero_doc_identificacao: jqC.find("#portabilidade_alteracao_numero_doc_identificacao").val(),
            portabilidade_alteracao_validade_doc_identificacao: jqC.find("#portabilidade_alteracao_validade_doc_identificacao").val(),
            portabilidade_alteracao_numero_contribuinte: jqC.find("#portabilidade_alteracao_numero_contribuinte").val(),
            processamento_numero_telefone_fixo: jqC.find("#processamento_numero_telefone_fixo").val(),
            processamento_numero_cliente: jqC.find("#processamento_numero_cliente").val(),
            processamento_local_servico: jqC.find("#processamento_local_servico").val(),
            processamento_telefone_contacto: jqC.find("#processamento_telefone_contacto").val(),
            processamento_email: jqC.find("#processamento_email").val(),
            processamento_informacao_data_transferencia: jqC.find("[name=processamento_informacao_data_transferencia]:checked").val(),
            processamento_informacao_data_transferencia_dias: jqC.find("[name=processamento_informacao_data_transferencia_dias]:checked").val(),
            processamento_informacao_data_transferencia_data: jqC.find("[name=processamento_informacao_data_transferencia_data]:checked").val(),
            processamento_observacoes: jqC.find("#processamento_observacoes_venda").val()
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