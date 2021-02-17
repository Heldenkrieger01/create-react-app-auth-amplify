import React, { Component } from 'react';
import { ConfirmSignIn, SignIn, SignUp, VerifyContact, ConfirmSignUp, ForgotPassword, RequireNewPassword, withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import './styles/App.css';
import ImageUploader from "./components/ImageUploader"
import Stats from "./components/Stats"
import CustomGreetings from './components/CustomGreetings';
Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>
            Image Categorizer 6000
          </h1>
          <hr id="line" />
        </div>
        <div className="App-body">
          <h2>
            Upload image for categorization (jpg, png)
          </h2>
          <ImageUploader />
          <hr id="line" />
          <h2>
            Statistics
          </h2>
          <Stats />
        </div>
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
