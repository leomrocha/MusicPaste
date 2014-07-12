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
    console.log("paper starting");
    console.log($scope);
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
        "baritone_sax"//,
        //"flute",
        //"synth_drum"
        ];
    $scope.selectedInstrument = $scope.instruments[0];
    //TODO here add play/pause/select instrument  functions
        //load posts index from json file ... FUTURE replace for somethign better
    $scope.onSelectInstrument = function(instrument){
        console.log("selecting instrument =", $scope.selectedInstrument);
        $scope.selectedInstrument = instrument;
        if( $scope.player !== null && $scope.player !== undefined && $scope.player !== 'undefined'){
                //set instrument 
                $scope.player.render(instrument);
            }
    };
    $scope.play = function(){
            //console.log($scope);
            //console.log("player = ");
            //console.log($scope.player);
            if( $scope.player !== null && $scope.player !== undefined && $scope.player !== 'undefined'){
                //console.log("play");
                //update player:
                $scope.player.render();
                $scope.playing = true;
                //$scope.player.render();
                //console.log($scope.player);
                $scope.player.play();
            }
            
        };
    
    $scope.stop = function(){
            //console.log($scope);
            if( $scope.player !== null && $scope.player !== undefined && $scope.player !== 'undefined'){
                //console.log("stop");
                $scope.playing = false;
                $scope.player.stop();
            }
            
        };
}]);
  
mainApp.directive('vextabPaper', ['$compile', function($compile) {
    //console.log("paper starting")
    var canvas = document.createElement('canvas');
    canvas.className = "vex-canvas";
    var renderer = new Vex.Flow.Renderer( canvas,
                  //Vex.Flow.Renderer.Backends.RAPHAEL); //TODO support raphael
                  Vex.Flow.Renderer.Backends.CANVAS);
    var artist = new Vex.Flow.Artist(10, 10, 600, {scale: 1});
    var player = null;
    
    if (Vex.Flow.Player) {
        opts = {};
        //if (options) opts.soundfont_url = options.soundfont_url;
        player = new Vex.Flow.Player(artist, opts);
        //do not show default controls - changed to default on the vextab code
        //player.removeControls();
    }
    vextab = new Vex.Flow.VexTab(artist);

    function link(scope, element, attrs) {
        //update parent things:
        scope.canvas = canvas;
        scope.artist = artist;
        scope.vextab = vextab;
        scope.player = player;
        
        var vextabText;
        function updateTab() {
            //console.log("updating tab");
            //console.log(vextabText);
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
                console.log("player created: ", player);
                player.fullReset();
                playerCanvas = element.find(".vextab-player");
                scoreCanvas =  element.find(".vex-canvas");
                //console.log("canvas = ", scoreCanvas);
                //console.log(scoreCanvas.get(0).offsetTop);
                //console.log(scoreCanvas.get(0).offsetLeft);
                //playerCanvas.css("position", "absolute")
                //            .css("z-index", 10)
                //            //.css("top", scoreCanvas.get(0).offsetTop)
                //            //.css("left", scoreCanvas.get(0).offsetLeft)
                //            .css("top", 45)
                //            .css("left", 15)
                //            .css
                //            ;
                //playerCanvas.width = ;
                //update canvas height
                //console.log(playerCanvas);
                playerCanvas.height = scoreCanvas.get(0).height;
                //console.log(playerCanvas);
                $compile(playerCanvas)(scope);
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
        transclude:true,
        link: link
    };
  }]);
