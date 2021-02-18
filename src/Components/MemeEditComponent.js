import React, { Component } from 'react';
import SaveMemeComponent from './SaveMemeComponent';
import UploadComponent from './UploadComponent';
import ShareComponent from './ShareComponent'
import { FaDownload, FaMicrophone } from 'react-icons/fa';

// Source SpeechRecording: 
// https://medium.com/@amanda.k.hussey/a-basic-tutorial-on-how-to-incorporate-speech-recognition-with-react-6dff9763cea5


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'de'

class MemeEditComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addButtonClicked: false,  
            base64Img: '',
            canvas:'',
            caption: '',
            color: 'black',
            drawnByHand: false,
            font: 'Arial',
            fontSize: '72px', 
            fontStyle: 'normal',
            fontWeight: 'normal',
            posX: 0,
            posY: 0,
            temporaryImg: '',
            textXCoord: 100,
            textYCoord: 100,
            saveButtonDisabled: true, 
            memeTitle: '',  
            listening: false,     
        }
         this._isMounted = false;
         this.toggleListen = this.toggleListen.bind(this)
         this.handleListen = this.handleListen.bind(this)
    }

    
    componentDidMount() {
        this._isMounted = true;

        const canvasMounted = document.createElement('canvas');
        this.setState({
            canvas: canvasMounted,
        }/*, this.drawMeme*/)


        const canvasHandDrawn = document.getElementById('handDrawnCanvas');

        canvasHandDrawn.addEventListener('mouseenter', this.setPosition)
        canvasHandDrawn.addEventListener('mousedown', this.setPosition)
        canvasHandDrawn.addEventListener('mousemove', this.drawLine)
        //document.getElementById("memesaver").disabled = true;
    }

    /** To fix warning: Can't perform a React state update on an unmounted component. This is a no-op, 
    but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous 
    tasks in the componentWillUnmount method.
    */
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps){
        if(this.props.selectedMeme.src !== prevProps.selectedMeme.src){
            document.getElementById('capInput').value = '';
            /** All previously typed in text gets deleted from the WYSIWYG 
                editor, so new text can be added and adjusted
            */
            this.setState({    
                addButtonClicked: false,  
                caption: '',
                color: 'black',
                drawnByHand: false,
                font: 'sans-serif',
                fontSize: '72px', 
                fontStyle: 'normal',
                fontWeight: 'normal',
                posX: 0,
                posY: 0,
                temporaryImg: this.props.selectedMeme.src, 
                textXCoord: 100,
                textYCoord: 100,
                saveButtonDisabled: true,
            })
        }      
    }

    drawMeme = () => {   
            
        const canvas = this.state.canvas;
        const ctx = canvas.getContext('2d');
            
        // Adjust the size of the canvas
        ctx.canvas.width = this.props.canvasWidth;
        ctx.canvas.height = this.props.canvasHeight;

        let createdImg = '';
        const img = new Image();
        img.crossOrigin = "anonymous";  // This enables CORS
        img.onload = async() => {
            ctx.drawImage(img, 0, 0, this.props.canvasWidth, this.props.canvasHeight);
            // context.font="italic small-caps bold 12px arial";
            ctx.font = this.state.fontStyle + ' normal ' + this.state.fontWeight + ' ' + this.state.fontSize + ' ' + this.state.font;
            ctx.fillStyle = this.state.color;
            ctx.fillText(this.state.caption, this.state.textXCoord, this.state.textYCoord);
            createdImg = await canvas.toDataURL();
            this.setState({ temporaryImg: createdImg }) // The link to the image (see img HTML below as an example)
        };

        if(this.state.addButtonClicked){
            img.src = this.state.base64Img;
        } else {
            img.src = this.props.selectedMeme.src;                
        } 
    }

    drawByHand = () => {  
        document.getElementById('capInput').value = '';

        const canvasHandDrawn = document.getElementById('handDrawnCanvas');
        const ctxHD = canvasHandDrawn.getContext('2d');
        canvasHandDrawn.style.display = 'block';

        this.setState({ drawnByHand: true })
        
        // Adjust the size of the canvas
        ctxHD.canvas.width = this.props.canvasWidth;
        ctxHD.canvas.height = this.props.canvasHeight;

        const imgHD = new Image();
        imgHD.crossOrigin = "anonymous";  // This enables CORS
        imgHD.onload = () => {
            ctxHD.drawImage(imgHD, 0, 0, this.props.canvasWidth, this.props.canvasHeight);
        };
        if(this.state.addButtonClicked){
            imgHD.src = this.state.base64Img;
        } else {
            imgHD.src = this.props.selectedMeme.src;                
        }  
    }

    drawLine = (event) => {
        const canvasHandDrawn = document.getElementById('handDrawnCanvas');
        const ctxHD = canvasHandDrawn.getContext('2d');

        if (event.buttons !== 1) return; // mouse must be hold clicked
        ctxHD.beginPath(); 
        ctxHD.lineWidth = 5;
        ctxHD.strokeStyle = this.state.color;
        ctxHD.moveTo(this.state.posX, this.state.posY);
        this.setPosition(event);
        ctxHD.lineTo(this.state.posX, this.state.posY); 
        ctxHD.stroke(); 
        ctxHD.closePath();
    }

    endDrawByHand = () => {
        const canvasHandDrawn = document.getElementById('handDrawnCanvas');
        canvasHandDrawn.style.display = 'none';
        document.getElementById('capInput').value = '';


        // Saves image with background image
        let drawnLine = ''
        drawnLine = canvasHandDrawn.toDataURL();
        this.setState({ 
            addButtonClicked: true, 
            base64Img: drawnLine, 
            drawnByHand: false, 
            temporaryImg: drawnLine 
        }) 
    }

    setPosition = (event) => {
        const offsetLeft = document.getElementById('handDrawnCanvas').getBoundingClientRect().left;
        const offsetTop = document.getElementById('handDrawnCanvas').getBoundingClientRect().top;
        this.setState({
            posX: event.clientX - offsetLeft,
            posY: event.clientY - offsetTop
        })
    }

    showCaption = (event) => { 
        console.log(event);
        if(this.state.drawnByHand === false){
            this.setState({ caption: document.getElementById('capInput').value });    
            this.drawMeme()    
        } else {
            alert('Hand drawing mode needs to closed first')
        }       
    }

    //Config of text formatting options
    boldFormatting = (event) => {
        const bold = this.state.fontWeight === 'normal' ? 'bold' : 'normal';
        this.setState({ fontWeight: bold });
        this.drawMeme()
    }
    italicFormatting = (event) => {
        const italic = this.state.fontStyle === 'normal' ? 'italic' : 'normal';
        this.setState({ fontStyle: italic });
        this.drawMeme()
    }
    font = (event) => {
        this.setState({ font: event.target.value });
        this.drawMeme()
    }
    fontSizeFormatting = (event) => {
        this.setState({ fontSize: event.target.value });
        this.drawMeme()
    }
    fontColorFormatting = (event) => {
        this.setState({ color: event.target.value });
        this.drawMeme();
    }

    moveLeft = () => {   
        this.setState((prevState) => ({
            textXCoord: prevState.textXCoord - 50
        }));
        this.drawMeme()
    }

    moveUp = () => {   
        this.setState((prevState) => ({
            textYCoord: prevState.textYCoord - 50
        }));
        this.drawMeme()
    }

    moveRight = () => {   
        this.setState((prevState) => ({
            textXCoord: prevState.textXCoord + 50
        }));
        this.drawMeme();
    }

    moveDown = () => {   
        this.setState((prevState) => ({
            textYCoord: prevState.textYCoord + 50
        }));
        this.drawMeme()
    }

    permanentlyAddCaption = () => {        
        document.getElementById('capInput').value = '';

        /** All previously typed in text gets deleted from the WSYWIG 
            editor, so new text can be added and adjusted
        */
        this.setState({
            addButtonClicked: true,
            base64Img: this.state.temporaryImg, 
            caption: '',
            textYCoord: this.state.textYCoord + 150
        }, this.drawMeme); // drawMeme is a callback here so setState is finished before drawMeme() is being called
    }

    //set the image name (the image name is not showing up in the browser, but it will be an attribute of the meme in the backend)
    changeMemeTitle = (event) => {
        if(event.target.value !== ""){
            document.getElementById("downloadBtn").style.pointerEvents = "auto";
        } else {
            document.getElementById("downloadBtn").style.pointerEvents = "none";
        }
        this.setState({ memeTitle: event.target.value });
        this.drawMeme();
    }

    toggleListen() {
        
        this.setState({
          listening: !this.state.listening
        }, this.handleListen)
        //ocument.getElementById('capInput').value = '';
        console.log(this.state.listening);
        document.getElementById('microphone-btn').classList.add("recording");
    }
    
    handleListen() {
        //document.getElementById('capInput').value ='';
        //console.log('listening?', this.state.listening)

        if (this.state.listening) {
            recognition.start()
            recognition.onend = () => {
            //console.log("...continue listening...")
            recognition.start()
            }

        } else {
            recognition.stop()
            recognition.onend = () => {
                document.getElementById('microphone-btn').classList.remove("recording");
            //console.log("Stopped listening per click")
            }
        }

        recognition.onstart = () => {
            //console.log("Listening!");
            //document.getElementById('capInput').value ='';
        }

        let finalTranscript = ''
        recognition.onresult = event => {

            for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) finalTranscript += transcript + ' ';
            }
            document.getElementById('capInput').value = finalTranscript;
            this.showCaption();

        //-------------------------COMMANDS------------------------------------

            const transcriptArr = finalTranscript.split(' ')
            const stopCmd = transcriptArr.slice(-3, -1)
            console.log('stopCmd', stopCmd)

            if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
            recognition.stop()
            recognition.onend = () => {
                document.getElementById('microphone-btn').classList.remove("recording");
                console.log('Stopped listening per command')
                const finalText = transcriptArr.slice(0, -3).join(' ')
                document.getElementById('capInput').value = finalText;
                this.showCaption();
                
            }
            }
        }
        
        //-----------------------------------------------------------------------
        
        recognition.onerror = event => {
            console.log("Error occurred in recognition: " + event.error)
        }
    
      }
    
    render() {
        let image;
        if(this.state.drawnByHand === false){
            if(this.state.temporaryImg.length < 7){
                image = <img id="selectedMeme" style={{width: this.props.canvasWidth, height: this.props.canvasHeight}} src={this.props.selectedMeme.src} alt="Can't be displayed" useMap="#planetmap" />
            } else {
                image = <img id="selectedMeme" style={{width: this.props.canvasWidth, height: this.props.canvasHeight}} src={this.state.temporaryImg} alt="Can't be displayed" useMap="#planetmap" />
            }    
        }
         
        return (
            <div>
            <input type="text" id="ImageCaption" placeholder="Image Title" name="ImageCaption" onChange={this.changeMemeTitle}></input><br></br>
                <div className="image" id="image">
                    {image}
                    <canvas id="handDrawnCanvas" style={{
                        zIndex: "3",
                        //top: "0px",
                        //left: "0px",
                        //position: "absolute",
                        display: "none",
                        width: this.props.canvasWidth,
                        height: this.props.canvasHeight,
                        margin: "auto"
                    }}></canvas>
                </div>
                <div>{this.state.showSavedImage}</div> {/*Dummy div*/}

                <div className="cap" id="cap" style={{
                    color: this.state.color,
                    fontSize: this.state.fontSize,
                    fontWeight: this.state.fontWeight,
                    fontStyle: this.state.fontStyle
                }}>
                </div>
                <button onClick={this.drawByHand}>Start hand drawing mode</button>
                <button onClick={this.endDrawByHand}>End hand drawing mode</button>
                <div className="Formatting">
                    <button onClick={this.boldFormatting}><strong>B</strong></button>
                    <button onClick={this.italicFormatting} ><em>I</em></button>
                    <select name="FontSize" onChange={this.fontSizeFormatting}>
                        <option value="84px">84</option>
                        <option value="72px">72</option>
                        <option value="64px">64</option>
                        <option value="32px">32</option>
                    </select>
                    <select name="Font" onChange={this.font}>
                        <option value="Arial">Arial</option>
                        <option value="Times">Times</option>
                        <option value="Andale Mono">Andale Mono</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                    </select>
                    <input type="color" onChange={this.fontColorFormatting}></input>
                    <button onClick={this.moveLeft}>&#8592;</button>
                    <button onClick={this.moveUp}>&#8593;</button>
                    <button onClick={this.moveRight}>&#8594;</button>
                    <button onClick={this.moveDown}>&#8595;</button>
                    <button onClick={this.permanentlyAddCaption}>Add text permanently to image</button>
                </div>
                

                <div id="capInputContainer" class="row">
                    <button id="microphone-btn"  onClick={this.toggleListen}><FaMicrophone /></button>
                    <input type="text" id="capInput" placeholder="Add text" name="capInput" onChange={this.showCaption}></input>       
                </div>

                <div className ="row">
                    <SaveMemeComponent editedMemeToSave={this.state.temporaryImg} memeTitle={this.state.memeTitle}/>
                    
                    <div className="btn-wrapper">  
                        <label >
                            <a href={this.state.temporaryImg} download id="downloadBtn"><FaDownload />Meme speichern</a>
                        </label>
                    </div>
                    <ShareComponent memeToShare={this.state.temporaryImg} memeTitle={this.state.memeTitle}></ShareComponent>
                </div>
                            
                

            </div>
        );
    }
}
export default MemeEditComponent;