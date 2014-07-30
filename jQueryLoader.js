function Exception(message) {
    this.message = message;
    this.name = "Exception";
}

try {
    main(jQuery);
} catch (e) {
    console.log(e.message);
    try {
        if (typeof unsafeWindow.jQuery === 'undefined') {
            throw new Exception("unsafeWindow failed!");
        }
        main(unsafeWindow.jQuery);
    } catch (e) {
        console.log(e.message);
        try {
            var script = document.createElement("script");
            script.textContent = "(" + main.toString() + ")(window.jQuery);";
            document.body.appendChild(script);
        } catch (e) {
            console.log(e.message);
        }
    }
}