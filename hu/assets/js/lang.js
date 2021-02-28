function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
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

    function goToDefaultLangPage() {
        var aHref = document.location.href
        var aOrigin = document.location.origin
        var withoutSlash = aOrigin
        var withSlash = withoutSlash + "/"
        if (withoutSlash !== aHref && withSlash !== aHref) {
            window.location = '/', true;
        }
    }

    function goToLangPage(suitable_lang) {
        var aHref = document.location.href
        var aOrigin = document.location.origin
        var withoutSlash = aOrigin + "/" + suitable_lang 
        var withSlash = withoutSlash + "/"
        if (withoutSlash !== aHref && withSlash !== aHref) {
            window.location = '/' + suitable_lang + '/', true;
        }
    }

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }
    var [lang, locale] = (((navigator.userLanguage || navigator.language).replace('-', '_')).toLowerCase()).split('_');
    var data_from_url = getDataFromUrl()
    var selected_lang_from_url = data_from_url[0]
    var remaining_from_url = data_from_url[1]
    var suitable_lang = getBestSuitableSupportedLang(lang, locale, supported_languages)
    var cookie_lang = readCookie("language-selected")
    var local_storage_lang = localStorage.getItem("language-selected")
    if (!isEmpty(local_storage_lang)) {
        suitable_lang = local_storage_lang
    } else if (!isEmpty(cookie_lang)) {
        suitable_lang = cookie_lang
    }

    if (selected_lang_from_url != "" && (suitable_lang == selected_lang_from_url)) {
        // do nothing
    } else {
        var hostname = window.location.hostname;
        var referrer = document.referrer;
        var landingPage = !referrer || referrer.indexOf(hostname) == -1;

        if (landingPage && site_lang !== suitable_lang) {
            if (remaining_from_url === "") {
                if (site_lang !== default_lang) {
                    window.location = '/' + suitable_lang + '/';
                } else {
                    window.location = '/'
                }
            } else {
                if (site_lang !== default_lang) {
                    window.location = '/' + suitable_lang + '/' + remaining_from_url;
                } else {
                    window.location = + '/' + remaining_from_url;
                }
            }
        } else {
            if (site_lang !== suitable_lang) {
                if (site_lang !== default_lang) {
                    if (suitable_lang === default_lang) {
                        goToDefaultLangPage()
                    } else {
                        goToLangPage(suitable_lang)
                    }
                } else {
                    if (suitable_lang === default_lang) {
                        goToDefaultLangPage()
                    } else {
                        goToLangPage(suitable_lang)
                    }
                }
            }
        }
    } 
}