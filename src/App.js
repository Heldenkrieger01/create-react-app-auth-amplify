import React, { PropTypes, Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAmazon, withAuthenticator, withGoogle } from 'aws-amplify-react'
import Amplify, { Auth, Storage } from 'aws-amplify';
import aws_exports from './aws-exports';
import { render } from 'react-dom';
import ImagePicker from "./ImagePicker"
Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super();
    this.state = { buttonText: "Upload" }
  }

  upload = e => {
    this.setState({ buttonText: "Success" })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Image Categorizer Web App
          </h1>
          <hr className="title-line" />
        </header>
        <body className="App-body">
          <h2>
            Upload image for categorization (jpg only)
          </h2>
          <ImagePicker />
          <button onClick={download_hut}>
            Download landscape.jpg
          </button>
        </body>
      </div>
    );
  }
}

function download_hut(e) {
  console.log(Storage.list('', { level: 'public' }))
  Storage.get('landscape.jpg', { download: true, level: 'public' })
    .then(res => downloadBlob(res.Body, 'downscape.jpg'))
    .catch(err => console.log(err))
}

function downloadBlob(data, filename) {
  const blob = new Blob([data])
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener('click', clickHandler);
    }, 150);
  };
  a.addEventListener('click', clickHandler, false);
  a.click();
  return a;
}

export default withAuthenticator(App, true);
