import React, { Component } from 'react';
import {FacebookShareButton,} from "react-share";
import { FaFacebook } from 'react-icons/fa';


class ShareComponent extends Component{

    constructor(props) {
        super(props);
        this.state= {

        }
    }

    componentDidMount(){
        
    }

    componentDidUpdate(){

    }
  
  


  render(){
    const shareUrl = window.location.href; 
      return(
          <div id="shareContainer"> 
            <FacebookShareButton
                url={"http://localhost:3000/index.html"}
                quote={shareUrl}
                className="socialMediaButton"
                image={this.props.memeToShare}
                description={this.props.memeTitle}>
                    <FaFacebook/>
            </FacebookShareButton>
          </div>

      );
  }
}

export default ShareComponent;
