/**
 * Created by vitor.correia on 10-04-2015.
 */
var banana2000xpto=false;
function ok(){
    return banana2000xpto
}
var controller = (function () {
    var oPageData = {
        pag1: {},
        pag2: {},
        pag3: {},
        pag4: {},
        pag5: {}
    };


    function fnInit() {
//configuraçao de paginas
//app1 inicial
        app1.init();
        app1.setNextPage(function () {
            app1.hide();
            oPageData.pag1 = app1.getValues();
            app2.init()
        });

//app2
        app2.setNextPage(function () {
            app2.hide();

            oPageData.pag2 = app2.getValues();

            app3.init(oPageData.pag2)
        });

        app2.setPreviousPage(function () {
            app2.hide();
            app1.init();
        });

//app3
        app3.setNextPage(function () {
            app3.hide();
            oPageData.pag3 = app3.getValues();
            app4.init(oPageData)
        });

        app3.setPreviousPage(function () {
            app3.hide();
            app2.init()
        });

//app4
        app4.setNextPage(function () {
            app4.hide();
            oPageData.pag4 = app4.getValues();
            app5.init(oPageData)
        });

        app4.setPreviousPage(function () {
            app4.hide();
            app3.init()
        });
//app5
        app5.setNextPage(function () {
            app5.hide();
            oPageData.pag5 = app5.getValues();
            app6.init(oPageData)
        });

        app5.setPreviousPage(function () {
            app5.hide();
            app4.init()
        });
//app6 final

        app6.setPreviousPage(function () {
            app6.hide();
            app5.init()
        });

        app6.anotherOne(function(){
            app6.hide();
            app2.init()
        })
    }


    return {
        init: fnInit
    }
})();

controller.init();