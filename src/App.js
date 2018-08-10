import React, { Component } from 'react';
import './App.css';

import ReactImageCropper from './components/react-image-cropper';

class App extends Component {
  constructor(props) {
    super(props);

    this.saveImage = this.saveImage.bind(this);

    this.state = {
      imgDataURL: ''
    };
  }

  render() {
    return (
      <div className="App">
        <ReactImageCropper saveImage={this.saveImage} />
        <img src={this.state.imgDataURL} alt="preview"/>
      </div>
    );
  }

  saveImage(imgDataURL) {
    this.setState({ imgDataURL });
  }
}

export default App;
