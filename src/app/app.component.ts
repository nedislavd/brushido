import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  canvas: any;

  configProps = {
    width: 1280,
    height: 1024,
  };

  ngOnInit() {
    this.canvas = new fabric.Canvas('drawing-board', {
      isDrawingMode: true,
      selection: true
    });
    this.canvas.setDimensions({
      width: this.configProps.width,
      height: this.configProps.height,
    });
    this.canvas.add(new fabric.IText('Brushido Painter'));
  }
}
