/**
 * Created by vitor.correia on 10-04-2015.
 */

var app1 = (function () {
    var fnNextPag;
    var jsC;

    function fnInit() {

        jsC = $("#container").find("#pag1");

        if (jsC.length) {
            jsC.show();
            return true
        }

        $.get("pages/pag1.html",
            function (sHtml) {
                var sRendered = Mustache.render(sHtml, oVars);

                jsC = $("#container").append(sRendered).find("#pag1");

                fnSetEvents();

            },
            "html")

    }

    function fnSetNextPage(fn) {
        fnNextPag = fn;
    }

    function fnSetEvents() {
        jsC.find("[name=contacto_cliente]").click(function () {

            var bOk = this.value == 'Sim'; // bOk é true quando o this.value for sim
            jsC.find("#ir_para_agendamento").toggle(!bOk);
            jsC.find("#autoriza_gravacao").toggle(bOk);

        });

        jsC.find("[name=autoriza_gravacao]").click(function () {

            jsC.find("#pag1_continuar").show();

        });

//next pag
        jsC.find("#pag1_continuar").click(function () {
            fnNextPag();
        });

    }

    function fnGetValues() {
        return {
            nome: jsC.find("#nome_cliente").val(),
            contacto_cliente: jsC.find("[name=contacto_cliente]:checked").val(),
            autoriza_gravacao: jsC.find("[name=autoriza_gravacao]:checked").val()
        }
    }

    return {
        init: fnInit,
        getValues: fnGetValues,
        setNextPage: fnSetNextPage,
        hide: function () {
            jsC.hide();
        }
    }
})();
