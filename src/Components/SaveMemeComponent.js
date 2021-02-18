import React, { Component } from 'react';

class SaveMemeComponent extends Component {
    
    //save uploaded image to databse with unique imageName(originalName + currentDate in milliseconds)
    saveImageToDB = (event) => {
        console.log(event);
        let imageFormObj = new FormData();

        imageFormObj.append("imageName", this.getFormattedTime()+ '_' +this.props.memeTitle);
        imageFormObj.append('imageData', this.props.editedMemeToSave);

        let formData = new URLSearchParams();

        for (const pair of imageFormObj) {
            formData.append(pair[0], pair[1]);
        }

        fetch('/image/upload', {
            mode: 'cors',
            method: 'POST',
            /*
             headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            */
            body: formData,
        })
            .then((data) => {
                //this.getImageByName(imageFormObj.get("imageName"));
                if(data.status === 200){
                    console.log('Image has been uploaded to database');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }


    /*check if image with specific imageName is stored in database,
    if image exists in database it is stored in variable "data"
    TODO: check by ID instead by name*/
    getImageByName(imageName){
        var params = {name: imageName};
        var url = '/image/singleMeme?' + new URLSearchParams(params).toString();
        fetch(url)
            .then((response) => {
                if(response.status === '200'){
                    return response.json();
                }
            }).then((data) =>{
        })
            .catch((err) => {
                console.log(err);

            });

    }


    getFormattedTime() {
        const today = new Date();
        const y = today.getFullYear();
        // JavaScript months are 0-based.
        const m = today.getMonth() + 1;
        const d = today.getDate();
        const h = today.getHours();
        const mi = today.getMinutes();
        const s = today.getSeconds();
        return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
    }


    render() {
        return (
            <div className="btn-wrapper">             
              <button type="button" id="memesaver" onClick={this.saveImageToDB} disabled={this.props.memeTitle ==""}>Meme generieren</button>
          </div>
            
        )
    }
}
export default SaveMemeComponent;