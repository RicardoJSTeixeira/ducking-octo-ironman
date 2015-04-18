/**
 * Created by vitor.correia on 16-04-2015.
 */
var mUtil = {
    parseNr: function (sVal) {
        return parseFloat(sVal.replace(",", "."))
    },
    roundD: function (fVal) {
        return Math.round(fVal * 100) / 100;
    },
    checkNIB: function checkNIB(pin_nib) {

        var w_dig_controlo = pin_nib.substr(19, 2) * 1;
        var w_total = 0;

        for (w_index = 0; w_index <= 18; w_index++) {
            var w_digito = pin_nib.substr(w_index, 1) * 1;
            w_total = ((w_total + w_digito) * 10) % 97;
        }

        w_total = 98 - ((w_total * 10) % 97);

        return w_total == w_dig_controlo;

    },
    checkNIF: function fnIsNIF(sNif) {
        var c;
        var checkDigit;

        if (!(sNif !== null && sNif.length === 9))
            return false;


        c = sNif.charAt(0);
        if (!(c == '1' || c == '2' || c == '5' || c == '6' || c == '8' || c == '9'))
            return false;

        checkDigit = c * 9;
        for (i = 2; i <= 8; i++) {
            checkDigit += sNif.charAt(i - 1) * (10 - i);
        }
        checkDigit = 11 - (checkDigit % 11);
        if (checkDigit >= 10)
            checkDigit = 0;

        return checkDigit === parseInt(sNif.charAt(8));



    }

};

Object.freeze(mUtil); // não permite que a classe seja "mexida" de fora