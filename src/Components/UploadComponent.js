import React, { Component } from 'react';
import { FaUpload } from 'react-icons/fa';

const types = ['image/png', 'image/jpg','image/jpeg', 'image/gif'];

class UploadComponent extends Component{

    constructor(props) {
        super(props);
        this.state= {
            currentImg: {},
            selectedFile: {}
        }
    }

    componentDidMount(){

    }
  
  /*called when user uploads a file, which is being checked on supported file format.
  If the file is an image it is being saved in the database.
  The uploaded file is then set as enlarged image and added to the Gallery*/
  uploadImage = (event) => {
    
    const selectedFile = event.target.files[0];

    //check if uploaded file is supported file format
    if (types.includes(selectedFile.type) !== true) {
      alert("Sorry, " + selectedFile.type + " is invalid file type, allowed file types are: " + types.join(", "));
    } else {

      // this.saveImageToDB(); Does it need to be saved directly? Shouldn't it just be saved when clicking on "Save meme"

      const reader = new FileReader();
  
      reader.readAsDataURL(selectedFile);
      reader.onloadend = (e) => {
        this.addImageProcess(reader.result).then(img => {
            this.setState({
              currentImg: {
                  src: img.src,
                  width: img.width,
                  height: img.height,
                  name: selectedFile.name
              }
            });
          this.props.imageUploaded(this.state.currentImg)
          document.getElementById('file-chosen').innerHTML = selectedFile.name;
        }    
        );  
      }
    } 
  }

  //turn the uploaded file into an img which can be displayed
  addImageProcess(src){
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = src
      img.onload = function (){
        resolve(img);
      }
      img.onerror = reject

    })
  }


  render(){
      return(
          <div className="btn-wrapper">  
              <label htmlFor="uploadBtn">
              <FaUpload /> Lade eigenes Bild hoch</label>   
              <span id="file-chosen"></span>             
              <input type="file" id="uploadBtn" hidden onChange={(event) => this.uploadImage(event, "upload")}>
              </input>
          </div>
      );
  }
}

export default UploadComponent;
