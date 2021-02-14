import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {  withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { render } from 'react-dom';
import ImagePicker from "./ImagePicker"
import Stats from "./Stats"
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
            Upload image for categorization (jpg, png)
          </h2>
          <ImagePicker />
          <h2>
            Stats for the Iamge Classifier 6000
          </h2>
          <Stats />
        </body>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
