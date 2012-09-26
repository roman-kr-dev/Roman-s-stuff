(function() {
    var hidden, change, vis = {
            hidden: "visibilitychange",
            mozHidden: "mozvisibilitychange",
            webkitHidden: "webkitvisibilitychange",
            msHidden: "msvisibilitychange",
            oHidden: "ovisibilitychange" /* not currently supported */
        };             
    for (hidden in vis) {
        if (vis.hasOwnProperty(hidden) && hidden in document) {
            change = vis[hidden];
            break;
        }
    }
    if (change)
        document.addEventListener(change, onchange);
    else if (/*@cc_on!@*/false) // IE 9 and lower
        document.onfocusin = document.onfocusout = onchange
    else
        window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var body = document.body,
			evt = evt || window.event,
			type;

        if (evt.type == "focus" || evt.type == "focusin")
           type = "visible";
        else if (evt.type == "blur" || evt.type == "focusout")
            type = "hidden";
        else        
            type = this[hidden] ? "hidden" : "visible";

		$(window).trigger('screenSaverFocusChange', [type]);
    }
})();