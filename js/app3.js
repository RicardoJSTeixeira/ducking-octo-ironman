/**
 * Created by vitor.correia on 10-04-2015.
 */

var app3 = (function () {

    var oPerfil = {}; // dados da pagina 2
    var aPropostas = [];
    var fnNextPag;
    var fnPreviousPag;
    var jqC;

    var iNrProp;

    var cliente_aceita_observacoes;
    var quantas_boxes;

    var sTemplate;

    var sInfoClienteTemplate = '<table>\
                                    <thead>\
                                        <tr>\
                                            <th colspan="2"><h3>Dados Operador Actual</h3></th>\
                                        </tr>\
                                    </thead>\
                                    <tbody>\
                                        <tr>\
                                            <th>Pacote actual:</th>\
                                            <td>{{pacote.operadora}}_{{pacote.tipo_pacote}}</td>\
                                        </tr>\
                                        <tr>\
                                            <th>Tecnologia:</th>\
                                            <td>{{tecnologia}}</td>\
                                        </tr>\
                                        <tr>\
                                            <th>Tem PC:</th>\
                                            <td>{{net_fixa.tem_computador_portatil}}</td>\
                                        </tr>\
                                        <tr>\
                                            <th>Tem Tablet:</th>\
                                            <td>{{net_movel.utiliza_tablet_smartphone}}</td>\
                                        </tr>\
                                        <tr>\
                                            <th>Mensalidade:</th>\
                                            <td>{{mensalidade_total}} €</td>\
                                        </tr>\
                                    </tbody>\
                                </table>';

    function fnMakeDadosCliente() {

        var sRendered = Mustache.render(sInfoClienteTemplate, oPerfil);

        jqC.find("#info-cliente").html(sRendered);
    }

    function fnInit(oDadosPagina2) {

        if (oDadosPagina2)
            oPerfil = oDadosPagina2;

        jqC = $("#container").find("#pag3");

        if (jqC.length) {
            fnMakeDadosCliente();
            jqC.show();
            return true
        }

        $.get("pages/pag3.html",
            function (sHTML) {
                sTemplate = sHTML;
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

        var jqHB = $('html, body');

        jqC.find("#container_propostas").on("change", "[name=propostas]", function () { // quando mudar o elemento named propostas, dentro do container


            var oProposta = aPropostas[this.value];
            fnPopulateTableProposta(oProposta);
            fnArgumentario(oProposta.mens_1a12, oPerfil.mensalidade_total);

            jqHB.clearQueue().stop()
                .animate({scrollTop: jqC.find("#descritivo_argumentario").offset().top}, 1000);

            mUtil.disableAnimationOneScroll(jqHB)

        });

        mUtil.disableAnimationOneScroll(jqHB);

        jqC.find("[name=ver_proposta]").change(function () {
            fnGetDados(this.value);
        });

        jqC.find("#cliente_aceita_proposta").click(function () {
            fnModalClienteAceita();
        });

        //previous
        jqC.find("#pag3_back").click(function () {

            fnPreviousPag();

        });

    }

    function fnGetSelectedProposta() {
        var jqP = jqC.find("[name=propostas]:checked");

        if (!jqP.length)
            return false;

        return aPropostas[jqP.val()];
    }

    function fnArgumentario(nova, antiga) {

        jqC.find("#descritivo_argumentario").html(fnCalcArgumentario(nova, antiga));

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
//todo inverter
        var sTableTR = "\
        </tr>\
        <tr>\
            <th>Televisão</th>\
            <td>\
                <p class='lead'><u>{{tv_canais}}{{^tv_canais}}Sem TV{{/tv_canais}}</u></p>\
                <p><small>{{equip_tv}}{{^equip_tv}}{{/equip_tv}}</small></p>\
                <p><small>{{tv_horas_gravacao}}{{^tv_horas_gravacao}}{{/tv_horas_gravacao}}</small></p>\
                <p><small>{{notas_televisao}}{{^notas_televisao}}{{/notas_televisao}}</small></p>\
            </td>\
        </tr>\
            <th>Net Fixa</th>\
            <td>\
                <p class='lead'><u>{{net}}{{^net}}Sem Net{{/net}}</u></p>\
                <p><small>{{equip_net}}{{^equip_net}}{{/equip_net}}</small></p>\
                <p><small>{{notas_net}}{{^notas_net}}{{/notas_net}}</small></p>\
            </td>\
        </tr>\
            <th>Telefone</th>\
            <td>\
                <p class='lead'><u>{{telefone}}{{^telefone}}Sem Telefone{{/telefone}}</u></p>\
                <p><small>{{notas_telefone}}{{^notas_telefone}}{{/notas_telefone}}</small></p>\
            </td>\
        </tr>\
            <th>Telemóvel</th>\
            <td>\
                <p class='lead'><u>{{movel_cartoes}}{{^movel_cartoes}}Sem Telemovel{{/movel_cartoes}}</u></p>\
                <p><small>{{movel_minutos}}{{^movel_minutos}}{{/movel_minutos}}</small></p>\
                <p><small>{{movel_internet}}{{^movel_internet}}{{/movel_internet}}</small></p>\
            </td>\
        </tr>\
            <th>Net Móvel</th>\
            <td>\
                <p class='lead'><u>{{net_movel}}{{^net_movel}}Sem Net Movel{{/net_movel}}</u></p>\
                <p><small>{{notas_net_movel}}{{^notas_net_movel}}{{/notas_net_movel}}</small></p>\
            </td>\
        </tr>\
            <th>Cinema</th>\
            <td>\
                <p><u>{{tv_creditos}}{{^tv_creditos}}Sem Creditos{{/tv_creditos}}</u></p>\
            </td>\
        </tr>\
        <th>Mensalidade</th>\
            <td>\
                <p class='lead'><u>{{mens_1a12}}{{^mens_1a12}}Sem mensalidade{{/mens_1a12}}</u></p>\
                <p><small>Preço 13-24 meses: {{mens_13a24}}{{^mens_13a24}}{{/mens_13a24}}</small></p>\
                <p><small>Preço > 24 meses: {{mens_24}}{{^mens_24}}{{/mens_24}}</small></p>\
                <p><small>Preço 1ª mensalidade: {{mens_1}}{{^mens_1}}{{/mens_1}}</small></p>\
            </td>\
        </tr>";

        jqC.find("#table_proposta > tbody").html(Mustache.render(sTableTR, oProposta));
        jqC.find("#proposta_pacote").text(oProposta.pacote);
        jqC.find("#proposta_pacote_comercial").text(oProposta.pacote_comercial);

    }

    function fnTableResetPropostaEArgumentarios() {

        jqC.find("#table_proposta > tbody").empty();
        jqC.find("#proposta_pacote").empty();
        jqC.find("#proposta_pacote_comercial").empty();
        jqC.find("#descritivo_argumentario").empty();

    }

    function fnGetDados(nr, force) {

        if (!oPerfil)
            return false;

        var iNr = +nr;

        if (!_.isFinite(iNr))
            return false;

        if (iNr > 3)
            return false;

        if (!jqC)
            return false;

        if (iNrProp == iNr && !force)
            return false;

        iNrProp = iNr;


        fnTableResetPropostaEArgumentarios();

        $.get("ajax/request.php",
            {
                action: "GetProposta",
                dados_perfil: oPerfil,
                nr_proposta: iNr
            },
            function (aPropostasRecebidas) {

                if (!aPropostasRecebidas.length) {
                    console.warn("Consulta às propostas[" + (iNr + 1 ) + "] não retornou dados!");
                    //bootbox.alert("Consulta às propostas[" + (iNr + 1 ) + "] não retornou dados!");

                    if (iNr < 2)
                        jqC.find("[name=ver_proposta]").filter('[value=' + ++iNr + ']').parent().button('toggle');
                    else
                        bootbox.alert("Consulta às propostas não retornou dados!");
                        console.warn("Consulta às propostas não retornou dados!");
                }

                fnMakePropostas(aPropostasRecebidas);
            },
            "json")

    }

    function fnMakePropostas(aPropostasRecebidas) {

        aPropostas = aPropostasRecebidas;

        var sRadiosPropostas = "";

        aPropostas.forEach(function (aProposta, index) {

            sRadiosPropostas += ' <label class="btn btn-primary col-xs-6 col-md-4 col-lg-3">\
                                      <input type="radio" name="propostas" value="' + index + '"> ' + aProposta.pacote + '_' + aProposta.pacote_comercial + '\
                                  </label>';


        });

        jqC.find("#container_propostas").html(sRadiosPropostas);

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

        var jqB = bootbox.dialog({
            title: "CLIENTE ACEITA",
            message: sMessage,
            buttons: {
                success: {
                    label: "Continuar",
                    className: "btn-success",
                    callback: function () {
                        var jqQB = $("#quantas_boxes");
                        var jqCAO = $("#cliente_aceita_observacoes");
                        if (!(jqQB.valid() && jqCAO.valid()))
                            return false;

                        //globais ao app3
                        cliente_aceita_observacoes = jqCAO.val();
                        quantas_boxes = jqQB.val();

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
        });

        jqB.on("shown.bs.modal", function () {
            jqB.clearQueue().stop().animate({scrollTop: 0}, 100)
        })
    }

    function fnGetValues() {
        return {
            proposta: fnGetSelectedProposta(),
            cliente_aceita_observacoes: cliente_aceita_observacoes,
            quantas_boxes: quantas_boxes
        }
    }

    function fnGetFristProposta(oDadosPagina2) {

        if (oDadosPagina2)
            oPerfil = oDadosPagina2;

        var sRendered = Mustache.render(sTemplate, oPerfil);

        var jqCT = $("#container");
        if (!jqCT.find("#pag3").length)
            jqC = jqCT.append(sRendered).find("#pag3");
        else
            jqC = jqCT.find("#pag3").remove().end().append(sRendered).find("#pag3");


        fnSetEvents();

        if (!jqC)
            return false;

        if (!jqC.find("[name=ver_proposta]").filter('[value=0]').is(":checked"))
            jqC.find("[name=ver_proposta]").filter('[value=0]').parent().button('toggle');
        else
            fnGetDados(0, true)
    }

    return {
        init: fnInit,
        restartPropostas: fnGetFristProposta,
        getValues: fnGetValues,
        setNextPage: fnSetNextPage,
        setPreviousPage: fnSetPreviousPage,
        hide: function () {
            jqC.hide();
        }
    }

})
();