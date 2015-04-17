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
        if (w_total != w_dig_controlo) {
            return false;
        }
        return true;
    },
    checkNIF: function fnIsNIF(sNif) {
        var c;
        var checkDigit = 0;
        if (nif !== null && nif.length === 9) {
            c = nif.charAt(0);
            if (c == '1' || c == '2' || c == '5' || c == '6' || c == '8' || c == '9') {
                checkDigit = c * 9;
                for (i = 2; i <= 8; i++) {
                    checkDigit += nif.charAt(i - 1) * (10 - i);
                }
                checkDigit = 11 - (checkDigit % 11);
                if (checkDigit >= 10)
                    checkDigit = 0;

                if (checkDigit !== parseInt(nif.charAt(8)))
                    return false;
            }
            else
                return false;
        }
        else
            return false;
    }

};

Object.freeze(mUtil); // não permite que a classe seja "mexida" de fora