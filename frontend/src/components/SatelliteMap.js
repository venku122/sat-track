import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
const normalize = (number) => {
  const width = 500;
  if (number > 0) {
    return (number * 2.5) + 250;
  }
  if (number <= 0) {
    return 250 + (number * 2.5);
  }
}
*/

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
    this.setState({
      canvas,
      ctx
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
   if (xPos > width) return true;
   if (yPos > height) return true;

  }

  renderPredictions() {
    const { predictions } = this.props;
    const { ctx, canvas } = this.state;
    const { width, height } = canvas;
    ctx.fillStyle = 'red';
    /*
    predictions.map((prediction) => {
      const xPos = this.normalizeLong(prediction.get('long'));
      const yPos = this.normalizeLat(prediction.get('lat'));
      ctx.fillRect(xPos,yPos,2,2);
    });
    */

   ctx.beginPath();
   let xPos, yPos, priorXPos, priorYPos;
   for (let i = 0; i < predictions.size; i++) {
     const prediction = predictions.get(i);
      xPos = this.normalizeLong(prediction.get('long'));
      yPos = this.normalizeLat(prediction.get('lat'));
      if (xPos > width) {
        ctx.lineTo(width, yPos);
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.lineTo(xPos, yPos, 2, 2);
      }
      /*
      if (this.willCrossEdge(xPos, yPos, priorXPos, priorYPos)) {
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.lineTo(xPos,yPos,2,2);
      }
      */
      priorYPos = yPos;
      priorXPos = xPos;
    }
    /*
    predictions.map((prediction, index) => {

    });*/
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
