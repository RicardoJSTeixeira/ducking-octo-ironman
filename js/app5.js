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

    function fnInit(oPageData) {
        console.log(oPageData);

        if ($("#container").find("#pag5").length) {
            $("#container").find("#pag5").show();
            return true
        }

        var aDadosTodos= oPageData;


        $.get("pages/pag5.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oPageData);

                $("#container").append(sRendered);

                fnGetDados();

                fnSetEvents();

            },
            "html")

    }

    function fnGetDados() {


    }

    function fnSetEvents() {

        $("#container_portabilidade").hide();

        //previous
        $("#pag5_back").click(function () {

            fnPreviousPag();

        });

        //next page
        $("#pag5_continuar").click(function () {

           /* if (!fnPaginaValidada())
                return false;*/

            fnNextPag();

        });


        //Mostrar container_portabilidade apenas se houver portabilidade
        $("[name='portabilidade']").change(function () {

            //console.log(this.value)

            //caso sim show, caso não hide
            $("#container_portabilidade").toggle(this.value=="Sim");

        });


        $("#portabilidade_validade_doc_identificacao,\
        #portabilidade_alteracao_validade_doc_identificacao,\
        #processamento_informacao_data_transferencia_data")
            .datetimepicker({
                format: "DD-MM-YYYY"
            })

    }

    function fnGetValues() {

        return{
            ha_portabilidade: $("[name=portabilidade]:checked").val(),
            portabilidade_fixo: $("#portabilidade_fixo").is(":checked"),
            portabilidade_movel: $("#portabilidade_movel").is(":checked"),
            quantos_cartoes : $("#portabilidade_quantos_cartoes").val(),
            quantos_cartoes_novos : $("#portabilidade_quantos_cartoes_novos").val(),
            portabilidade_a_operadora_actual : $("#portabilidade_a_operadora_actual").val(),
            portabilidade_nome_cliente : $("#portabilidade_nome_cliente").val(),
            portabilidade_sobrenome_cliente : $("#portabilidade_sobrenome_cliente").val(),
            tipo_doc_identificacao : $("[name=doc_identificacao]:checked").val(),
            numero_doc_identificacao : $("#portabilidade_numero_doc_identificacao").val(),
            validade_doc_identificacao : $("#portabilidade_validade_doc_identificacao").val(),
            portabilidade_numero_contribuinte : $("#portabilidade_numero_contribuinte").val(),
            portabilidade_alteracao_nome_cliente : $("#portabilidade_alteracao_nome_cliente").val(),
            portabilidade_alteracao_sobrenome_cliente : $("#portabilidade_alteracao_sobrenome_cliente").val(),
            tipo_doc_identificacao_alteracao : $("[name=doc_identificacao_alteracao]:checked").val(),
            portabilidade_alteracao_numero_doc_identificacao : $("#portabilidade_alteracao_numero_doc_identificacao").val(),
            portabilidade_alteracao_validade_doc_identificacao : $("#portabilidade_alteracao_validade_doc_identificacao").val(),
            portabilidade_alteracao_numero_contribuinte : $("#portabilidade_alteracao_numero_contribuinte").val(),
            processamento_numero_telefone_fixo : $("#processamento_numero_telefone_fixo").val(),
            processamento_numero_cliente : $("#processamento_numero_cliente").val(),
            processamento_local_servico : $("#processamento_local_servico").val(),
            processamento_telefone_contacto : $("#processamento_telefone_contacto").val(),
            processamento_email : $("#processamento_email").val(),
            processamento_informacao_data_transferencia : $("[name=processamento_informacao_data_transferencia]:checked").val(),
            processamento_informacao_data_transferencia_dias : $("[name=processamento_informacao_data_transferencia_dias]:checked").val(),
            processamento_informacao_data_transferencia_data : $("[name=processamento_informacao_data_transferencia_data]:checked").val(),
            processamento_observacoes : $("#processamento_observacoes_venda").val()
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
            $("#container").find("#pag5").hide();
        }
    }

})();