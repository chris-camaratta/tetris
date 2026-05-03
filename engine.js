Math.factorial = function(num) {
  return (num) ? num * Math.factorial(num-1) : 1;
};

$(function() {
  var MappedKey = function(id, name, repeat) {
    this.id = id;
    this.name = name;
    this.repeat = repeat;
  };
  var Controls = function(context) {
    var $context = $(context + " #controls");
    // <input id="speech-input-field" type="text" x-webkit-speech /> // huh. fancy.
    var template = "<dt></dt><dd><input type=\"text\"/></dd>";

    this.keys = {
      QUIT:  new MappedKey( 0, "End Game",     0), // undefined
      HOLD:  new MappedKey(72, "Hold",         0), // 'h'
      CW:    new MappedKey( 9, "Rotate CW",  200), // tab
      CCW:   new MappedKey(38, "Rotate CCW", 200), // up
      DROP:  new MappedKey(32, "Hard Drop",  200), // space
      FLIP:  new MappedKey(70, "Flip",         0), // 'F'
      DOWN:  new MappedKey(40, "Soft Drop",  100), // down
      PAUSE: new MappedKey(27, "Pause Game",   0), // esc
      RIGHT: new MappedKey(39, "Move Right", 150), // right
      LEFT:  new MappedKey(37, "Move Left",  150)  // left
    };

    function keyUpHandler(key, keys) {
      return function(ev) {
        var id = ev.which;
console.log(id);
        $(this).val(getDisplayName(id)).blur();
        keys[key].id = id;
      };
    };

    function getDisplayName(keyid) {
      var value = String.fromCharCode(keyid);

      switch (keyid) {
        case 8: value = "backspace"; break; //  backspace
        case 9: value = "tab"; break; //  tab
        case 13: value = "enter"; break; //  enter
        case 16: value = "shift"; break; //  shift
        case 17: value = "ctrl"; break; //  ctrl
        case 18: value = "alt"; break; //  alt
        case 19: value = "pause/break"; break; //  pause/break
        case 20: value = "caps lock"; break; //  caps lock
        case 27: value = "escape"; break; //  escape
        case 32: value = "spacebar"; break; // spacebar, to avoid displaying empty space and confusing people          
        case 33: value = "page up"; break; // page up, to avoid displaying alternate character and confusing people          
        case 34: value = "page down"; break; // page down
        case 35: value = "end"; break; // end
        case 36: value = "home"; break; // home
        case 37: value = "left arrow"; break; // left arrow
        case 38: value = "up arrow"; break; // up arrow
        case 39: value = "right arrow"; break; // right arrow
        case 40: value = "down arrow"; break; // down arrow
        case 45: value = "insert"; break; // insert
        case 46: value = "delete"; break; // delete
        case 91: value = "left window"; break; // left window
        case 92: value = "right window"; break; // right window
        case 93: value = "select key"; break; // select key
        case 96: value = "numpad 0"; break; // numpad 0
        case 97: value = "numpad 1"; break; // numpad 1
        case 98: value = "numpad 2"; break; // numpad 2
        case 99: value = "numpad 3"; break; // numpad 3
        case 100: value = "numpad 4"; break; // numpad 4
        case 101: value = "numpad 5"; break; // numpad 5
        case 102: value = "numpad 6"; break; // numpad 6
        case 103: value = "numpad 7"; break; // numpad 7
        case 104: value = "numpad 8"; break; // numpad 8
        case 105: value = "numpad 9"; break; // numpad 9
        case 106: value = "multiply"; break; // multiply
        case 107: value = "add"; break; // add
        case 109: value = "subtract"; break; // subtract
        case 110: value = "decimal point"; break; // decimal point
        case 111: value = "divide"; break; // divide
        case 112: value = "F1"; break; // F1
        case 113: value = "F2"; break; // F2
        case 114: value = "F3"; break; // F3
        case 115: value = "F4"; break; // F4
        case 116: value = "F5"; break; // F5
        case 117: value = "F6"; break; // F6
        case 118: value = "F7"; break; // F7
        case 119: value = "F8"; break; // F8
        case 120: value = "F9"; break; // F9
        case 121: value = "F10"; break; // F10
        case 122: value = "F11"; break; // F11
        case 123: value = "F12"; break; // F12
        case 144: value = "num lock"; break; // num lock
        case 145: value = "scroll lock"; break; // scroll lock
        case 186: value = ";"; break; // semi-colon
        case 187: value = "="; break; // equal-sign
        case 188: value = ","; break; // comma
        case 189: value = "-"; break; // dash
        case 190: value = "."; break; // period
        case 191: value = "/"; break; // forward slash
        case 192: value = "`"; break; // grave accent
        case 219: value = "["; break; // open bracket
        case 220: value = "\\"; break; // back slash
        case 221: value = "]"; break; // close bracket
        case 222: value = "'"; break; // single quote
      }
      return value;
    };

    function initialize(o) {
      for (key in o.keys) {
        var $li = $(template);
        var t = $($li[0]).text(o.keys[key].name);
        var i = $("input", $li)
          .attr("name", key)
          .val(getDisplayName(o.keys[key].id))
          .focus(function() {
            $(this).val("");
          })
          .keyup(new keyUpHandler(key, o.keys));
        $context.prepend($li);
      };
    };

    initialize(this);
  };

  var GeneralSetting = function(name, defaultvalue, min, max, controltype, callback) {
    this.name = name;
    this.value = defaultvalue;
    this.minValue = min;
    this.maxValue = max;
    this.controltype = controltype;
    this.callback = callback;
  };
  var GeneralSettings = function(context) {
    this.startLevel = 1;
    this.cols = 10;
    this.rows = 20;

    var $context = $(context + " #generalsettings");
    var template = "<dt></dt><dd><input></dd>";
    var instance = this;

    this.onRowsChanged = new ClassEvent();
    this.onColsChanged = new ClassEvent();
    this.onLevelChanged = new ClassEvent();
    this.onStartClicked = new ClassEvent();

    var levelChanged = function() {
      instance.startLevel = $(this).val();
      instance.onLevelChanged.fire();
    };
    var colsChanged =  function() {
      instance.cols = $(this).val();
      instance.onColsChanged.fire();
    };
    var rowsChanged =  function() {
      instance.rows = $(this).val();
      instance.onRowsChanged.fire();
    };
    var startClicked = function() {
      instance.onStartClicked.fire();
    };

    this.gamesettings = {
      LEVEL:   new GeneralSetting("Start Level",   1,  1, 15, "text", levelChanged),
      COLS:    new GeneralSetting("Columns",      10,  5, 20, "text", colsChanged),
      ROWS:    new GeneralSetting("Rows",         20,  5, 40, "text", rowsChanged),
      START:   new GeneralSetting("",   "Start Game", "", "", "button", startClicked)
    };

    function initialize(o) {
      for (key in o.gamesettings) {
        var $li = $(template);
        var s = o.gamesettings[key];
        var bindto = (s.controltype == "text") ? "blur" : "click";
        var title = $($li[0]).text(s.name);
        var i = $("input", $li)
          .attr("name", key)
          .val(s.value)
          .bind(bindto, s.callback);
        i[0].type = s.controltype;
        if (s.controltype == "text")
          i.increment({
            minVal: s.minValue,
            maxVal: s.maxValue
          });
        $context.append($li);
      };
    };

    initialize(this);
  };

  var Settings = function(context) {
    this.controls = new Controls(context);
    this.generalSettings = new GeneralSettings(context);
  };

  var Shape = function(id, grid, color) {
    this.id = id;
    this.grid = grid;
    this.color = color;
  };

  var ShapeType = {
    Shapes: ["CUBE", "LINE", "ELBOW1", "ELBOW2", "ZIGZAG1", "ZIGZAG2", "TEE",],
    CUBE:    function() { return new Shape(0, [[1,1],[1,1]],     "yellow"); },
    LINE:    function() { return new Shape(1, [[1,1,1,1]],       "red"); },
    ELBOW1:  function() { return new Shape(2, [[1,1,1],[1,0,0]], "blue"); },
    ELBOW2:  function() { return new Shape(3, [[1,0,0],[1,1,1]], "BlueViolet"); },
    ZIGZAG1: function() { return new Shape(4, [[1,1,0],[0,1,1]], "green"); },
    ZIGZAG2: function() { return new Shape(5, [[0,1,1],[1,1,0]], "RosyBrown"); },
    TEE:     function() { return new Shape(6, [[0,1,0],[1,1,1]], "orange"); }
  };

  var PieceStorage = function() {
    this.id = 0;
    this.previewGrid = 0;
    this.storedShapeType = 0;
    var turnUsed = false;

    this.store = function(activeShape) {
      if (!turnUsed) {
        var id = activeShape.container.id;
        var tmp = this.storedShapeType;
        this.id = id;
        this.storedShapeType = ShapeType[ShapeType.Shapes[this.id]]();
        this.updatePreview();
        turnUsed = true;
        activeShape.empty();
        return tmp;
      }
      else {
        throw "Turn used."; // this seems inelegant.
      }
    };
    this.updatePreview = function() {
      if (this.previewGrid) {
        this.previewGrid.clearAllRows()
        this.activePiece = new ActivePiece(this.previewGrid, this.storedShapeType);
      }
    };
    this.handleActivePieceReachedBottom = function() {
      turnUsed = false;
    };
  };

  var ShapeGenerator = function() { this.initialize(); };
  ShapeGenerator.prototype = {
    id: 0,
    previewGrid: 0,
    activePiece: 0,
    nextShape: 0,
    getRandomNumber: 0,
    getNextShape: function() {
      this.id = Math.floor(this.getRandomNumber(ShapeType.Shapes.length) * ShapeType.Shapes.length);
      return ShapeType[ShapeType.Shapes[this.id]]();
    },
    getShape: function() {
      var tmp = this.nextShape;
      this.nextShape = this.getNextShape();
      this.updatePreview();
      return tmp;
    },
    updatePreview: function() {
      if (this.previewGrid) {
        this.previewGrid.clearAllRows();
        this.activePiece = new ActivePiece(this.previewGrid, this.nextShape);
      }
    },
    initialize: function() {
      this.getRandomNumber = // new Alea().fract53;
      function grn (max) {
        const min = 0;
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        let randomNumber = randomBuffer[0] / (0xffffffff + 1);
    
        return randomNumber;
      }
      this.nextShape = this.getNextShape();
    }
  };

  var ClassEvent = function() { this.handlers = []; };
  ClassEvent.prototype = {
    firedCount: 0,
    handlersCount: 0,
    add: function(item) {
      this.handlers[this.handlers.length] = item;
      this.handlersCount++;
    },
    clear: function() {
      this.handlers.length = 0;
    },
    fire: function() {
      this.firedCount++;
      for (var i = 0; i < this.handlers.length; i++) {
        var handler = this.handlers[i];
        var handlerType = typeof(handler);
        switch (handlerType) {
          case "string":
            eval(handler);
            break;
          case "function":
            handler();
            break;
        }
      }
    },
    hasFired: function() {
      return this.firedCount > 0;
    }
  };

  var ActivePiece = function(gameArea, shape, keys) {
    this.onBottomReached = new ClassEvent();
    this.onNoMoreMoves = new ClassEvent();
    this.blocks = [];
    this.initialize(gameArea, shape);
    this.keys = keys;
  };
  ActivePiece.id = 0;
  ActivePiece.prototype = {
    posX: 0,
    posY: 0,
    width: 1,
    height: 4,
    gameArea: 0,
    container: 0,
    move: function(direction) {
      if (!this.keyIsHandled(direction)) return;
      var oldX = this.posX;
      var oldY = this.posY;
      switch (direction) {
        case this.keys.LEFT.id:
          this.posX--;
          break;
        case this.keys.CCW.id:
          this.rotateCounterClockwise();
          break;
        case this.keys.CW.id:
          this.rotateClockwise();
          break;
        case this.keys.FLIP.id:
          this.flip();
          break;
        case this.keys.RIGHT.id:
          this.posX++;
          break;
        case this.keys.DOWN.id:
          this.posY++;
          break;
        case this.keys.DROP.id:
          this.drop();
          return;
        default:
      }
      if (this.testPositionIsValid())
        this.draw();
      else if (direction == this.keys.DOWN.id && oldY == 0)
        this.noMoreMoves();
      else {
        this.posX = oldX;
        this.posY = oldY;
        if (this.keys.DOWN.id == direction)
          this.bottomReached();
      }
    },
    empty: function() {
      for (var x = 0; x < this.width; x++)
        for (var y = 0; y < this.height; y++)
          if (this.container.grid[x][y]) {
            this.container.grid[x][y].empty();
          }
    },
    keyIsHandled: function(key) {
      switch (key) {
        case this.keys.DOWN.id:
        case this.keys.DROP.id:
        case this.keys.LEFT.id:
        case this.keys.RIGHT.id:
        case this.keys.CCW.id:
        case this.keys.CW.id:
        case this.keys.FLIP.id:
          return true;
      }
      return false;
    },
    noMoreMoves: function() {
      this.onNoMoreMoves.fire();
      this.onNoMoreMoves.clear();
    },
    bottomReached: function() {
      for (var x = 0; x < this.width; x++)
        for (var y = 0; y < this.height; y++)
          if (this.container.grid[x][y])
            this.container.grid[x][y].setIsActive(false);
      this.onBottomReached.fire();
      this.onBottomReached.clear();
    },
    testPositionIsValid: function() {
      // check that we're in the playing area
      if ( (this.posX < 0) ||
           (this.posX > (this.gameArea.width - this.width)) ||
           (this.posY > (this.gameArea.height - this.height)) )
        return false;
      // now check if there's anyone blocking us
      for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
          var locX = this.posX + x, locY = this.posY + y;
          if (this.container.grid[x][y]) {
            var b = false;
            if (b = this.gameArea.grid[locX][locY].isOccupied) {
              if (b.pieceId != ActivePiece.id) {
                return false;
              }
            }
          }
        }
      }
      return true;
    },
    containsBlock: function(block) {
      if (!block)
        return false;
      for (var x = 0; x < this.width; x++) {
        if (block in this.container.grid[x])
          return true;
      }
      return false;
    },
    rotateClockwise: function() {
      this.doRotate(function(x, y, endX, endY, src, trg) {
        if (x == 0) {
          trg[endY - y - 1] = [];
        }
        trg[endY - y - 1][x] = src[x][y];
      });
    },
    rotateCounterClockwise: function() {
      this.doRotate(function(x, y, endX, endY, src, trg) {
        if (x == 0) {
          trg[y] = [];
        }
        trg[y][endX - x - 1] = src[x][y];
      });
    },
    doRotate: function(func) {
      var tmp = [];
      var endX = this.width;
      var endY = this.height;
      for (var x = 0; x < endX; x++) {
        for (var y = 0; y < endY; y++) {
          func(x, y, endX, endY, this.container.grid, tmp);
        }
      }
      this.container.grid = tmp;
      this.height = endX;
      this.width = endY;
      // because of the rotation we might be past the board playing area. Compensate.
      if (this.posX + this.width > this.gameArea.width)
        this.posX = this.gameArea.width - this.width;
    },
    flip: function() {
      var tmp = [];
      var endX = this.container.grid.length;
      var endY = this.container.grid[0].length;
      for (var x = 0; x < endX; x++) {
        tmp[x] = [];
        for (var y = 0; y < endY; y++) {
          tmp[x][y] = this.container.grid[endX - x - 1][y];
        }
      }
      this.container.grid = tmp;
    },
    drop: function() {
      do {
        this.posY++;
      } while (this.testPositionIsValid());
      this.posY--; // the last position we test is actually bad
      this.draw();
      this.bottomReached();
    },
    draw: function() {
      for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
          var locX = this.posX + x, locY = this.posY + y;
          if (this.container.grid[x][y]) {
            this.container.grid[x][y].moveTo(this.gameArea.grid[locX][locY]);
          }
        }
      }
    },
    initialize: function(gameArea, shape) {
      ActivePiece.id++;
      this.blocks = [];
      this.gameArea = gameArea;
      this.container = shape;
      this.width = this.container.grid.length;
      this.height = this.container.grid[0].length;
      this.posX = Math.floor(((this.gameArea.width-1) / 2) - ((this.width-1) / 2));
      this.posY = 0;
      for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
          if (this.container.grid[x][y]) {
            var block = new Block(this.gameArea.blockHeight, this.gameArea.blockWidth, y, x, this.container.color);
            block.pieceId = ActivePiece.id;
            this.blocks[this.blocks.length] = block;
            this.container.grid[x][y] = block;
          }
        }
      }
      this.draw();
    }
  };

  var Square = function(height, width, offsetHeight, offsetWidth, animate) { this.initialize(height, width, offsetHeight, offsetWidth, animate); };
  Square.prototype = {
    elem: 0,
    isOccupied: false,
    animate: false,
    onEmptyAnimateComplete: 0,
    fill: function(block) {
      this.elem.append(block.elem);
      this.isOccupied = block;
    },
    empty: function(block) {
      if (this.isOccupied == block) {
        block.elem.detach();
        this.isOccupied = false;
      }
      else if (typeof(block) == "undefined") {
        if (this.isOccupied) {
          if (this.animate)
            this.isOccupied.elem.fadeOut("fast", this.emptyAnimateComplete);
          else
            this.emptyAnimateComplete();
          this.isOccupied = false;
        }
      }
    },
    emptyAnimateComplete: function() {
      this.elem.empty();
    },
    draw: function() {
      this.elem.css({
        border: "1px solid white",
        background: this.color
      });
    },
    initialize: function(height, width, offsetHeight, offsetWidth, animate) {
      this.elem = $("<div class='gameSquare'></div>");
      this.height = height;
      this.width = width;
      this.offsetHeight = offsetHeight;
      this.offsetWidth = offsetWidth;
      if (typeof(animate) != "undefined")
        this.animate = animate;
      this.elem.css({
        height: this.height,
        width: this.width,
        marginTop: (this.offsetHeight * this.height) + "px",
        marginLeft: (this.offsetWidth * this.width) + "px"
      });
    }
  };

  var Block = function(height, width, offsetY, offsetX, color) { this.initialize(height, width, offsetY, offsetX, color); };
  Block.prototype = {
    elem: 0,
    color: 0,
    currentSquare: 0,
    pieceId: 0,
    isActive: true,
    setIsActive: function(flag) {
      this.isActive = flag;
      if ( !flag ) this.elem.css("opacity", 0.6);
    },
    moveTo: function(square) {
      if (this.currentSquare) {
        this.currentSquare.empty(this);
      }
      square.fill(this);
      this.currentSquare = square;
    },
    empty: function() {
      isActive = false;
      this.currentSquare.empty();
    },
    initialize: function(height, width, offsetY, offsetX, color) {
      this.elem = $("<div class='gameBlock'></div>");
      this.height = height;
      this.width = width;
      this.offsetY = offsetY;
      this.offsetX = offsetX;
      this.color = color;
      this.elem.css({
        height: this.height - 4,
        width: this.width - 4,
        background: this.color,
        borderColor: this.color
      });
    }
  };

  var GameGrid = function(rows, cols, anchorId, animate) {
    this.grid = [];
    this.height = rows;
    this.width = cols;
    this.gameArea = $(anchorId);
    if (typeof(animate) != "undefined")
      this.animate = animate;
    this.initialize()
  };
  GameGrid.prototype = {
    blockHeight: 40,
    blockWidth: 40,
    draw: function() {},
    clearAllRows: function() {
      for (var x = 0; x < this.width; x++)
        for (var y = 0; y < this.height; y++)
          this.grid[x][y].empty();
    },
    clearFullRows: function() {
      var cleared = [];
      var oThis = this;
      var isFull = function(y) {
        for (var x = 0; x < oThis.width; x++) {
          if (!oThis.grid[x][y].isOccupied)
            return false;
        }
        return true;
      };
      var clearRow = function(y) {
        for (var x = 0; x < oThis.width; x++) {
          oThis.grid[x][y].empty();
        }
      };
      var dropRows = function() {
        var a = 0;
        for (var y = cleared[0]; y >= 0; y--)
          if (cleared[a] == y) a++
          else
            for (var x = 0; x < oThis.width; x++)
              if (oThis.grid[x][y].isOccupied)
                oThis.grid[x][y].isOccupied.moveTo(oThis.grid[x][y+a]);
      };
      for (var y = this.height-1; y >= 0; y--) {
        if (isFull(y)) {
          clearRow(y);
          cleared[cleared.length] = y;
        }
      }

      if (cleared.length > 0) dropRows();
      return cleared.length;
    },
    initialize: function() {
      this.gameArea.css({
        height: (this.height * this.blockHeight) + "px",
        width: (this.width * this.blockWidth) + "px"
      });
      for (var x = 0; x < this.width; x++) {
        this.grid[x] = [];
        for (var y = 0; y < this.height; y++) {
          var square = new Square(this.blockHeight, this.blockWidth, y, x, this.animate);
          this.grid[x][y] = square;
          this.gameArea.append(this.grid[x][y].elem);
        }
      }
    },
    teardown: function() {
      this.clearAllRows();
      this.gameArea.empty();
    }
  };

  var Timer = function() {};
  Timer.prototype = {
    intervalMs: 1000,
    timerIsActive: false,
    events: [],
    clock: 0,
    addTimerAction: function(action) {
      this.events[this.events.length] = action;
    },
    handleTimer: function() {
      for (var i = 0; i < this.events.length; i++) {
        try {
          this.events[i].onTimerAction();
        }
        catch(ex) { }
      }
    },
    setIntervalMs: function(intervalMs) {
      this.intervalMs = intervalMs;
      if (this.timerIsActive) {
        this.stop();
        this.start();
      }
    },
    toggle: function() {
      if (this.timerIsActive)
        this.stop();
      else
        this.start();
    },
    start: function() {
      if (!this.timerIsActive) {
        this.timerIsActive = true;
        var oThis = this;
        this.clock = setInterval(function() {oThis.handleTimer();}, this.intervalMs);
        return true;
      }
      else {
        return false;
      }
    },
    stop: function() {
      this.timerIsActive = false;
      clearInterval(this.clock);
    }
  };

  var ScoreBoard = function(id){ this.initialize(id) };
  ScoreBoard.MaxLevel = 15;
  ScoreBoard.MinLevel = 1;
  ScoreBoard.prototype = {
    level: ScoreBoard.MinLevel,
    levelthreshold: [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150],
    score: 0,
    lines: 0,
    elem: 0,
    levelElem: 0,
    scoreElem: 0,
    linesElem: 0,
    updateScore: function(rowsCleared) {
      if (rowsCleared > 0) {
        this.lines += rowsCleared;
        this.score += (Math.factorial(rowsCleared) * 100);

        var lbound = this.levelthreshold[this.level - 1];
        var ubound = this.levelthreshold[this.levelthreshold.length - 1];
        if ( this.lines >= lbound &&
             this.lines < ubound )
        {
          this.increaseLevel();
        }

        this.updateScoreboard();
      }
    },
    onLevelIncreased: 0,
    increaseLevel:function() {
        this.level++;
        this.onLevelIncreased.fire();
    },
    setLevel: function(level) {
      this.level = level;
      this.updateScoreboard();
    },
    updateScoreboard: function() {
      this.levelElem.text(this.level);
      this.scoreElem.text(this.score);
      this.linesElem.text(this.lines);
    },
    initialize: function(scoreboardId) {
      this.onLevelIncreased = new ClassEvent();
      this.elem = $(scoreboardId);
      this.levelElem = $("<dd></dd>");
      this.scoreElem = $("<dd></dd>");
      this.linesElem = $("<dd></dd>");
      var level = $("<dl><dt>Level</dt></dl>");
      var score = $("<dl><dt>Score</dt></dl>");
      var lines = $("<dl><dt>Lines</dt></dl>");

      level.append(this.levelElem);
      score.append(this.scoreElem);
      lines.append(this.linesElem);

      this.elem
        .append(level)
        .append(score)
        .append(lines);

        this.updateScoreboard();
    }
  };

  var StatsTracker = function(id) { this.initialize(id); };
  StatsTracker.prototype = {
    elem: 0,
    elemHeight: 0,
    trackers: 0,
    stats: 0,
    count: 0,
    max: 0,
    padding: 5,
    updateStats: function(shape) {
      this.stats[shape.id]++;
      this.count++;

      for (x = 0; x < ShapeType.Shapes.length; x++) {
        // var elemHeight = (this.stats[x] / this.count) * 100; // % height
        if (this.stats[x] > this.max) this.max = this.stats[x]; // top x height
        var elemHeight = (this.max < this.elemHeight) ? this.stats[x] : this.stats[x] + (this.elemHeight - this.max);

        this.trackers[x]
          .css("height", elemHeight + "px");
      }
    },
    initialize: function(id) {
      this.trackers = [];
      this.stats = [];
      this.elem = $(id);
      this.elemHeight = this.elem.height() - this.padding;
      var elemWidth = this.elem.width();

      // jquery/chrome bug. manually set height.
      if (this.elemHeight < 0) {
        this.elemHeight = 95;
        elemWidth = 200;
        console.warn  ("Scoreboard height < 0; defaulting value.");
      }

      var dataElem = $("<dl></dl>");
      var shapeCount = ShapeType.Shapes.length;
      var barMargin = Math.floor( elemWidth / shapeCount );
      var barWidth = Math.floor( barMargin / 3 * 2 );

      for (x = 0; x < ShapeType.Shapes.length; x++) {
        var shape = ShapeType[ShapeType.Shapes[x]]();
        var elem = $("<dd></dd>");
        elem.css({
          "background": shape.color,
          "width": barWidth + "px",
          "left": ((x * barMargin) + this.padding) + "px"
        });
        dataElem.append(elem);
        this.stats[x] = 0;
        this.trackers[x] = elem;
      }
      this.elem.empty().append(dataElem);
    }
  };

  var KeyboardHandler = function(keys, keyPressHandler) {
    var timers = {};

    function keyIsHandled(key) {
      for (x in keys)
        if (key == keys[x].id)
          return keys[x];
      return false;
    };

    function keyDown(ev) {
      var keycode = ev.which;
      var key = 0;
      if ((key = keyIsHandled(keycode)) && !(keycode in timers) ) {
        timers[keycode] = null;
        if (keyPressHandler != 0) {
          keyPressHandler(keycode);
          var repeat = key.repeat;
          if (0 < repeat)
            timers[keycode] = setInterval(function() { keyPressHandler(keycode); }, repeat);
        }
        return false;
      }
    };

    function keyUp(ev) {
      var keycode = ev.which;
      if (keycode in timers) {
        cancelTimer(keycode);
      }
    };

    this.cancelAllTimers = function () {
      for (keycode in timers)
        cancelTimer(keycode);
      timers= {};
    };

    function cancelTimer(keycode) {
      if (timers[keycode] != null)
        clearInterval(timers[keycode]);
      delete timers[keycode];
    };

    $(document).keydown(keyDown);
    $(document).keyup(keyUp);
    $(window).blur(this.cancelAllTimers);
  };

  var Engine = function() { this.initialize(); };
  Engine.instance = 0;
  Engine.prototype = {
    settings: 0,
    timer: 0,
    shapeGenerator: 0,
    pieceStorage: 0,
    gameArea: 0,
    nextArea: 0,
    holdArea: 0,
    scoreboard: 0,
    statsTracker: 0,
    activePiece: 0,
    paused: false,
    running: false,

    createNewPiece: function() {
      Engine.instance.createPiece(Engine.instance.shapeGenerator.getShape());
    },
    createPiece: function(shapeType) {
      Engine.instance.activePiece = new ActivePiece(Engine.instance.gameArea, shapeType, Engine.instance.settings.controls.keys);
      Engine.instance.activePiece.onBottomReached.add(Engine.instance.handleActivePieceReachedBottom);
      Engine.instance.activePiece.onBottomReached.add(Engine.instance.pieceStorage.handleActivePieceReachedBottom);
      Engine.instance.activePiece.onNoMoreMoves.add(Engine.instance.handleNoMoreMoves);
      Engine.instance.statsTracker.updateStats(Engine.instance.activePiece.container);
    },
    handleActivePieceReachedBottom: function() {
      Engine.instance.createNewPiece();
      var rowsCleared = Engine.instance.gameArea.clearFullRows();
      Engine.instance.scoreboard.updateScore(rowsCleared);
    },
    handleLevelChanged: function() {
      var sb = Engine.instance.scoreboard;
      var mintimeout = 100;
      var maxtimeout = 1000;
      var asymptote = (ScoreBoard.MaxLevel / -sb.level) + (ScoreBoard.MaxLevel - 0.5);
      var intervalMs = maxtimeout * (ScoreBoard.MaxLevel - asymptote) / ScoreBoard.MaxLevel;
      // var intervalMs = mintimeout + ((maxtimeout - mintimeout) * (ScoreBoard.MaxLevel - sb.level) / (ScoreBoard.MaxLevel - 1));

      if (Engine.instance)
        Engine.instance.timer.setIntervalMs(intervalMs);
    },
    handleNoMoreMoves: function() {
      Engine.instance.timer.stop();
      Engine.instance.keyboardHandler.cancelAllTimers();
      alert("Game Over!\n(yea, this is a lame ending...)");
      $(document).unbind("keydown");
    },
    run: function() {
      var e = Engine.instance;
      if (!e.running) {
        e.gameArea.teardown();
        e.gameArea = new GameGrid(e.settings.generalSettings.rows, e.settings.generalSettings.cols, "#gamearea");

        e.createNewPiece();
        e.timer.start();
        e.running = true;
      }
    },
    onTimerAction: function() {
      this.activePiece.move(Engine.instance.settings.controls.keys.DOWN.id);
    },
    onKeyPress: function(keyId) {
      var keys = Engine.instance.settings.controls.keys;
      if (keyId == keys.PAUSE.id) {
        Engine.instance.paused = !Engine.instance.paused;
        Engine.instance.timer.toggle();
        $("#pauseoverlay").toggle();
      }
      else if (Engine.instance.paused)
        return;
      else if (keyId == keys.HOLD.id) {
        var tmp = 0;
        try {
          if (0 == (tmp = Engine.instance.pieceStorage.store(Engine.instance.activePiece)))
            Engine.instance.createNewPiece();
          else
            Engine.instance.createPiece(tmp);
        }
        catch (ex) {}
      }
      else if (Engine.instance.activePiece) {
        Engine.instance.activePiece.move(keyId);
      }
    },
    initialize: function() {
      Engine.instance = this;
      this.gameArea = new GameGrid(20, 10, "#gamearea");
      this.nextArea = new GameGrid(4,4, "#nextgrid");
      this.holdArea = new GameGrid(4,4, "#holdgrid");
      this.scoreboard = new ScoreBoard("#scoreboard");
      this.statsTracker = new StatsTracker("#statistics");
      this.settings = new Settings("#settingsarea");
      this.pieceStorage = new PieceStorage();
      this.shapeGenerator = new ShapeGenerator();
      this.keyboardHandler = new KeyboardHandler(
        Engine.instance.settings.controls.keys,
        Engine.instance.onKeyPress);
      this.timer = new Timer();

      this.scoreboard.onLevelIncreased.add(Engine.instance.handleLevelChanged);
      this.pieceStorage.previewGrid = this.holdArea;
      this.shapeGenerator.previewGrid = this.nextArea;
      this.timer.addTimerAction(this);

      this.settings.generalSettings.onStartClicked.add(Engine.instance.run);
      this.settings.generalSettings.onLevelChanged.add(function() {
        Engine.instance.scoreboard.setLevel(Engine.instance.settings.generalSettings.startLevel);
        Engine.instance.handleLevelChanged();
      });
      // set default timer based on default starting level.
      Engine.instance.handleLevelChanged();
    }
  };

var e = new Engine();
/*
function testScoreboard() {
  // var a = new ScoreBoard("#scoreboard");
  // var t = new Timer();
  var a = e.scoreboard;
  var t = e.timer;
  var i = 0;
  var getRandomNumber = new Alea();

  a.onLevelIncreased.add(function() { 
    console.log("level increased");
  });

  this.onTimerAction = function() {
    var r = getRandomNumber();
    var r4 = r*4;
    var lines = Math.floor(r4)
    a.updateScore(lines);
    i++;
    if (i > 500) t.stop();
  };
  this.run = function() {
    t.intervalMs = 10;
    t.addTimerAction(this);
    t.start();
  };
};
new testScoreboard().run();
*/
/*
function testShapeGenerator() {
  // var a = new ShapeGenerator();
  // var b = new StatsTracker("#statistics");
  var t = new Timer();
  var a = e.shapeGenerator;
  // var t = e.timer; // binding to the timer engine slows the test way down since it's bound to the scoreboard
  var b = e.statsTracker;
  var i = 0;
  this.onTimerAction = function() {
    var shape = a.getShape();
    b.updateStats(shape);
    i++;
    if (i > 5000) {
      t.stop();
    }
    console.log(i);
  };
  this.run = function() {
    t.intervalMs = 1;
    t.addTimerAction(this);
    t.start();
  };
};
new testShapeGenerator().run();
// */
});

