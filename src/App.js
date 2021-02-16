import React, { Component } from 'react';
import './App.css';
import {  ConfirmSignIn, SignIn, SignUp, VerifyContact, ConfirmSignUp, ForgotPassword, RequireNewPassword, withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import ImagePicker from "./ImagePicker"
import Stats from "./Stats"
import CustomGreetings from './CustomGreetings';
Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Image Categorizer 6000
          </h1>
          <hr id="line" />
        </header>
        <body className="App-body">
          <h2>
            Upload image for categorization (jpg, png)
          </h2>
          <ImagePicker />
          <hr id="line" />
          <h2>
            Statistics
          </h2>
          <Stats />
        </body>
      </div>
    );
  }
}

export default withAuthenticator(App, true, [
  <SignIn />,
  <ConfirmSignIn />,
  <VerifyContact/>,
  <SignUp/>,
  <ConfirmSignUp/>,
  <ForgotPassword/>,
  <RequireNewPassword />,
  <CustomGreetings/>
], null);
