var mainApp = angular.module("MusicPaste", ["ui.bootstrap"]);

////////////////////////////////////////////////////////////////////////////////
//Avoid template collition between Django and AngularJS
mainApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

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
    //console.log("paper starting");
    //console.log($scope);
    
    $scope.parseOK = false;
    $scope.parseError = "All is GOOOOD";
    
    $scope.vextabText = 
"\n\
tabstave notation=true \n\
notes 4-5-6/3 10/4 \n\
\n\
tabstave notation=true clef=bass key=Ab time=C|\n\
notes 4-5/6\n\
\n\
tabstave notation=true\n\
notes 4-5-6/3 ## | 5-4-2/3 2/2\n\
\n\
tabstave notation=true tablature=false\n\
notes C-D-E/4 #0# | C-D-E-F/4\n\
\n\
tabstave notation=true tablature=false\n\
notes 4-5-6/3 ## =|: 5-4-2/3 2/2 =:|\n\
\n\
tabstave notation=true tablature=false\n\
notes C-D-E/4 #0# =:: C-D-E-F/4 =|=\n\
\n\
tabstave notation=false\n\
notes 4-5-6b7/3 10/4 | 5-4-2/3 2/2\n\
\n\
tabstave\n\
notes 6-7b9b7/3 7/4 | 9-8-7-6/2\n\
\n\
tabstave notation=true\n\
notes 4-5-6b7v/3 10/1 | 5d-4u-Xd/3 2v/2\n\
\n\
tabstave notation=true tablature=false\n\
  notes (C/4.E/4.G/4) C-E-G/4\n\
\n\
tabstave notation=true\n\
  notes (8/2.7b9b7/3) (5b6/2.5b6/3) 7/4 |\n\
  notes (5/2.6/3.7/4)\n\
\n\
tabstave\n\
  notes (5/2.5/3.7/4) 5h6/3 7/4 |\n\
  notes t12p7p5h7/4 7/5 5s3/5\n\
\n\
tabstave\n\
  notes (8/2.7b9b7/3) (5b6/2.5b6/3)v 7s0/4 |\n\
  notes (5/2.6/3.7/4)v\n\
\n\
tabstave\n\
  notes (5/4.5/5)s(7/4.7/5)s(5/4.5/5) (5/4.5/5)h(7/5) |\n\
  notes t(12/5.12/4)s(5/5.5/4) 3b4/5 5V/6\n\
\n\
options space=10 font-size=12\n\
\n\
tabstave notation=true tablature=false\n\
         time=4/4 key=Ab tuning=eb\n\
  notes :q C-D-E-F/4 | G-A-B/4 C/5\n\
  text :h,.1,C,Em,|\n\
  text :h,G7,C\n\
  text ++, .11, :w, This is a new text line.\n\
\n\
options space=15\n\
tabstave notation=true\n\
notes :q (8/2.7b9b7/3) (5b6/2.5b6/3)v :8 7s12/4\n\
notes t:16:9s:8:3s:16:0/4\n\
\n\
tabstave notation=true key=A\n\
notes :q (5/2.5/3.7/4) $.big.A7#9$ 5h6/3 7/4 |\n\
notes :8 7/4 $.italic.sweep$ 6/3 5/2 3v/1 :q 7v/5 $.Arial-10-bold.P.H$ :8 3s5/5\n\
\n\
options font-size=14 space=15\n\
\n\
tabstave notation=true tablature=false\n\
         time=4/4 clef=percussion\n\
  notes :2S Bd/4 :qS Bd/4 :q ## | :8S Bd/4 Bu/4 :qS Bd-Bu-Bd/4 ^3^\n\
  text :w, G Maj7, |, Am\n\
\n\
options space=12 font-size=14\n\
        tab-stems=true tab-stem-direction=up\n\
\n\
tabstave time=4/4 key=A\n\
notes :8 5/5 5/4 5/3 ^3^ :16 5-6-7-8/1 :8 9s10/1 :h s9v/1\n\
\n\
";
    $scope.initText = function(vextabText) {
    //This function is sort of private constructor for controller
        $scope.vextabText = vextabText;
    };
    //here add the player characteristics
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
    
    $scope.tempos = [
        40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 
        72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 
        120, 126, 132, 138, 144, 152, 160, 168, 176, 184, 
        192, 200, 208, 220
        ];
    $scope.selectedTempo = 80;
    
    //TODO here add play/pause/select instrument  functions
        //load posts index from json file ... FUTURE replace for somethign better
    $scope.onSelectInstrument = function(instrument){
        //console.log("selecting instrument =", $scope.selectedInstrument);
        $scope.selectedInstrument = instrument;
        if( $scope.player !== null && $scope.player !== undefined && $scope.player !== 'undefined'){
                //set instrument 
                $scope.player.setInstrument(instrument);
            }
    };
    $scope.onSelectTempo = function(tempo){
        $scope.selectedTempo = tempo;
        if( $scope.player !== null && $scope.player !== undefined && $scope.player !== 'undefined'){
                //set instrument 
                $scope.player.setTempo(tempo);
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
    $scope.save = function(){
        console.log("save TODO");
        //TODO
    };
    
}]);

mainApp.controller('fretboardController', ['$scope', function($scope) {
    console.log("fretboard paper starting");
    
    $scope.parseOK = false;
    $scope.parseError = "All is GOOOOD";
    
    $scope.vextabText = "";

    $scope.initText = function(fretboardText) {
        //This function is sort of private constructor for controller
        $scope.fretboardText = fretboardText;
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
        opts.soundfont_url = '/static/musicapp/soundfont/'
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
        var parseOK = false;
        
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
                //save parse status
                parseOK = true;
                scope.parseOK = parseOK;
                scope.parseError = "parse OK";
            }
            catch (e) {
                //console.log("Error");
                //console.log(e);
                //indicate parsing failed
                parseOK = false;
                scope.parseOK = parseOK;
                if (e.hasOwnProperty("message")){
                    //console.log("getting the message: ", e["message"]);
                    scope.parseError = e["message"].toLowerCase();
                }else{
                    //console.log("writing no matter what");
                    scope.parseError = "Unknown parse Error";
                }
            }      
            $compile(canvas)(scope);
            element.append(canvas);
            //reposition player because something breaks on the default
            if(player !== null && player !== undefined){
                //console.log("player created: ", player);
                player.fullReset(); //this is what makes the repaint correct
                playerCanvas = element.find(".vextab-player");
                scoreCanvas =  element.find(".vex-canvas");
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
  

guitarDemo.directive('fretboardPaper', ['$compile', function($compile) {
    //console.log("starting fretboard paper");
    //var canvas = document.createElement('canvas');
    //canvas.className = "fretboard-canvas";
    var fretboard = null;
    //var ps  = null;
    var sel = "#fretboardDiv";
    var containerSel = "#fretboardContainer";

    function link(scope, element, attrs) {
        //update parent things:
        scope.fretboard = fretboard;
        var fretboardLevel;
        
        function updateFretboard() {
            //console.log("updating fretboard");
            //console.log(fretboardLevel);
            try {
                //console.log("parsing!");
                //OK, this is the cannon to a fly way:
                //erase element
                $(containerSel).empty();
                if(fretboardLevel !== null && fretboardLevel !== undefined && fretboardLevel != 'undefined' && fretboardLevel.length >1 ){
                    //recreate the element
                    var ne = angular.element('<div id="fretboardDiv"></div>');
                    ne.text(fretboardLevel);
                    //binding and appending
                    $compile(ne)(scope);
                    $(containerSel).append(ne);
                    //add element
                    //now use the FretboardDiv as it is
                    fretboard = new Vex.Flow.FretboardDiv(sel);
                    fretboard.build(fretboardLevel);
                }
                //recompile for showing it
                $compile($(sel))(scope);
            }
            catch (e) {
                console.log("Error");
                console.log(e);
            }      
            //$compile(canvas)(scope);
            //element.append(canvas);
            //reposition player because something breaks on the default
            /*if(fretboard !== null && fretboard !== undefined){
                //TODO
                var el = $(sel);
                //console.log("everything is new here: ", el);
                $compile(el)(scope);
            }*/
        }

        scope.$watch(attrs.fretboardPaper, function(value) {
            //console.log("changing fretboard text to: ", value);
            fretboardLevel = value;
            updateFretboard();
        });

    }

    return {
        transclude:true,
        link: link
    };
  }]);
  
