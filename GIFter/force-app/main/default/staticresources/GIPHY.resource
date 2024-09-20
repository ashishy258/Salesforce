window._GIPHY = (function() {
    var apiKey = "0JEPxd7oh6W757fetFg43Dutv696nI4s";
    var _results = null;

    return { //public API
        getApiKey: function() {
            return apiKey;
        },
        getResults: function() {
            return _results;
        },
        setResults: function(results) {
          _results = results
        }
    };
}());

