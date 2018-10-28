import React, { Component } from 'react';
import { LineChart } from 'react-easy-chart';


class AltitudeChart extends Component {


  render() {

    const { predictions } = this.props;
    if (predictions.size === 0) return null;

    const altitudeTuples = predictions.map((prediction, index) => {
      return {
        // x: prediction.get('timestamp'),
        x: index,
        y: prediction.get('height'),
      }
    }).toJS();

    return (
      <LineChart
        axes
        grid
        verticalGrid
        // dataPoints
        axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
        margin={{top: 10, right: 10, bottom: 50, left: 50}}
        width={250}
        height={250}
        data={[
          altitudeTuples
        ]}
      />
    );
  }
}

export default AltitudeChart;
