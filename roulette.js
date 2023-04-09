function Winwheel(a, b) {
    defaultOptions = {
        canvasId: "canvas",
        centerX: null,
        centerY: null,
        outerRadius: null,
        innerRadius: 0,
        numSegments: 1,
        drawMode: "code",
        rotationAngle: 0,
        textFontFamily: "Arial",
        textFontSize: 20,
        textFontWeight: "bold",
        textOrientation: "horizontal",
        textAlignment: "center",
        textDirection: "normal",
        textMargin: null,
        textFillStyle: "black",
        textStrokeStyle: null,
        textLineWidth: 4,
        fillStyle: "white",
        strokeStyle: "white",
        lineWidth: 1,
        clearTheCanvas: true,
        imageOverlay: false,
        drawText: true,
        pointerAngle: 0,
        wheelImage: null,
        imageDirection: "N"};
    for (var c in defaultOptions) {
      this[c] = a != null && typeof a[c] !== "undefined" ? a[c] : defaultOptions[c];
    }
    if (a != null) {
      for (c in a) {
        if (typeof this[c] === "undefined") {
          this[c] = a[c];
        }
      }
    }
    if (this.canvasId) {
      if (this.canvas = document.getElementById(this.canvasId)) {
        if (this.centerX == null) {
          this.centerX = this.canvas.width / 2;
        }
        if (this.centerY == null) {
          this.centerY = this.canvas.height / 2;
        }
        if (this.outerRadius == null) {
          this.outerRadius = this.canvas.width < this.canvas.height ? this.canvas.width / 2 - this.lineWidth : this.canvas.height / 2 - this.lineWidth;
        }
        this.ctx = this.canvas.getContext("2d");
      } else {
        this.ctx = this.canvas = null;
      }
    } else {
      this.ctx = this.cavnas = null;
    }
    this.segments = Array(null);
    for (x = 1; x <= this.numSegments; x++) {
      this.segments[x] = a != null && a.segments && typeof a.segments[x - 1] !== "undefined" ? new Segment(a.segments[x - 1]) : new Segment;
    }
    this.updateSegmentSizes();
    if (this.textMargin === null) {
      this.textMargin = this.textFontSize / 1.7;
    }
    this.animation = a != null && a.animation && typeof a.animation !== "undefined" ? new Animation(a.animation) : new Animation;
    if (a != null && a.pins && typeof a.pins !== "undefined") {
      this.pins = new Pin(a.pins);
    }
    if (this.drawMode == "image" || this.drawMode == "segmentImage") {
      if (typeof a.fillStyle === "undefined") {
        this.fillStyle = null;
      }
      if (typeof a.strokeStyle === "undefined") {
        this.strokeStyle = "red";
      }
      if (typeof a.drawText === "undefined") {
        this.drawText = false;
      }
      if (typeof a.lineWidth === "undefined") {
        this.lineWidth = 1;
      }
      if (typeof b === "undefined") {
        b = false;
      }
    } else if (typeof b === "undefined") {
      b = true;
    }
    this.pointerGuide = a != null && a.pointerGuide && typeof a.pointerGuide !== "undefined" ? new PointerGuide(a.pointerGuide) : new PointerGuide;
    if (b == 1) {
      this.draw(this.clearTheCanvas);
    } else if (this.drawMode == "segmentImage") {
      winwheelToDrawDuringAnimation = this;
      winhweelAlreadyDrawn = false;
      for (y = 1; y <= this.numSegments; y++) {
        if (this.segments[y].image !== null) {
          this.segments[y].imgData = new Image;
          this.segments[y].imgData.onload = winwheelLoadedImage;
          this.segments[y].imgData.src = this.segments[y].image;
        }
      }
    }
  }
  Winwheel.prototype.updateSegmentSizes = function () {
    if (this.segments) {
      var a = 0;
      var b = 0;
      for (x = 1; x <= this.numSegments; x++) {
        if (this.segments[x].size !== null) {
          a += this.segments[x].size;
          b++;
        }
      }
      var c = 360 - a;
      var a = 0;
      if (0 < c) {
        a = c / (this.numSegments - b);
      }
      b = 0;
      for (x = 1; x <= this.numSegments; x++) {
        this.segments[x].startAngle = b;
        b = this.segments[x].size ? b + this.segments[x].size : b + a;
        this.segments[x].endAngle = b;
      }
    }
  };
  Winwheel.prototype.clearCanvas = function () {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };
  Winwheel.prototype.draw = function (a) {
    if (this.ctx) {
      if (typeof a === "undefined") {
        this.clearCanvas();
      } else if (a == 1) {
        this.clearCanvas();
      }
      if (this.drawMode == "image") {
        this.drawWheelImage();
        if (this.drawText == 1) {
          this.drawSegmentText();
        }
        if (this.imageOverlay == 1) {
          this.drawSegments();
        }
      } else if (this.drawMode == "segmentImage") {
        this.drawSegmentImages();
        if (this.drawText == 1) {
          this.drawSegmentText();
        }
        if (this.imageOverlay == 1) {
          this.drawSegments();
        }
      } else {
        this.drawSegments();
        if (this.drawText == 1) {
          this.drawSegmentText();
        }
      }
      if (typeof this.pins !== "undefined" && this.pins.visible == 1) {
        this.drawPins();
      }
      if (this.pointerGuide.display == 1) {
        this.drawPointerGuide();
      }
    }
  };
  Winwheel.prototype.drawPins = function () {
    if (this.pins && this.pins.number) {
      var a = 360 / this.pins.number;
      for (i = 1; i <= this.pins.number; i++) {
        this.ctx.save();
        this.ctx.strokeStyle = this.pins.strokeStyle;
        this.ctx.lineWidth = this.pins.lineWidth;
        this.ctx.fillStyle = this.pins.fillStyle;
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.degToRad(i * a + this.rotationAngle));
        this.ctx.translate(-this.centerX, -this.centerY);
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY - this.outerRadius + this.pins.outerRadius + this.pins.margin, this.pins.outerRadius, 0, 2 * Math.PI);
        if (this.pins.fillStyle) {
          this.ctx.fill();
        }
        if (this.pins.strokeStyle) {
          this.ctx.stroke();
        }
        this.ctx.restore();
      }
    }
  };
  Winwheel.prototype.drawPointerGuide = function () {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate(this.degToRad(this.pointerAngle));
      this.ctx.translate(-this.centerX, -this.centerY);
      this.ctx.strokeStyle = this.pointerGuide.strokeStyle;
      this.ctx.lineWidth = this.pointerGuide.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.lineTo(this.centerX, -(this.outerRadius / 4));
      this.ctx.stroke();
      this.ctx.restore();
    }
  };
  Winwheel.prototype.drawWheelImage = function () {
    if (this.wheelImage != null) {
      var a = this.centerX - this.wheelImage.height / 2;
      var b = this.centerY - this.wheelImage.width / 2;
      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate(this.degToRad(this.rotationAngle));
      this.ctx.translate(-this.centerX, -this.centerY);
      this.ctx.drawImage(this.wheelImage, a, b);
      this.ctx.restore();
    }
  };
  Winwheel.prototype.drawSegmentImages = function () {
    if (this.ctx && this.segments) {
      for (x = 1; x <= this.numSegments; x++) {
        seg = this.segments[x];
        if (seg.imgData.height) {
          var a;
          var b;
          var c;
          a = seg.imageDirection !== null ? seg.imageDirection : this.imageDirection;
          if (a == "S") {
            a = this.centerX - seg.imgData.width / 2;
            b = this.centerY;
            c = seg.startAngle + 180 + (seg.endAngle - seg.startAngle) / 2;
          } else if (a == "E") {
            a = this.centerX;
            b = this.centerY - seg.imgData.height / 2;
            c = seg.startAngle + 270 + (seg.endAngle - seg.startAngle) / 2;
          } else if (a == "W") {
            a = this.centerX - seg.imgData.width;
            b = this.centerY - seg.imgData.height / 2;
            c = seg.startAngle + 90 + (seg.endAngle - seg.startAngle) / 2;
          } else {
            a = this.centerX - seg.imgData.width / 2;
            b = this.centerY - seg.imgData.height;
            c = seg.startAngle + (seg.endAngle - seg.startAngle) / 2;
          }
          this.ctx.save();
          this.ctx.translate(this.centerX, this.centerY);
          this.ctx.rotate(this.degToRad(this.rotationAngle + c));
          this.ctx.translate(-this.centerX, -this.centerY);
          this.ctx.drawImage(seg.imgData, a, b);
          this.ctx.restore();
        } else {
          console.log("Segment " + x + " imgData is not loaded");
        }
      }
    }
  };
  Winwheel.prototype.drawSegments = function () {
    if (this.ctx && this.segments) {
      for (x = 1; x <= this.numSegments; x++) {
        seg = this.segments[x];
        var a;
        var b;
        a = seg.fillStyle !== null ? seg.fillStyle : this.fillStyle;
        this.ctx.fillStyle = a;
        this.ctx.lineWidth = seg.lineWidth !== null ? seg.lineWidth : this.lineWidth;
        b = seg.strokeStyle !== null ? seg.strokeStyle : this.strokeStyle;
        if ((this.ctx.strokeStyle = b) || a) {
          this.ctx.beginPath();
          if (!this.innerRadius) {
            this.ctx.moveTo(this.centerX, this.centerY);
          }
          this.ctx.arc(this.centerX, this.centerY, this.outerRadius, this.degToRad(seg.startAngle + this.rotationAngle - 90), this.degToRad(seg.endAngle + this.rotationAngle - 90), false);
          if (this.innerRadius) {
            this.ctx.arc(this.centerX, this.centerY, this.innerRadius, this.degToRad(seg.endAngle + this.rotationAngle - 90), this.degToRad(seg.startAngle + this.rotationAngle - 90), true);
          } else {
            this.ctx.lineTo(this.centerX, this.centerY);
          }
          if (a) {
            this.ctx.fill();
          }
          if (b) {
            this.ctx.stroke();
          }
        }
      }
    }
  };
  Winwheel.prototype.drawSegmentText = function () {
    if (this.ctx) {
      var a;
      var b;
      var c;
      var l;
      var e;
      var n;
      var f;
      var k;
      var m;
      var d;
      var g;
      for (x = 1; x <= this.numSegments; x++) {
        this.ctx.save();
        seg = this.segments[x];
        if (seg.text) {
          a = seg.textFontFamily !== null ? seg.textFontFamily : this.textFontFamily;
          b = seg.textFontSize !== null ? seg.textFontSize : this.textFontSize;
          c = seg.textFontWeight !== null ? seg.textFontWeight : this.textFontWeight;
          l = seg.textOrientation !== null ? seg.textOrientation : this.textOrientation;
          e = seg.textAlignment !== null ? seg.textAlignment : this.textAlignment;
          n = seg.textDirection !== null ? seg.textDirection : this.textDirection;
          f = seg.textMargin !== null ? seg.textMargin : this.textMargin;
          k = seg.textFillStyle !== null ? seg.textFillStyle : this.textFillStyle;
          m = seg.textStrokeStyle !== null ? seg.textStrokeStyle : this.textStrokeStyle;
          d = seg.textLineWidth !== null ? seg.textLineWidth : this.textLineWidth;
          g = "";
          if (c != null) {
            g += c + " ";
          }
          if (b != null) {
            g += b + "px ";
          }
          if (a != null) {
            g += a;
          }
          this.ctx.font = g;
          this.ctx.fillStyle = k;
          this.ctx.strokeStyle = m;
          this.ctx.lineWidth = d;
          a = seg.text.split("\n");
          c = 0 - a.length / 2 * b + b / 2;
          if (l == "curved" && (e == "inner" || e == "outer")) {
            c = 0;
          }
          for (i = 0; i < a.length; i++) {
            if (n == "reversed") {
              if (l == "horizontal") {
                this.ctx.textAlign = e == "inner" ? "right" : e == "outer" ? "left" : "center";
                this.ctx.textBaseline = "middle";
                d = this.degToRad(seg.endAngle - (seg.endAngle - seg.startAngle) / 2 + this.rotationAngle - 90 - 180);
                this.ctx.save();
                this.ctx.translate(this.centerX, this.centerY);
                this.ctx.rotate(d);
                this.ctx.translate(-this.centerX, -this.centerY);
                if (e == "inner") {
                  if (k) {
                    this.ctx.fillText(a[i], this.centerX - this.innerRadius - f, this.centerY + c);
                  }
                  if (m) {
                    this.ctx.strokeText(a[i], this.centerX - this.innerRadius - f, this.centerY + c);
                  }
                } else if (e == "outer") {
                  if (k) {
                    this.ctx.fillText(a[i], this.centerX - this.outerRadius + f, this.centerY + c);
                  }
                  if (m) {
                    this.ctx.strokeText(a[i], this.centerX - this.outerRadius + f, this.centerY + c);
                  }
                } else {
                  if (k) {
                    this.ctx.fillText(a[i], this.centerX - this.innerRadius - (this.outerRadius - this.innerRadius) / 2 - f, this.centerY + c);
                  }
                  if (m) {
                    this.ctx.strokeText(a[i], this.centerX - this.innerRadius - (this.outerRadius - this.innerRadius) / 2 - f, this.centerY + c);
                  }
                }
                this.ctx.restore();
              } else if (l == "vertical") {
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = e == "inner" ? "top" : e == "outer" ? "bottom" : "middle";
                d = seg.endAngle - (seg.endAngle - seg.startAngle) / 2 - 180;
                d += this.rotationAngle;
                this.ctx.save();
                this.ctx.translate(this.centerX, this.centerY);
                this.ctx.rotate(this.degToRad(d));
                this.ctx.translate(-this.centerX, -this.centerY);
                if (e == "outer") {
                  var h = this.centerY + this.outerRadius - f;
                } else if (e == "inner") {
                  h = this.centerY + this.innerRadius + f;
                }
                g = b - b / 9;
                if (e == "outer") {
                  for (d = a[i].length - 1; 0 <= d; d--) {
                    character = a[i].charAt(d);
                    if (k) {
                      this.ctx.fillText(character, this.centerX + c, h);
                    }
                    if (m) {
                      this.ctx.strokeText(character, this.centerX + c, h);
                    }
                    h -= g;
                  }
                } else if (e == "inner") {
                  for (d = 0; d < a[i].length; d++) {
                    character = a[i].charAt(d);
                    if (k) {
                      this.ctx.fillText(character, this.centerX + c, h);
                    }
                    if (m) {
                      this.ctx.strokeText(character, this.centerX + c, h);
                    }
                    h += g;
                  }
                } else if (e == "center") {
                  h = 0;
                  if (1 < a[i].length) {
                    h = g * (a[i].length - 1) / 2;
                  }
                  h = this.centerY + this.innerRadius + (this.outerRadius - this.innerRadius) / 2 + h + f;
                  for (d = a[i].length - 1; 0 <= d; d--) {
                    character = a[i].charAt(d);
                    if (k) {
                      this.ctx.fillText(character, this.centerX + c, h);
                    }
                    if (m) {
                      this.ctx.strokeText(character, this.centerX + c, h);
                    }
                    h -= g;
                  }
                }
                this.ctx.restore();
              } else if (l == "curved") {
                g = 0;
                if (e == "inner") {
                  g = this.innerRadius + f;
                  this.ctx.textBaseline = "top";
                } else if (e == "outer") {
                  g = this.outerRadius - f;
                  this.ctx.textBaseline = "bottom";
                  g -= b * (a.length - 1);
                } else if (e == "center") {
                  g = this.innerRadius + f + (this.outerRadius - this.innerRadius) / 2;
                  this.ctx.textBaseline = "middle";
                }
                var q = 0;
                var p;
                if (1 < a[i].length) {
                  this.ctx.textAlign = "left";
                  q = b / 10 * 4;
                  radiusPercent = 100 / g;
                  q *= radiusPercent;
                  totalArc = q * a[i].length;
                  p = seg.startAngle + ((seg.endAngle - seg.startAngle) / 2 - totalArc / 2);
                } else {
                  p = seg.startAngle + (seg.endAngle - seg.startAngle) / 2;
                  this.ctx.textAlign = "center";
                }
                p += this.rotationAngle;
                p -= 180;
                for (d = a[i].length; 0 <= d; d--) {
                  this.ctx.save();
                  character = a[i].charAt(d);
                  this.ctx.translate(this.centerX, this.centerY);
                  this.ctx.rotate(this.degToRad(p));
                  this.ctx.translate(-this.centerX, -this.centerY);
                  if (m) {
                    this.ctx.strokeText(character, this.centerX, this.centerY + g + c);
                  }
                  if (k) {
                    this.ctx.fillText(character, this.centerX, this.centerY + g + c);
                  }
                  p += q;
                  this.ctx.restore();
                }
              }
            } else if (l == "horizontal") {
              this.ctx.textAlign = e == "inner" ? "left" : e == "outer" ? "right" : "center";
              this.ctx.textBaseline = "middle";
              d = this.degToRad(seg.endAngle - (seg.endAngle - seg.startAngle) / 2 + this.rotationAngle - 90);
              this.ctx.save();
              this.ctx.translate(this.centerX, this.centerY);
              this.ctx.rotate(d);
              this.ctx.translate(-this.centerX, -this.centerY);
              if (e == "inner") {
                if (k) {
                  this.ctx.fillText(a[i], this.centerX + this.innerRadius + f, this.centerY + c);
                }
                if (m) {
                  this.ctx.strokeText(a[i], this.centerX + this.innerRadius + f, this.centerY + c);
                }
              } else if (e == "outer") {
                if (k) {
                  this.ctx.fillText(a[i], this.centerX + this.outerRadius - f, this.centerY + c);
                }
                if (m) {
                  this.ctx.strokeText(a[i], this.centerX + this.outerRadius - f, this.centerY + c);
                }
              } else {
                if (k) {
                  this.ctx.fillText(a[i], this.centerX + this.innerRadius + (this.outerRadius - this.innerRadius) / 2 + f, this.centerY + c);
                }
                if (m) {
                  this.ctx.strokeText(a[i], this.centerX + this.innerRadius + (this.outerRadius - this.innerRadius) / 2 + f, this.centerY + c);
                }
              }
              this.ctx.restore();
            } else if (l == "vertical") {
              this.ctx.textAlign = "center";
              this.ctx.textBaseline = e == "inner" ? "bottom" : e == "outer" ? "top" : "middle";
              d = seg.endAngle - (seg.endAngle - seg.startAngle) / 2;
              d += this.rotationAngle;
              this.ctx.save();
              this.ctx.translate(this.centerX, this.centerY);
              this.ctx.rotate(this.degToRad(d));
              this.ctx.translate(-this.centerX, -this.centerY);
              if (e == "outer") {
                h = this.centerY - this.outerRadius + f;
              } else if (e == "inner") {
                h = this.centerY - this.innerRadius - f;
              }
              g = b - b / 9;
              if (e == "outer") {
                for (d = 0; d < a[i].length; d++) {
                  character = a[i].charAt(d);
                  if (k) {
                    this.ctx.fillText(character, this.centerX + c, h);
                  }
                  if (m) {
                    this.ctx.strokeText(character, this.centerX + c, h);
                  }
                  h += g;
                }
              } else if (e == "inner") {
                for (d = a[i].length - 1; 0 <= d; d--) {
                  character = a[i].charAt(d);
                  if (k) {
                    this.ctx.fillText(character, this.centerX + c, h);
                  }
                  if (m) {
                    this.ctx.strokeText(character, this.centerX + c, h);
                  }
                  h -= g;
                }
              } else if (e == "center") {
                h = 0;
                if (1 < a[i].length) {
                  h = g * (a[i].length - 1) / 2;
                }
                h = this.centerY - this.innerRadius - (this.outerRadius - this.innerRadius) / 2 - h - f;
                for (d = 0; d < a[i].length; d++) {
                  character = a[i].charAt(d);
                  if (k) {
                    this.ctx.fillText(character, this.centerX + c, h);
                  }
                  if (m) {
                    this.ctx.strokeText(character, this.centerX + c, h);
                  }
                  h += g;
                }
              }
              this.ctx.restore();
            } else if (l == "curved") {
              g = 0;
              if (e == "inner") {
                g = this.innerRadius + f;
                this.ctx.textBaseline = "bottom";
                g += b * (a.length - 1);
              } else if (e == "outer") {
                g = this.outerRadius - f;
                this.ctx.textBaseline = "top";
              } else if (e == "center") {
                g = this.innerRadius + f + (this.outerRadius - this.innerRadius) / 2;
                this.ctx.textBaseline = "middle";
              }
              q = 0;
              if (1 < a[i].length) {
                this.ctx.textAlign = "left";
                q = b / 10 * 4;
                radiusPercent = 100 / g;
                q *= radiusPercent;
                totalArc = q * a[i].length;
                p = seg.startAngle + ((seg.endAngle - seg.startAngle) / 2 - totalArc / 2);
              } else {
                p = seg.startAngle + (seg.endAngle - seg.startAngle) / 2;
                this.ctx.textAlign = "center";
              }
              p += this.rotationAngle;
              for (d = 0; d < a[i].length; d++) {
                this.ctx.save();
                character = a[i].charAt(d);
                this.ctx.translate(this.centerX, this.centerY);
                this.ctx.rotate(this.degToRad(p));
                this.ctx.translate(-this.centerX, -this.centerY);
                if (m) {
                  this.ctx.strokeText(character, this.centerX, this.centerY - g + c);
                }
                if (k) {
                  this.ctx.fillText(character, this.centerX, this.centerY - g + c);
                }
                p += q;
                this.ctx.restore();
              }
            }
            c += b;
          }
        }
        this.ctx.restore();
      }
    }
  };
  Winwheel.prototype.degToRad = function (a) {
    return .017453292519943295 * a;
  };
  Winwheel.prototype.setCenter = function (a, b) {
    this.centerX = a;
    this.centerY = b;
  };
  Winwheel.prototype.addSegment = function (a, b) {
    newSegment = new Segment(a);
    this.numSegments++;
    var c;
    if (typeof b === "undefined") {
      this.segments[this.numSegments] = newSegment;
      c = this.numSegments;
    } else {
      for (c = this.numSegments; c > b; c--) {
        this.segments[c] = this.segments[c - 1];
      }
      this.segments[b] = newSegment;
      c = b;
    }
    this.updateSegmentSizes();
    return this.segments[c];
  };
  Winwheel.prototype.setCanvasId = function (a) {
    if (a) {
      this.canvasId = a;
      if (this.canvas = document.getElementById(this.canvasId)) {
        this.ctx = this.canvas.getContext("2d");
      }
    } else {
      this.canvas = this.ctx = this.canvasId = null;
    }
  };
  Winwheel.prototype.deleteSegment = function (a) {
    if (1 < this.numSegments) {
      if (typeof a !== "undefined") {}
      this.segments[this.numSegments] = void 0;
      this.numSegments--;
      this.updateSegmentSizes();
    }
  };
  Winwheel.prototype.windowToCanvas = function (a, b) {
    var c = this.canvas.getBoundingClientRect();
    return {x: Math.floor(a - this.canvas.width / c.width * c.left), y: Math.floor(b - this.canvas.height / c.height * c.top)};
  };
  Winwheel.prototype.getSegmentAt = function (a, b) {
    var c = null;
    var l = this.getSegmentNumberAt(a, b);
    if (l !== null) {
      c = this.segments[l];
    }
    return c;
  };
  Winwheel.prototype.getSegmentNumberAt = function (a, b) {
    var c = this.windowToCanvas(a, b);
    var l;
    var e;
    var f;
    if (c.x > this.centerX) {
      n = c.x - this.centerX;
      e = "R";
    } else {
      n = this.centerX - c.x;
      e = "L";
    }
    if (c.y > this.centerY) {
      f = c.y - this.centerY;
      l = "B";
    } else {
      f = this.centerY - c.y;
      l = "T";
    }
    var k = 180 * Math.atan(f / n) / Math.PI;
    var c = 0;
    var n = Math.sqrt(f * f + n * n);
    if (l == "T" && e == "R") {
      c = Math.round(90 - k);
    } else if (l == "B" && e == "R") {
      c = Math.round(k + 90);
    } else if (l == "B" && e == "L") {
      c = Math.round(90 - k + 180);
    } else if (l == "T" && e == "L") {
      c = Math.round(k + 270);
    }
    if (this.rotationAngle != 0) {
      e = this.getRotationPosition();
      c -= e;
      if (0 > c) {
        c = 360 - Math.abs(c);
      }
    }
    e = null;
    for (a = 1; a <= this.numSegments; a++) {
      if (c >= this.segments[a].startAngle && c <= this.segments[a].endAngle && n >= this.innerRadius && n <= this.outerRadius) {
        e = a;
        break;
      }
    }
    return e;
  };
  Winwheel.prototype.getIndicatedSegment = function () {
    var a = this.getIndicatedSegmentNumber();
    return this.segments[a];
  };
  Winwheel.prototype.getIndicatedSegmentNumber = function () {
    var a = 0;
    var b = this.getRotationPosition();
    var b = Math.floor(this.pointerAngle - b);
    if (0 > b) {
      b = 360 - Math.abs(b);
    }
    for (x = 1; x < this.segments.length; x++) {
      if (b >= this.segments[x].startAngle && b <= this.segments[x].endAngle) {
        a = x;
        break;
      }
    }
    return a;
  };
  Winwheel.prototype.getRotationPosition = function () {
    var a = this.rotationAngle;
    if (0 <= a) {
      if (360 < a) {
        var b = Math.floor(a / 360);
        var a = a - 360 * b;
      }
    } else {
      if (-360 > a) {
        b = Math.ceil(a / 360);
        a -= 360 * b;
      }
      a = 360 + a;
    }
    return a;
  };
  Winwheel.prototype.startAnimation = function () {
    if (this.animation) {
      this.computeAnimation();
      winwheelToDrawDuringAnimation = this;
      var a = Array(null);
      a[this.animation.propertyName] = this.animation.propertyValue;
      a.yoyo = this.animation.yoyo;
      a.repeat = this.animation.repeat;
      a.ease = this.animation.easing;
      a.onUpdate = winwheelAnimationLoop;
      a.onComplete = winwheelStopAnimation;
      this.tween = TweenMax.to(this, this.animation.duration, a);
    }
  };
  Winwheel.prototype.stopAnimation = function (a) {
    if (winwheelToDrawDuringAnimation) {
      winwheelToDrawDuringAnimation.tween.kill();
      winwheelStopAnimation(a);
    }
    winwheelToDrawDuringAnimation = this;
  };
  Winwheel.prototype.pauseAnimation = function () {
    if (this.tween) {
      this.tween.pause();
    }
  };
  Winwheel.prototype.resumeAnimation = function () {
    if (this.tween) {
      this.tween.play();
    }
  };
  Winwheel.prototype.computeAnimation = function () {
    if (this.animation) {
      if (this.animation.type == "spinOngoing") {
        this.animation.propertyName = "rotationAngle";
        if (this.animation.spins == null) {
          this.animation.spins = 5;
        }
        if (this.animation.repeat == null) {
          this.animation.repeat = -1;
        }
        if (this.animation.easing == null) {
          this.animation.easing = "Linear.easeNone";
        }
        if (this.animation.yoyo == null) {
          this.animation.yoyo = false;
        }
        this.animation.propertyValue = 360 * this.animation.spins;
        if (this.animation.direction == "anti-clockwise") {
          this.animation.propertyValue = 0 - this.animation.propertyValue;
        }
      } else if (this.animation.type == "spinToStop") {
        this.animation.propertyName = "rotationAngle";
        if (this.animation.spins == null) {
          this.animation.spins = 5;
        }
        if (this.animation.repeat == null) {
          this.animation.repeat = 0;
        }
        if (this.animation.easing == null) {
          this.animation.easing = "Power4.easeOut";
        }
        this.animation._stopAngle = this.animation.stopAngle == null ? Math.floor(359 * Math.random()) : 360 - this.animation.stopAngle + this.pointerAngle;
        if (this.animation.yoyo == null) {
          this.animation.yoyo = false;
        }
        this.animation.propertyValue = 360 * this.animation.spins;
        if (this.animation.direction == "anti-clockwise") {
          this.animation.propertyValue = 0 - this.animation.propertyValue;
          this.animation.propertyValue -= 360 - this.animation._stopAngle;
        } else {
          this.animation.propertyValue += this.animation._stopAngle;
        }
      } else if (this.animation.type == "spinAndBack") {
        this.animation.propertyName = "rotationAngle";
        if (this.animation.spins == null) {
          this.animation.spins = 5;
        }
        if (this.animation.repeat == null) {
          this.animation.repeat = 1;
        }
        if (this.animation.easing == null) {
          this.animation.easing = "Power2.easeInOut";
        }
        if (this.animation.yoyo == null) {
          this.animation.yoyo = true;
        }
        this.animation._stopAngle = this.animation.stopAngle == null ? 0 : 360 - this.animation.stopAngle;
        this.animation.propertyValue = 360 * this.animation.spins;
        if (this.animation.direction == "anti-clockwise") {
          this.animation.propertyValue = 0 - this.animation.propertyValue;
          this.animation.propertyValue -= 360 - this.animation._stopAngle;
        } else {
          this.animation.propertyValue += this.animation._stopAngle;
        }
      }
    }
  };
  Winwheel.prototype.getRandomForSegment = function (a) {
    var b = 0;
    if (a) {
      if (typeof this.segments[a] === "undefined") {
        console.log("Segment " + a + " undefined");
      } else {
        var c = this.segments[a].startAngle;
        a = this.segments[a].endAngle - c - 2;
        if (0 < a) {
          b = c + 1 + Math.floor(Math.random() * a);
        } else {
          console.log("Segment size is too small to safely get random angle inside it");
        }
      }
    } else {
      console.log("Segment number not specified");
    }
    return b;
  };
  function Pin(a) {
    defaultOptions = {visible: true, number: 36, outerRadius: 3, fillStyle: "grey", strokeStyle: "black", lineWidth: 1, margin: 3};
    for (var b in defaultOptions) {
      this[b] = a != null && typeof a[b] !== "undefined" ? a[b] : defaultOptions[b];
    }
    if (a != null) {
      for (b in a) {
        if (typeof this[b] === "undefined") {
          this[b] = a[b];
        }
      }
    }
  }
  function Animation(a) {
    defaultOptions = {type: "spinOngoing", direction: "clockwise", propertyName: null, propertyValue: null, duration: 10, yoyo: false, repeat: 0, easing: "power3.easeOut", stopAngle: null, spins: null, clearTheCanvas: null, callbackFinished: null, callbackBefore: null, callbackAfter: null};
    for (var b in defaultOptions) {
      this[b] = a != null && typeof a[b] !== "undefined" ? a[b] : defaultOptions[b];
    }
    if (a != null) {
      for (b in a) {
        if (typeof this[b] === "undefined") {
          this[b] = a[b];
        }
      }
    }
  }
  function Segment(a) {
    defaultOptions = {size: null, text: "", fillStyle: null, strokeStyle: null, lineWidth: null, textFontFamily: null, textFontSize: null, textFontWeight: null, textOrientation: null, textAlignment: null, textDirection: null, textMargin: null, textFillStyle: null, textStrokeStyle: null, textLineWidth: null, image: null, imageDirection: null, imgData: null};
    for (var b in defaultOptions) {
      this[b] = a != null && typeof a[b] !== "undefined" ? a[b] : defaultOptions[b];
    }
    if (a != null) {
      for (b in a) {
        if (typeof this[b] === "undefined") {
          this[b] = a[b];
        }
      }
    }
    this.endAngle = this.startAngle = 0;
  }
  Segment.prototype.changeImage = function (a, b) {
    this.image = a;
    this.imgData = null;
    if (b) {
      this.imageDirection = b;
    }
    winhweelAlreadyDrawn = false;
    this.imgData = new Image;
    this.imgData.onload = winwheelLoadedImage;
    this.imgData.src = this.image;
  };
  function PointerGuide(a) {
    defaultOptions = {display: false, strokeStyle: "red", lineWidth: 3};
    for (var b in defaultOptions) {
      this[b] = a != null && typeof a[b] !== "undefined" ? a[b] : defaultOptions[b];
    }
  }
  function winwheelPercentToDegrees(a) {
    var b = 0;
    if (0 < a && 100 >= a) {
      b = a / 100 * 360;
    }
    return b;
  }
  function winwheelAnimationLoop() {
    if (winwheelToDrawDuringAnimation) {
      if (winwheelToDrawDuringAnimation.animation.clearTheCanvas != 0) {
        winwheelToDrawDuringAnimation.ctx.clearRect(0, 0, winwheelToDrawDuringAnimation.canvas.width, winwheelToDrawDuringAnimation.canvas.height);
      }
      if (winwheelToDrawDuringAnimation.animation.callbackBefore != null) {
        eval(winwheelToDrawDuringAnimation.animation.callbackBefore);
      }
      winwheelToDrawDuringAnimation.draw(false);
      if (winwheelToDrawDuringAnimation.animation.callbackAfter != null) {
        eval(winwheelToDrawDuringAnimation.animation.callbackAfter);
      }
    }
  }
  var winwheelToDrawDuringAnimation = null;
  function winwheelStopAnimation(a) {
    if (a != 0 && winwheelToDrawDuringAnimation.animation.callbackFinished != null) {
      eval(winwheelToDrawDuringAnimation.animation.callbackFinished);
    }
  }
  var winhweelAlreadyDrawn = false;
  function winwheelLoadedImage() {
    if (winhweelAlreadyDrawn == 0) {
      var a = 0;
      for (i = 1; i <= winwheelToDrawDuringAnimation.numSegments; i++) {
        if (winwheelToDrawDuringAnimation.segments[i].imgData != null && winwheelToDrawDuringAnimation.segments[i].imgData.height) {
          a++;
        }
      }
      if (a == winwheelToDrawDuringAnimation.numSegments) {
        winhweelAlreadyDrawn = true;
        winwheelToDrawDuringAnimation.draw();
      }
    }
  }
