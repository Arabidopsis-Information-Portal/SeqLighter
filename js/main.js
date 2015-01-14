define(
       [
           'dojo/_base/declare',
           'JBrowse/Plugin'
       ],
    function(
        declare,
        JBrowsePlugin
    ) {

return declare( JBrowsePlugin,
{

    constructor: function( args ) {
        console.log("Loaded SeqLighter plugin");
        var thisB = this;
        var browser = this.browser;  // this.browser set in Plugin superclass constructor
        [
          'plugins/SeqLighter/jslib/SeqLighter.js',
          'plugins/SeqLighter/jslib/biojs/src/main/javascript/Biojs.js',
          'plugins/SeqLighter/jslib/biojs/src/main/javascript/Biojs.Tooltip.js',
          'plugins/SeqLighter/jslib/biojs/src/main/javascript/Biojs.Sequence.js',
          'plugins/SeqLighter/jslib/biojs/src/main/resources/dependencies/jquery/jquery-1.4.2.min.js',
          'plugins/SeqLighter/jslib/biojs/src/main/resources/dependencies/jquery/jquery-ui-1.8.2.custom.min.js'
        ].forEach(function(src) {
          var script = document.createElement('script');
          script.src = src;
          script.async = false;
          document.head.appendChild(script);
        });

    }
});

});
