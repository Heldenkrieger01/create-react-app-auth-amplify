import React from "react";
import { Greetings, NavBar, NavRight, Nav, AmplifyTheme, NavItem } from 'aws-amplify-react'
import UsernameAttributes from 'aws-amplify'
import '../styles/CustomGreetings.css'

class CustomGreetings extends Greetings {
  userGreetingsNoButton(theme) {
    const user = this.props.authData || this.state.authData;
    const greeting = this.props.inGreeting || this.inGreeting;
    // get name from attributes first
    const { usernameAttributes = 'username' } = this.props;
    let name = '';
    switch (usernameAttributes) {
      case UsernameAttributes.EMAIL:
        // Email as Username
        name = user.attributes ? user.attributes.email : user.username;
        break;
      case UsernameAttributes.PHONE_NUMBER:
        // Phone number as Username
        name = user.attributes ? user.attributes.phone_number : user.username;
        break;
      default:
        const nameFromAttr = user.attributes
          ? user.attributes.name ||
          (user.attributes.given_name
            ? user.attributes.given_name + ' ' + user.attributes.family_name
            : undefined)
          : undefined;
        name = nameFromAttr || user.name || user.username;
        break;
    }

    const message = typeof greeting === 'function' ? greeting(name) : greeting;

    return (
      <div className="col">
        <NavItem theme={theme}>{message}</NavItem>
      </div>
    );
  }

  render() {

    const authState = this.props.authState || this.state.authState;
    const signedIn = authState === 'signedIn';

    const theme = this.props.theme || AmplifyTheme;
    const greeting = signedIn
      ? this.userGreetingsNoButton(theme)
      : this.noUserGreetings(theme);
    if (!greeting) {
      return null;
    }

    return (
        <NavBar>
          <Nav>
            <span className="row">
              {greeting}
              <NavRight className="col">
                {this.renderSignOutButton()}
              </NavRight>
            </span>
          </Nav>
        </NavBar>
    );
  }
}

export default CustomGreetings;