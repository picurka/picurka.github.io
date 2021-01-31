function loadLang(supported_languages, default_lang, site_lang) {
    function javaSplit(s, separator, limit) {
        var arr = s.split(separator, limit);
        var left = s.substring(arr.join(separator).length + separator.length);
        arr.push(left);
        return arr;
    }
    function getDataFromUrl() {
        var originLocation = window.location.origin + "/"
        var actLocation = window.location.href
        var locWithoutOrigin = actLocation.replace(originLocation, "")
        if (locWithoutOrigin == "") {
            return ["", ""]
        } else {
            var javaSplitted = javaSplit(locWithoutOrigin, "/", 1)
            var splitted = []
            splitted.push(javaSplitted[0])
            if (javaSplitted[1] != "") {
                splitted.push(javaSplitted[1])
            }
            var firstPart = splitted[0]
            var remaining = ""
            if (splitted.length == 1) {
                if (supported_languages.includes(firstPart)) {
                    return [firstPart, remaining]
                } else { 
                    return ["", firstPart]
                }
            } else if (splitted.length == 2) {
                remaining = splitted[1]
                if (supported_languages.includes(firstPart)) {
                    return [firstPart, remaining]
                } else {
                    return ["", firstPart + "/" + remaining]
                }
            }
        }
    }
    function getBestSuitableSupportedLang(lang, locale, supported) {
        var supported_lang = supported.shift();
    
        if (supported.includes(lang + "-" + locale)) {
            supported_lang = lang + "-" + locale;
        } else if (supported.includes(lang)) {
            supported_lang = lang;
        }
        return supported_lang;
    }
    var [lang, locale] = (((navigator.userLanguage || navigator.language).replace('-', '_')).toLowerCase()).split('_');
    var data_from_url = getDataFromUrl()
    var selected_lang_from_url = data_from_url[0]
    var remaining_from_url = data_from_url[1]
    var suitable_lang = getBestSuitableSupportedLang(lang, locale, supported_languages)
    if (selected_lang_from_url != "") {
        // do nothing
    } else {
        var hostname = window.location.hostname;
        var referrer = document.referrer;
        var landingPage = !referrer || referrer.indexOf(hostname) == -1;
        if (landingPage && (site_lang !== suitable_lang)) {
            if (remaining_from_url === "") {
                window.location = '/' + suitable_lang + '/';
            } else {
                window.location = '/' + suitable_lang + '/' + remaining_from_url;
            }
        }
        //if (current_lang !== suitable_lang) {
        //    window.location = '/' + suitable_lang + '/';
        //}
    } 
}