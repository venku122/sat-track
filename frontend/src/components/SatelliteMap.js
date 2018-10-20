import React, { Component } from 'react';
import PropTypes from 'prop-types';

const normalize = (number) => {
  const width = 500;
  if (number > 0) {
    return (number * 2.5) + 250;
  }
  if (number <= 0) {
    return 250 + (number * 2.5);
  }
}

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

  renderPredictions() {
    const { predictions } = this.props;
    const { ctx } = this.state;
    ctx.fillStyle = 'green';
    predictions.map((prediction) => {
      const xPos = normalize(prediction.get('long'));
      const yPos = normalize(prediction.get('lat'));
      ctx.fillRect(xPos,yPos,1,1);
    });
  }

  render() {
    return (
      <div id="satellite-map">
        <canvas ref="canvas" width={500} height={500} />
      </div>
    );
  }
}

export default SatelliteMap;
