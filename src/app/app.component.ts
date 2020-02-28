import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private canvas: any;

  private configProps: any = {
    width: 1280,
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

  private textString: string;
  private url: string = '';

  private json: any;
  private textEditor: boolean = false;
  private imageEditor: boolean = false;
  private figureEditor: boolean = false;
  private selected: any;

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
}
