import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mapImg from './Equirectangular_projection_SW.jpg';

class SatelliteMap extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canvas: null,
      ctx: null,
    };
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const mapBackground = new Image();   // Create new img element
    mapBackground.src = mapImg;
    this.setState({
      canvas,
      ctx,
      mapBackground
    });
    // this.renderPredictions();
  }

  componentDidUpdate(nextProps, nextState) {
    this.renderPredictions();
  }

  normalize(dimension, value) {
    const scalingFactor = (dimension/2) / 100; 
    return (value * scalingFactor) + dimension/2;
  }

  normalizeLat(lat) {
    const { canvas } = this.state;
    const height = canvas.height;
    return this.normalize(height, lat);
  }

  normalizeLong(long) {
    const { canvas } = this.state;
    const width = canvas.width;
    return this.normalize(width, long);
  }

  willCrossEdge(xPos, yPos, priorXPos, priorYPos) {
    const { canvas } = this.state;
    const { width, height } = canvas;
    /*
    const xLeap = Math.abs(xPos- priorXPos);
    const yLeap = Math.abs(yPos - priorYPos);
    if ((priorXPos + xLeap) > width) return true;
    if ((priorYPos + yLeap) > height) return true;
    return false;
    */
   if (xPos > width || xPos < 0) return true;
   if (yPos > height || yPos < 0) return true;

  }

  renderPredictions() {
    const { predictions } = this.props;
    const { ctx, canvas, mapBackground } = this.state;
    const { width, height } = canvas;
    ctx.fillStyle = 'red';
    /*
    predictions.map((prediction) => {
      const xPos = this.normalizeLong(prediction.get('long'));
      const yPos = this.normalizeLat(prediction.get('lat'));
      ctx.fillRect(xPos,yPos,2,2);
    });
    */
  ctx.drawImage(mapBackground, 0, 0, width, height);
   ctx.beginPath();
   let xPos, yPos, priorXPos, priorYPos;
   for (let i = 0; i < predictions.size; i++) {
     const prediction = predictions.get(i);
      xPos = this.normalizeLong(prediction.get('long'));
      yPos = this.normalizeLat(prediction.get('lat'));
      /*
      if (xPos > width) {
        ctx.lineTo(width, yPos);
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.lineTo(xPos, yPos, 2, 2);
      }
      */
      /*
      if (this.willCrossEdge(xPos, yPos, priorXPos, priorYPos)) {
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.lineTo(xPos,yPos,2,2);
      }
      */
     ctx.lineTo(xPos, yPos, 2, 2);
      priorYPos = yPos;
      priorXPos = xPos;
    }
  ctx.stroke();
  }

  render() {
    return (
      <div id="satellite-map">
        <canvas ref="canvas" width={1280} height={720} />
      </div>
    );
  }
}

export default SatelliteMap;
