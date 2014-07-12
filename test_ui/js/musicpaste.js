var mainApp = angular.module("MusicPaste", ["ngRoute"]);

////////////////////////////////////////////////////////////////////////////////
// DIRECTIVES
////////////////////////////////////////////////////////////////////////////////
/**
 * AngularJS has a problem with src element in object tags
 * here is a fix found at:
 * https://github.com/angular/angular.js/issues/339#issuecomment-19384664
 */
mainApp.directive('embedSrc', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var current = element;
      scope.$watch(function() { return attrs.embedSrc; }, function () {
        var clone = element
                      .clone()
                      .attr('src', attrs.embedSrc);
        current.replaceWith(clone);
        current = clone;
      });
    }
  };
});

mainApp.directive('markdown', function (){
    //console.log("evaluating markdown");
    var converter = new Showdown.converter();
    return {
        restrict: 'AEC',
        link: function (scope, element, attrs) {
        //console.log("evaluating markdown 2");
		var htmlText = converter.makeHtml(element.text() || '');
		element.html(htmlText);
        }
    };
});


mainApp.directive('vexchord', function($compile){
    //console.log("rendering vextab");
    return{
        restrict: 'E',
        link: function(scope, element, attrs){
            //console.log("attributes = ",attrs);
            //console.log(attrs.key);
            //console.log(attrs.string);
            //console.log(attrs.shape);
             var el = createChordElement(createChordStruct(attrs.key, attrs.string, attrs.shape));
             $compile(el)(scope);
             element.replaceWith(el);
             //console.log("finish vexchord processing");
        }
    }
});


mainApp.controller('vextabController', ['$scope', function($scope) {
    console.log("paper starting")
    $scope.vextabText = 
"\
tabstave notation=true \n\
notes 4-5-6/3 10/4 \
\
";
    //TODO here add the player
    $scope.playing = false;
    $scope.instruments = [
        "acoustic_grand_piano",
        "acoustic_guitar_nylon",
        "acoustic_guitar_steel",
        "electric_guitar_jazz",
        "distortion_guitar",
        "electric_bass_finger",
        "electric_bass_pick",
        "trumpet",
        "brass_section",
        "soprano_sax",
        "alto_sax",
        "tenor_sax",
        "baritone_sax",
        "flute",
        "synth_drum"
        ];
    $scope.selectedInstrument = $scope.instruments[0];
    //TODO here add play/pause/select instrument  functions
}]);
  
mainApp.directive('vextabPaper', ['$compile', function($compile) {
    console.log("paper starting")
    var canvas = document.createElement('canvas');
    renderer = new Vex.Flow.Renderer( canvas,
                  //Vex.Flow.Renderer.Backends.RAPHAEL); //TODO support raphael
                  Vex.Flow.Renderer.Backends.CANVAS);
    artist = new Vex.Flow.Artist(10, 10, 600, {scale: 1});
    player = null;
    
    if (Vex.Flow.Player) {
        opts = {};
        //if (options) opts.soundfont_url = options.soundfont_url;
        player = new Vex.Flow.Player(artist, opts);
    }
    vextab = new Vex.Flow.VexTab(artist);

    function link(scope, element, attrs) {
    
        var vextabText;
        function updateTab() {
            console.log("updating tab");
            console.log(vextabText);
            try {
                vextab.reset();
                artist.reset();

                vextab.parse(vextabText);
                artist.render(renderer);
                //console.log("artist = ", artist);
            }
            catch (e) {
                console.log("Error");
                console.log(e);
            }      
            $compile(canvas)(scope);
            element.append(canvas);
            //reposition player because something breaks on the default
            if(player !== null && player !== undefined){
                console.log("player created");
                playerCanvas = element.find(".vextab-player");
                playerCanvas.css("position", "absolute")
                            .css("z-index", 10)
                            .css("top", element.get(0).offsetTop)
                            .css("left", element.get(0).offsetLeft)
                            ;
            }
        }

        scope.$watch(attrs.vextabPaper, function(value) {
            //console.log("changing vextab text to: ", value);
            if (!(value !== null && value !== undefined)){
                value = element.text();
                element.text("");
            }
            vextabText = value;
            updateTab();
        });

    }

    return {
      link: link
    };
  }]);
