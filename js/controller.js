/**
 * Created by vitor.correia on 10-04-2015.
 */


var controller = (function () {
    var bOkForFscontact = false;

    var oPageData = {
        pag1: {},
        pag2: {},
        pag3: {},
        pag4: {},
        pag5: {}
    };

    oPageData = $.extend(
        oPageData,
        {
            uuid: oVars.uuid,
            contact_id: oVars.contact_id,
            agent_id: oVars.agent_id,
            lista: oVars.databasename,
            ip: oVars.ip,
            localidade: oVars.localidade,
            districto: oVars.districto,
            morada: oVars.morada,
            cp: oVars.cp
        });

    function fnInit() {
//configuraçao de paginas
//app1 inicial
        app1.init();
        app1.setNextPage(function () {
            app1.hide();
            oPageData.pag1 = app1.getValues();
            app2.init();
            //app3 inicializada para se poder verificar se existe propostas para o seleccionado
            app3.init()
        });

//app2
        app2.setPreviousPage(function () {
            app2.hide();
            app1.init();
        });

        app2.setNextPage(function () {
            app2.hide();

            oPageData.pag2 = app2.getValues();

            app3.init(oPageData.pag2)
        });

//app3
        app3.setPreviousPage(function () {
            app3.hide();
            app2.init()
        });

        app3.setNextPage(function () {
            app3.hide();
            oPageData.pag3 = app3.getValues();
            app4.init(oPageData)
        });

//app4
        app4.setPreviousPage(function () {
            app4.hide();
            app3.init()
        });

        app4.setNextPage(function () {
            app4.hide();
            oPageData.pag4 = app4.getValues();
            app5.init(oPageData)
        });
//app5
        app5.setPreviousPage(function () {
            app5.hide();
            app4.init()
        });

        app5.setNextPage(function () {
            app5.hide();
            oPageData.pag5 = app5.getValues();
            app6.init(oPageData)
        });

//app6 final

        app6.setPreviousPage(function () {
            app6.hide();
            app5.init()
        });

        app6.anotherOne(function () {
            app6.hide();
            app2.init()
        })
    }

    function fnSetOk() {
        bOkForFscontact = true;
    }


    function fnSubmeterNegativo() {
        return new Promise(function (resolve, reject) {


            /*

             Testar em que página estou; se já passei da primeira não adicionar os campos da _novarecolha.

             Se o top passar da primeira página, o oPageData já vai conter
             estas variaveis. Ao clicar em gravar vai dar erro, por haver
             colunas duplicadas.

             */


            if ($('#perfil_entrada').length > 0) {

                datafidelizacao_negativo = $("#negativo_datafidelizacao").val(); // atribuição directa no $.extend não está a funcionar!!

                oPageData = $.extend(
                    oPageData,
                    {
                        negativo_datafidelizacao: datafidelizacao_negativo

                    });

            } else {

                datafidelizacao_negativo = $("#negativo_datafidelizacao").val(); // atribuição directa no $.extend não está a funcionar!!

                nome_novarecolha = $("#nome_cliente").val();
                contacto_cliente_novarecolha = $("[name=contacto_cliente]:checked").val();
                autoriza_gravacao_novarecolha = $("[name=autoriza_gravacao]:checked").val();

                oPageData = $.extend(
                    oPageData,
                    {
                        negativo_datafidelizacao: datafidelizacao_negativo,
                        pag1_nome: nome_novarecolha,
                        pag1_contacto_cliente : contacto_cliente_novarecolha,
                        pag1_autoriza_gravacao: autoriza_gravacao_novarecolha
                    });

            }


            $.post("ajax/request.php",
                {
                    action: "SaveNegativo",
                    dados_chamada_negativos: oPageData
                },
                function (bOk) { // recebendo ok / true do request::fnSave, fechar interaccao
                    console.log(bOk);
                    //global
                    if (bOk)
                    //controller.setOk(); // dá indicação à FSCONTACT que a venda terminou
                        bootbox.alert("Gravado como negativo");
                    //bloqueamos o script
                    $.msg({
                        bgPath: '/img/',
                        autoUnblock: false,
                        clickUnblock: false,
                        content: "Script Fechado!!!"
                    });
                    resolve()

                }, "json")
                .fail(function (Ex) {
                    //Erro no save
                    bootbox.alert("Não foi possível gravar como negativo!!!");
                    reject(Ex)
                })

        })
    }


    $("#fechar_negativo").click(function () {

        autoriza = $("[name=autoriza_gravacao]:checked").val();

        if (typeof autoriza == 'undefined') { // testar se não seleccionaram nenhuma opção
            bootbox.alert("INDIQUE SE AUTORIZA A CHAMADA!");
            return;
        } else {
            fnSubmeterNegativo();
        }


    });

    $("#testes").click(function () {

        /*
        * Testar se element existe:
        *
        * if ($('#estou_na_primeira_pagina').length > 0) {
        *    // existe
        * }
        *
        * */


        if ($('#perfil_entrada').length > 0) {
            bootbox.alert("Já passámos da primeira página");
        } else {
            bootbox.alert("Não sei onde estou!");
        }

    });


    return {
        init: fnInit,
        setOk: fnSetOk,
        isOk: function () {
            return bOkForFscontact;
        }
    }
})();

controller.init();

//Validaçao FSCONTACT
window.addEventListener("message", function (event) {
    if (event.data == "isValid")
        parent.postMessage(controller.isOk(), event.origin);

}, false);