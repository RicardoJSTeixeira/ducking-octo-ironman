/**
 * Created by vitor.correia on 10-04-2015.
 */

var app3 = (function () {

    var oPerfil = {}; // dados da pagina 2
    var aPropostas = [];
    var fnNextPag;
    var fnPreviousPag;

    var cliente_aceita_observacoes;
    var quantas_boxes;

    function fnInit(oDadosPagina2) {

        oPerfil = oDadosPagina2;

        if ($("#container").find("#pag3").length) {
            $("#container").find("#pag3").show();
            fnGetDados(0);
            return true
        }

        $.get("pages/pag3.html",
            function (sHTML) {
                var sRendered = Mustache.render(sHTML, oPerfil);
                $("#container").append(sRendered);

                fnGetDados(0);

                fnSetEvents();

            },
            "html")

    }

    function fnSetNextPage(fn) {
        fnNextPag = fn;
    }

    function fnSetPreviousPage(fn) {
        fnPreviousPag = fn;
    }

    function fnSetEvents() {


        $("#container_propostas").on("change", "[name=propostas]", function () { // quando mudar o elemento named propostas, dentro do container

            var oProposta = aPropostas[this.value];
            fnPopulateTableProposta(oProposta);
            fnArgumentario(oProposta.mens_1a12, oPerfil.mensalidade_total);

        });

        $("#ver_proposta_um").click(function () {
            fnGetDados(0);
        });

        $("#ver_proposta_dois").click(function () {
            fnGetDados(1);
        });

        $("#ver_proposta_tres").click(function () {
            fnGetDados(2);
        });

        $("#cliente_aceita_proposta").click(function () {
            fnModalClienteAceita();
        });

        //previous
        $("#pag3_back").click(function () {

            fnPreviousPag();

        });

    }

    function fnGetSelectedProposta() {
        var jqP = $("[name=propostas]:checked");

        if (!jqP.length)
            return false;

        return aPropostas[jqP.val()];
    }

    function fnArgumentario(nova, antiga) {

        $("#descritivo_argumentario").html(fnCalcArgumentario(nova, antiga));

    }

    function fnCalcArgumentario(nova, antiga) {
        nova = mUtil.parseNr(nova);
        antiga = mUtil.parseNr(antiga);

        var fResultado;

        if (nova > antiga) {

            fResultado = nova - antiga;
            return "Por apenas mais <br><strong>" + mUtil.roundD(fResultado / 31) + "€ /dia</strong>";

        } else {

            fResultado = antiga - nova;
            return "Vai poupar <br><strong>" + mUtil.roundD(fResultado) + "€ /mês</strong>";
        }

    }


    function fnPopulateTableProposta(oProposta) {

        var sTableTR = "\
        <tr>\
            <td>\
                <p class='lead'><u>{{tv_canais}}{{^tv_canais}}Sem TV{{/tv_canais}}</u></p>\
                <p><small>{{equip_tv}}{{^equip_tv}}{{/equip_tv}}</small></p>\
                <p><small>{{tv_horas_gravacao}}{{^tv_horas_gravacao}}{{/tv_horas_gravacao}}</small></p>\
                <p><small>{{notas_televisao}}{{^notas_televisao}}{{/notas_televisao}}</small></p>\
            </td>\
            <td>\
                <p class='lead'><u>{{net}}{{^net}}Sem Net{{/net}}</u></p>\
                <p><small>{{equip_net}}{{^equip_net}}{{/equip_net}}</small></p>\
                <p><small>{{notas_net}}{{^notas_net}}{{/notas_net}}</small></p>\
            </td>\
            <td>\
                <p class='lead'><u>{{telefone}}{{^telefone}}Sem Telefone{{/telefone}}</u></p>\
                <p><small>{{notas_telefone}}{{^notas_telefone}}{{/notas_telefone}}</small></p>\
            </td>\
            <td>\
                <p class='lead'><u>{{movel_cartoes}}{{^movel_cartoes}}Sem Telemovel{{/movel_cartoes}}</u></p>\
                <p><small>{{movel_minutos}}{{^movel_minutos}}{{/movel_minutos}}</small></p>\
                <p><small>{{movel_internet}}{{^movel_internet}}{{/movel_internet}}</small></p>\
            </td>\
            <td>\
                <p class='lead'><u>{{net_movel}}{{^net_movel}}Sem Net Movel{{/net_movel}}</u></p>\
                <p><small>{{notas_net_movel}}{{^notas_net_movel}}{{/notas_net_movel}}</small></p>\
            <td>\
                <p><u>{{tv_creditos}}{{^tv_creditos}}Sem Creditos{{/tv_creditos}}</u></p>\
            <td>\
                <p class='lead'><u>{{mens_1a12}}{{^mens_1a12}}Sem mensalidade{{/mens_1a12}}</u></p>\
                <p><small>Preço 13-24 meses: {{mens_13a24}}{{^mens_13a24}}{{/mens_13a24}}</small></p>\
                <p><small>Preço > 24 meses: {{mens_24}}{{^mens_24}}{{/mens_24}}</small></p>\
                <p><small>Preço 1ª mensalidade: {{mens_1}}{{^mens_1}}{{/mens_1}}</small></p>\
        </tr>";

        $("#table_proposta > tbody").html(Mustache.render(sTableTR, oProposta));
        $("#proposta_pacote").text(oProposta.pacote);
        $("#proposta_pacote_comercial").text(oProposta.pacote_comercial);

    }

    function fnTableResetPropostaEArgumentarios() {
        $("#table_proposta > tbody").empty();
        $("#proposta_pacote").empty();
        $("#proposta_pacote_comercial").empty();
        $("#descritivo_argumentario").empty();
    }

    function fnGetDados(nr) {

        fnTableResetPropostaEArgumentarios();

        $.get("ajax/request.php",
            {
                action: "GetProposta",
                dados_perfil: oPerfil,
                nr_proposta: nr
            },
            fnMakePropostas, "json")

    }

    function fnMakePropostas(aPropostasRecebidas) {

        aPropostas = aPropostasRecebidas;

        if (!aPropostas.length) {
            bootbox.alert("Consulta às propostas não retornou dados!");
            console.warn("Consulta às propostas não retornou dados!");
        }


        var sRadiosPropostas = "";

        aPropostas.forEach(function (aProposta, index) {

            sRadiosPropostas += ' <label class="radio-inline">\
            <input type="radio" name="propostas" value="' + index + '"> ' + aProposta.pacote + '\
            </label>';


        });

        $("#container_propostas").html(sRadiosPropostas);

    }

    function fnModalClienteAceita() {

        var oProposta = fnGetSelectedProposta();

        if (!oProposta) {
            bootbox.alert("Sem proposta seleccionada");
            console.warn("Sem proposta seleccionada");
            return false;
        }

        var sMessage = "\
            <form onsubmit='return false;' class='form-inline'>\
            <p><strong>O cliente optou por aderir:</strong></p>\
            <p>{{pacote}}</p>\
            <p>Preço 13-24 meses: {{mens_13a24}}</p>\
            <p>Preço > 24 meses: {{mens_24}}</p>\
            <div class=form-group'>\
                <label for='quantas_boxes'>Quantas box?</label>\
                <select id='quantas_boxes' required class='form-control input-sm required'>\
                    <option value=''>[Seleccione uma opção]</option>\
                    <option value='1'>1</option>\
                    <option value='2'>2</option>\
                    <option value='3'>3</option>\
                </select>\
            </div>\
            <ul>\
                <li>Informar o cliente sobre o direito de exercer a livre resolução do contrato no prazo de 14 dias.</li>\
                <li>Sobre o período de fidelização</li>\
                <li>Sobre a data de instalação N+3</li>\
                <li>Sobre a data de entrega dos cartões via CTT</li>\
                <li>Sobre a necessidade de telemóvel desbloqueado à rede OPT</li>\
                <li>Se tem altera tarifário móvel NOS: O valor do saldo que tem no cartão mantêm-se, para gastar em aditivos.</li>\
            </ul>\
            <strong>Em continuação deve inserir as informações pessoais do cliente.</strong> \
            <hr>\
            <div class='form-group'>\
            <label for='cliente_aceita_observacoes'>Observações</label>\
                   <textarea class='form-control required' required id='cliente_aceita_observacoes'></textarea>\
     </div>\
     </form>\
            ";

        sMessage = Mustache.render(sMessage, oProposta);

        bootbox.dialog({
                title: "CLIENTE ACEITA",
                message: sMessage,
                buttons: {
                    success: {
                        label: "Continuar",
                        className: "btn-success",
                        callback: function () {

                           if (!($("#quantas_boxes").valid() && $("#cliente_aceita_observacoes").valid()))
                                return false;

                            //globais ao app3
                            cliente_aceita_observacoes = $('#cliente_aceita_observacoes').val();
                            quantas_boxes = $("#quantas_boxes").val();

                            fnNextPag();
                        }
                    },
                    main: {
                        label: "Cancelar",
                        className: "btn-primary",
                        callback: function () {
                            return true;
                        }
                    }
                }
            }
        );

    }

    function fnGetValues() {
        return {
            proposta: fnGetSelectedProposta(),
            cliente_aceita_observacoes: cliente_aceita_observacoes,
            quantas_boxes: quantas_boxes
        }
    }

    return {
        init: fnInit,
        getValues: fnGetValues,
        setNextPage: fnSetNextPage,
        setPreviousPage: fnSetPreviousPage,
        hide: function () {
            $("#container").find("#pag3").hide();
        }
    }

})();