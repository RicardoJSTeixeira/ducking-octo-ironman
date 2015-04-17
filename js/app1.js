/**
 * Created by vitor.correia on 10-04-2015.
 */

var app1 = (function () {
    var fnNextPag;

    function fnInit() {
        if ($("#container").find("#pag1").length) {
            $("#container").find("#pag1").show();
            return true
        }

        $.get("pages/pag1.html",
            function (sHtml) {
                var sRendered = Mustache.render(sHtml, oVars);

                $("#container").append(sRendered);

                fnSetEvents();

            },
            "html")

    }

    function fnSetNextPage(fn) {
        fnNextPag = fn;
    }

    function fnSetEvents() {
        $("[name=contacto_cliente]").click(function () {

            var bOk = this.value == 'sim'; // bOk é true quando o this.value for sim
            $("#ir_para_agendamento").toggle(!bOk);
            $("#autoriza_gravacao").toggle(bOk);

        });

        $("[name=autoriza_gravacao]").click(function () {


            $("#pag1_continuar").show();

        });

//next pag
        $("#pag1_continuar").click(function () {
            fnNextPag();
        });

    }

    function fnGetValues() {
        return {
            nome: $("#nome_cliente").val(),
            contacto_cliente: $("[name=contacto_cliente]:checked").val(),
            autoriza_gravacao: $("[name=autoriza_gravacao]:checked").val()
        }
    }

    return {
        init: fnInit,
        getValues: fnGetValues,
        setNextPage: fnSetNextPage,
        hide: function () {
            $("#container").find("#pag1").hide();
        }
    }
})();
