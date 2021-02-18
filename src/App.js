
import React, { Component } from 'react';
import MemeGalleryComponent from './Components/MemeGalleryComponent';
import LoginComponent from './Components/LoginComponent';
import HelmetMetaData from "./Components/HelmetMetaData";


class App extends Component {
    constructor(props) {
        super(props);
        this.setToken = this.setToken.bind(this);
        this.state = {
            token: null
        };
    }

    setToken = (value) => {
        this.setState({token: value})
        sessionStorage.setItem('token', JSON.stringify(value))
    }

    render(){
      let shownComponent;

     
      if(this.state.token === null){
        shownComponent = <LoginComponent token={this.state.token} setToken={this.setToken}/>;
      } else {
        shownComponent = <MemeGalleryComponent/>;
      }
      
      return(
        <div>
          {shownComponent}  
          <HelmetMetaData></HelmetMetaData>
          
        </div>
        
      )
    }
}

export default App;