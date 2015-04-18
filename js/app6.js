/**
 * Created by vitor.correia on 16-04-2016.
 */

var app6 = (function () {

    var oDados = [];
    var fnAnotherOne;
    var fnPreviousPag;
    var jqC;

    function fnInit(oPageData) {

        jqC = $("#container").find("#pag6");

        if (jqC.length) {
            jqC.show();
            return true
        }

        oDados = oPageData;


        $.get("pages/pag6.html",
            function (sHTML) {

                var sRendered = Mustache.render(sHTML, oPageData);

                jqC = $("#container").append(sRendered).find("#pag6");


                fnSetEvents();

            },
            "html")

    }

    function fnSubmit() {
        $.post("ajax/request.php",
            {
                action: "Save",
                dados_chamada: oDados
            },
            function (bOk) { // recebendo ok / true do request::fnSave, fechar interaccao
                console.log(bOk);
                //global
                banana2000xpto = bOk;
                //todo append em qualquer lado que fez um submit (por pelo menos o nome do pacote) para ir mostrando que pacotes já foram vendidos

            }, "json")
    }

    function fnSetEvents() {

        //previous
        jqC.find("#pag6_back").click(function () {

            fnPreviousPag();

        });

        jqC.find("#pag6_continuar").click(function () {
            fnSubmit();
            bootbox.confirm("Quer vender outro serviço?", function (bYes) {

                fnMakeBanner();

                if (bYes) {
                    fnAnotherOne();
                }else{
                    //bloquea-mos o script
                    $.msg({
                        bgPath : '/img/',
                        autoUnblock : false,
                        clickUnblock : false,
                        content: "Script Fechado!!!"
                    });
                }
            })

        });
    }

    function fnMakeBanner() {

        var sTemplate = "<h5 style='display: inline;margin-left: 25px;'>\
                            <span class='label label-success'>Fechado: {{pacote}}</span>\
                         </h5>";

        var sRendered = Mustache.render(sTemplate, oDados.pag3.proposta);

        $("#header").append(sRendered);

    }

    function fnGetValues() {
        return {}
    }


    function fnSetAnotherOne(fn) {
        fnAnotherOne = fn;
    }

    function fnSetPreviousPage(fn) {
        fnPreviousPag = fn;
    }

    return {
        init: fnInit,
        getValues: fnGetValues,
        anotherOne: fnSetAnotherOne,
        setPreviousPage: fnSetPreviousPage,
        hide: function () {
            jqC.hide();
        }
    }

})();