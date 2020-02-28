import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  canvas: any;

  configProps: any = {
    width: 1024,
    height: 1024,
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
      isDrawingMode: true,
      selection: true,
      selectionBorderColor: 'green'
    });

    this.canvas.setDimensions({
      width: this.configProps.width,
      height: this.configProps.height,
    });

    // this.canvas.add(new fabric.IText('Brushido Painter'));

  }

  // Add Figure

  // Change canvas size
  adjustCanvasSize(event: any) {
    this.canvas.setDimensions({
      width: this.configProps.width,
      height: this.configProps.height,
    });
  }

  // Canvas Utility Methods
  cleanSelect() {
    this.canvas.deactivateAllWithDispatch().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.deactivateAllWithDispatch().renderAll();
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
      this.canvas.setBackgroundColor({ source: this.configProps.canvasImage, repeat: 'repeat' }, function () {
        // self.configProps.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }
}
