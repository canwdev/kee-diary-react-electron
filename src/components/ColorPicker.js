import React from 'react';
import {CirclePicker} from 'react-color';

export default class ColorPicker extends React.Component {
  state = {
    color: {}
  }

  handleChangeComplete = (color) => {
    this.setState({color});
    this.props.updateColor(color)
  };

  render() {
    return <CirclePicker
      color={this.state.color}
      onChangeComplete={this.handleChangeComplete}
    />;
  }
}
