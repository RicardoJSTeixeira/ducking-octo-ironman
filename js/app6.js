/**
 * Created by vitor.correia on 16-04-2016.
 */

var app6 = (function () {

    var oDados = [];
    var fnAnotherOne;
    var fnPreviousPag;

    function fnInit(oPageData) {
        console.log(oPageData);

        if ($("#container").find("#pag6").length) {
            $("#container").find("#pag6").show();
            return true
        }

        oDados = oPageData;


        $.get("pages/pag6.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oPageData);

                $("#container").append(sRendered);


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
        $("#pag6_back").click(function () {

            fnPreviousPag();

        });

        $("#pag6_continuar").click(function () {
            fnSubmit();
            bootbox.confirm("Quer vender outro serviço?", function (bYes) {
                if (bYes)
                    fnAnotherOne();
            })


        });
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
            $("#container").find("#pag6").hide();
        }
    }

})();