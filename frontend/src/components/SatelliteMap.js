import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import mapImg from './Equirectangular_projection_SW.jpg';
import '../styles/satelliteMap.css';

class SatelliteMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvas: null,
      ctx: null,
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    const mapBackground = new Image(); // Create new img element
    mapBackground.src = mapImg;
    this.setState({
      canvas,
      ctx,
      mapBackground,
    });
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    // this.renderPredictions();
  }

  componentDidUpdate() {
    // this.renderPredictions();
    console.log('redrawing map');
    this.renderPredictionsLongCurve();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  normalize(dimension, value) {
    const scalingFactor = dimension / 2 / 100;
    return value * scalingFactor + dimension / 2;
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

  willCrossEdge(xPos, yPos /* priorXPos, priorYPos */) {
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
    return false;
  }

  handleResize() {
    const canvas = this.refs.canvas;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    this.renderPredictionsLongCurve();
  }

  renderPredictions() {
    const { predictions } = this.props;
    const { ctx, canvas, mapBackground } = this.state;
    if (!canvas) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
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
    let xPos;
    let yPos;
    /*
    let priorXPos;
    let priorYPos;
    */
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
      /*
      priorYPos = yPos;
      priorXPos = xPos;
      */
    }
    ctx.stroke();
  }

  renderPredictionsLongCurve() {
    const { predictions } = this.props;
    const { ctx, canvas, mapBackground } = this.state;
    if (!canvas) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    /*
      const prediction = predictions.get(i);
      xPos = this.normalizeLong(prediction.get('long'));
      yPos = this.normalizeLat(prediction.get('lat'));
    */
    // move to the first point
    if (predictions.size > 0) {
      ctx.drawImage(mapBackground, 0, 0, width, height);
      ctx.beginPath();
      const startingPrediction = predictions.get(0);
      const xPos = this.normalizeLong(startingPrediction.get('long'));
      const yPos = this.normalizeLat(startingPrediction.get('lat'));
      ctx.moveTo(xPos, yPos);
      let i = 0;
      for (i = 1; i < predictions.size - 2; i++) {
        const prediction1 = predictions.get(i);
        const prediction2 = predictions.get(i + 1);
        const x1 = this.normalizeLong(prediction1.get('long'));
        const x2 = this.normalizeLong(prediction2.get('long'));
        const y1 = this.normalizeLat(prediction1.get('lat'));
        const y2 = this.normalizeLat(prediction2.get('lat'));
        const xc = (x1 + x2) / 2;
        const yc = (y1 + y2) / 2;
        ctx.quadraticCurveTo(x1, y1, xc, yc);
      }

      const finalPrediction1 = predictions.get(i);
      const finalPrediction2 = predictions.get(i + 1);

      // curve through the last two points
      ctx.quadraticCurveTo(
        this.normalizeLong(finalPrediction1.get('long')),
        this.normalizeLat(finalPrediction1.get('lat')),
        this.normalizeLong(finalPrediction2.get('long')),
        this.normalizeLat(finalPrediction2.get('lat'))
      );
      ctx.stroke();
    }
  }

  render() {
    // const { width, height } = this.props;
    return (
      <div className="satellite-map-container">
        <canvas
          ref="canvas"
          className="satellite-map-canvas"
          onResize={this.handleResize}
        />{' '}
      </div>
    );
  }
}

/*
window.addEventListener("resize", resizeCanvas, false);
 
function resizeCanvas(e) {
  var myCanvas = document.getElementById("myCanvas");
  myCanvas.width = document.documentElement.clientWidth;
  myCanvas.height = document.documentElement.clientHeight;
}
*/

SatelliteMap.propTypes = {
  predictions: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default SatelliteMap;
