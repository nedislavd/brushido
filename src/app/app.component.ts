import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  canvas: any;

  configProps: any = {
    width: 800,
    height: 800,
    canvasFill: '#FFFFFF',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  textString: string;
  url: any = '';

  json: any;
  textEditor = false;
  imageEditor = false;
  figureEditor = false;
  selected: any;

  constructor() { }

  ngOnInit() {
    this.canvas = new fabric.Canvas('drawing-board', {
      isDrawingMode: false,
      selection: true,
      selectionBorderColor: 'green'
    });

    this.canvas.on('selection:updated', (e) => {
      console.log(e.target);
    });

    this.canvas.on({
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();
      },
      'selection:created': (e) => {

        let selectedObject = e.target;
        this.selected = selectedObject;
        console.log(e.target);
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {

          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
            case 'ellipse':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              console.log('image');
              break;
          }
        }
      }
    });

    this.canvas.setDimensions({
      width: this.configProps.width,
      height: this.configProps.height,
    });
  }

  // Add Figure
  addFigure(figure) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
      case 'ellipse':
        add = new fabric.Ellipse({
          rx: 120, ry: 80, left: 10, top: 10, fill: '#fd0909'
        });
        break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  // Text Node
  addText() {
    const textString = this.textString;
    const text = new fabric.IText(textString, {
      left: 10,
      top: 10,
      fontFamily: 'helvetica',
      angle: 0,
      fill: '#000000',
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      hasRotatingPoint: true
    });
    this.extend(text, this.randomId());
    this.canvas.add(text);
    this.selectItemAfterAdded(text);
    this.textString = '';
  }

  /*
  * Canvas Utility Methods
  * */
  adjustCanvasSize(event: any) {
    this.canvas.setDimensions({
      width: this.configProps.width,
      height: this.configProps.height,
    });
  }

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.configProps.canvasImage) {
      this.canvas.backgroundColor = this.configProps.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  setCanvasBgrImage() {
    let self = this;
    if (this.configProps.canvasImage) {
      fabric.Image.fromURL(this.configProps.canvasImage, (imgObj) => {
        self.canvas.setBackgroundImage(imgObj, () => {
          self.configProps.canvasFill = '';
          imgObj.scaleToWidth(self.canvas.width);
          imgObj.scaleToHeight(self.canvas.height);
          self.canvas.backgroundImage.strech = true;
          self.canvas.renderAll();
        }, {
          opacity: 1,
          repeat: true
        });

      }, {
        crossOrigin: 'Anonymous'
      });
    } else {
      self.canvas.setBackgroundColor('#FFFFFF', () => {
        self.configProps.canvasFill = '#FFFFFF';
        self.configProps.canvasImage = '';
        self.canvas.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*
  * UPLOAD IMAGE
  * */
  addImageOnCanvas(url) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          hasRotatingPoint: true
        });
        image.scaleToWidth(200);
        image.scaleToHeight(200);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event) => {
        this.url = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  };

  /*
  * GLOBAL ACTIONS
  * */
  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  }


  setActiveStyle(styleName, value, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      let style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    } else {
      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }


  getActiveProp(name) {
    let object = this.canvas.getActiveObject();
    if (!object) return '';

    return object[name] || '';
  }

  setActiveProp(name, value) {
    let object = this.canvas.getActiveObject();
    if (!object) return;
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  clone() {

    this.canvas.getActiveObjects().forEach((object) => {
      let clone;
      switch (object.type) {
        case 'rect':
          clone = new fabric.Rect(object.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(object.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(object.toObject());
          break;
        case 'ellipse':
          clone = new fabric.Ellipse(object.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', object.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(object);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    });
  }

  getId() {
    this.configProps.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    let val = this.configProps.id;
    let complete = this.canvas.getActiveObject().toObject();
    console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.configProps.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.configProps.opacity) / 100, null);
  }

  getFill() {
    this.configProps.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.configProps.fill, null);
  }

  getLineHeight() {
    this.configProps.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.configProps.lineHeight), null);
  }

  getCharSpacing() {
    this.configProps.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.configProps.charSpacing, null);
  }

  getFontSize() {
    this.configProps.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.configProps.fontSize), null);
  }

  getBold() {
    this.configProps.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.configProps.fontWeight = !this.configProps.fontWeight;
    this.setActiveStyle('fontWeight', this.configProps.fontWeight ? 'bold' : '', null);
  }

  getFontStyle() {
    this.configProps.fontStyle = this.getActiveStyle('fontStyle', null);
  }

  setFontStyle() {
    this.configProps.fontStyle = !this.configProps.fontStyle;
    this.setActiveStyle('fontStyle', this.configProps.fontStyle ? 'italic' : '', null);
  }


  getTextDecoration() {
    this.configProps.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.configProps.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.configProps.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.configProps.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.configProps.TextDecoration.includes(value);
  }


  getTextAlign() {
    this.configProps.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.configProps.textAlign = value;
    this.setActiveProp('textAlign', this.configProps.textAlign);
  }

  getFontFamily() {
    this.configProps.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.configProps.fontFamily);
  }

  /*
  * SYSTEM METHODS
  * */
  removeSelected() {
    this.canvas.getActiveObjects().forEach((object) => {
      this.canvas.remove(object);
    });
  }

  bringToFront() {
    this.canvas.getActiveObjects().forEach((object) => {
      object.bringToFront();
    });
  }

  sendToBack() {
    this.canvas.getActiveObjects().forEach((object) => {
      object.sendToBack();
    });
  }

  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas.clear();
      this.configProps = {
        width: 800,
        height: 800,
        canvasFill: '#FFFFFF',
        canvasImage: '',
        id: null,
        opacity: null,
        fill: null,
        fontSize: null,
        lineHeight: null,
        charSpacing: null,
        fontWeight: null,
        fontStyle: null,
        textAlign: null,
        fontFamily: null,
        TextDecoration: ''
      }
    }
  }

  rasterize() {
    // if (!fabric.Canvas.supports('toDataURL')) {
    //   alert('This browser doesn\'t provide means to serialize canvas to an image');
    // } else {
      console.log(this.canvas.toDataURL('png'));
      let image = new Image();
      image.src = this.canvas.toDataURL('png');
      let w = window.open('');
      w.document.write(image.outerHTML);
    // }
  }

  rasterizeSVG() {
    console.log(this.canvas.toSVG());
    let w = window.open('');
    w.document.write(this.canvas.toSVG());
  };


  saveCanvasToJSON() {
    let json = JSON.stringify(this.canvas);
    localStorage.setItem('Kanvas', json);
    console.log('json');
    console.log(json);

  }

  loadCanvasFromJSON() {
    let CANVAS = localStorage.getItem('Kanvas');
    console.log('CANVAS');
    console.log(CANVAS);

    // and load everything from the same json
    this.canvas.loadFromJSON(CANVAS, () => {
      console.log('CANVAS untar');
      console.log(CANVAS);

      // making sure to render canvas at the end
      this.canvas.renderAll();

      // and checking if object's "name" is preserved
      console.log('this.canvas.item(0).name');
      console.log(this.canvas);
    });

  };

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }
}

