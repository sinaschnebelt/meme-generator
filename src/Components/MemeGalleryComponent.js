import React, { Component } from 'react';
import MemeEditComponent from "./MemeEditComponent";
import UploadComponent from './UploadComponent';


//import image from '../Images/img1.jpg';
/*
The MIT License (MIT)

Copyright (c) 2015-2018 Sandra Gonzales
https://github.com/neptunian/react-photo-gallery/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

Gallery is a responsive, accessible, composable, and customizable image gallery component which
maintains the original aspect ratio of your photos. Supports row or column direction layout. It also
provides an image renderer for custom implementation of things like image selection, favorites, captions, etc.
*/
import Gallery from 'react-photo-gallery';

class MemeGalleryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            memes: [],
            selectedMeme: null,
            canvasWidth: 500,
            canvasHeight: 500,
            memesToMerge: []
        }
    }


    /*Currently memes are loaded from imgflip-API and stored in a local array (memes[]) with their url, width height
      TODO: store memes with name & id*/
    componentDidMount() {
        fetch('https://api.imgflip.com/get_memes')
            .then(response => response.json())
            .then(
                (result) => {

                    const memesArray = [];
                    const arr = result.data.memes;
                    arr.forEach(meme => {
                        const obj =
                            {
                                src: meme.url,
                                width: meme.width,
                                height: meme.height
                            }
                        if (memesArray.length < 10) {
                            memesArray.push(obj)
                        }
                    })

                    this.setState({
                        isLoaded: true,
                        memes: memesArray,
                        selectedMeme: memesArray[0]
                    });

                    document.getElementById('selectedMeme').addEventListener('mousedown', this.setPosition)
                },

                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    //enlarge clicked iumage from Galery or an image uploaded from the user
    enlargeImage = (obj) => {
    	const memesToMerge = [this.state.selectedMeme];
    	let temp = {
            src: obj.src,
            width: obj.width,
            height: obj.height,
            name: obj.name
        }

    	if(!this.state.appendImage){
	        this.setState({selectedMeme: temp});	
    	} else {
    		document.getElementById('selectedMeme').style.cursor = "initial";
    		memesToMerge.push(temp);
    		this.setState({
    			memesToMerge: memesToMerge,
    			appendImage: false
    		}, this.memePromises)	
    	}       
    }

    memePromises = () => {

    	const memesToMerge = this.state.memesToMerge;
    	const promises = []
    	
    	for(let i=0; i<2; i++){
    		promises.push(this.mergeImages(memesToMerge[i], i))	
    	}

    	Promise.all(promises).then((values) => {
  			const newImageSrc = document.getElementById('testCanvas').toDataURL();
	    	this.setState({selectedMeme: {src: newImageSrc }}); 
		});
	}

    loadImage = (url) => {
    	return new Promise((resolve, reject) => {
    		const img = new Image();
    		img.crossOrigin = "anonymous";  // This enables CORS
	        img.onload = () => resolve(img);
	        img.onerror = () => reject(new Error('Loading failed'));
	        img.src = url;   
    	})
    }

    mergeImages = (options, i) => { 		
 		const canvas = document.getElementById('testCanvas');
 		const ctx = canvas.getContext('2d');
 		//canvas.style.display = 'block';
 		ctx.canvas.width = this.state.canvasWidth*2;
        ctx.canvas.height = this.state.canvasHeight*2;

 		return this.loadImage(options.src)
	 		.then(img => {
	 			if(i === 0){
	 				ctx.drawImage(img, 0, 0, this.state.canvasWidth*2, this.state.canvasHeight*2); 	
	 			} else {
	 				ctx.drawImage(img, this.state.posX, this.state.posY); 	
	 			}
	            
	 		}) 
    } 

    appendImage = () => {
    	alert("Click on the enlarged meme to select the position where to append the new meme and then choose the meme to append from the Gallery")
    	document.getElementById('selectedMeme').style.cursor = "pointer";
    	this.setState({ appendImage: true})
    }

    setPosition = (event) => {
        const offsetLeft = document.getElementById('selectedMeme').getBoundingClientRect().left;
        const offsetTop = document.getElementById('selectedMeme').getBoundingClientRect().top;
        this.setState({
            posX: event.clientX - offsetLeft,
            posY: event.clientY - offsetTop
        })
    }



    //TODO: make page endless scroll?
    showmoreMemes = (event) => {
        const sampleMemes = [];

        fetch('/samplememes', {
            mode: 'cors',
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(response => response.json())
            .then(data => {

                for (var i in data) {
                    const obj = {
                        src: data[i].url,
                        width: data[i].width,
                        height: data[i].height
                    }
                    sampleMemes.push(obj);
                }

                this.setState({
                    isLoaded: true,
                    memes: sampleMemes,
                    selectedMeme: sampleMemes[0]
                });
            });
    }

    setWidth = (event) => {
    	const num = parseInt(event.target.value)
    	if(isNaN(num)){
    		alert("Enter a valid number")
    	} else {
    		this.setState({canvasWidth: num})	
    	}
    	
    }

    setHeight = (event) => {
    	const num = parseInt(event.target.value)
    	if(isNaN(num)){
    		alert("Enter a valid number")
    	} else {
    		this.setState({canvasHeight: num})
    	}
    }

    imageUploaded = (uploadedImage) => {
    	this.setState({selectedMeme: uploadedImage})
    }



    render() {
        const { error, memes, selectedMeme, isLoaded } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {

            return (
                <div className="container" width="300px">
                    <h1>OMM Exercise 1</h1>
                    <div className="App">
                    	 <canvas id="testCanvas" style={{
	                        zIndex: "1",
	                        display: "none",
	                        width: this.state.canvasWidth,
	                        height: this.state.canvasHeight,
	                        margin: "auto"
	                    }}></canvas>
                        <MemeEditComponent selectedMeme={selectedMeme} canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight}/>
                        {/*<button onClick={this.appendImage}>Append another image</button>*/}
                        <div className="row">
                            <input type="text" placeholder="Set canvas width in pixel e.g. 300" onChange={this.setWidth} ></input>
                            <input type="text" placeholder="Set canvas height in pixel e.g. 300" onChange={this.setHeight}></input>
                            <UploadComponent imageUploaded={this.imageUploaded} />
                        </div>
                        

                    </div>
                    <div className="galleryContainer">
                        <button type="button" id="samplememes" onClick={this.showmoreMemes}>Show more memes</button>
                        <Gallery photos={memes} onClick={(event) => this.enlargeImage(event.target)} margin={5}/>
                    </div>
                </div>
            );
        }
    }
}
export default MemeGalleryComponent;