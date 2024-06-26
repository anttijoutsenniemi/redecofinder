import React, { useState, useRef, useEffect } from 'react';
import InputField from './components/InputField';
import './App.css';
import ImageCapture from './components/ImageCapture';

export interface ChatMessage {
  id: number;
  type: 'user' | 'chatbot';
  text: string;
  imageArray?: string[],
  imageUploadMode?: boolean,
  options?: string[]; // Only present if type is 'chatbot'
}

export interface ChatOption {
  label: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Initial chat messages and options
    { id: 1, type: 'chatbot', text: 'Welcome! I am your Redecofinder assistant, here to help design your space with suitable furniture.', options: ['Help me find suitable furniture for my style'] },
  ]);
  const [furnitureClass, setFurnitureClass] = useState<string>('Chairs');
  const messageEnd = useRef<HTMLDivElement>(null);
  const [typingMode, setTypingMode] = useState<boolean>(false);
  const [typingPhase, setTypingPhase] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<string>("");
  const [refImage64, setRefImage64] = useState<string>("");
  const [refImage642, setRefImage642] = useState<string>("");
  const [refImage643, setRefImage643] = useState<string>("");

  const scrollToBottom = () => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  const updateImage = (img64 : string) => {
    //this is monkey solution but the updated state didnt render in an array based solution
    if(refImage64 && !refImage642){
      setRefImage642(img64);
    }
    else if(refImage642){
      setRefImage643(img64);
    }
    else{
      setRefImage64(img64);
    }

    setTimeout(() => { //timeout to let rendering happen first before autoscroll
      scrollToBottom();
    }, 50);
  }

  const uploadImage = () => {
    //here next upload image + other info to ai prompt
    //it might be beneficial to push img64 strings to array if we want to add multiple images
  }

  // Function to handle option click, send next
  const handleOptionClick = (option: string, userMessage? : string) => {
    const newUserMessage: ChatMessage = { id: messages.length + 1, type: 'user', text: (userMessage) ? userMessage : option }; //ternary to post usermessage as bubble when user types and sends

    let botResponseText : string = 'I am not coded that far yet';  // Default response text
    let imageArray : string[] = [];
    let options : string[] = [];
    let imageUploadMode : boolean = false;
    switch (option) {
        case 'Help me find suitable furniture for my style':
            botResponseText = 'Great! Can you describe to me in your own words what kind of space you are designing?';
            setTypingPhase(1);
            setTypingMode(true);
            break;
        case 'Space described':
            botResponseText = 'Got it! Can you next explain what kind of style you are looking for? (fe. colors and themes)';
            setTypingPhase(2);
            setTypingMode(true);
            break;
        case 'Style explained':
            botResponseText = 'Noted, what type of furniture are you looking for? Here are some options to choose from: ';
            /* 
            Here we start with categories: 
            1. Chairs = työtuolit + neuvottelu-asiakastauolit
            2. Sofas, armchairs and stools = sohvat, nojatuolit ja rahit
            3. Storage furniture = säilytyskalusteet
            4. Tables = sohva ja pikkupöydät + sähköpöydät + työpöydät + neuvottelupöydät
            5. Conference sets = neuvotteluryhmät
            */
            options = ['Chairs', 'Sofas, armchairs and stools', 'Tables', 'Conference sets', 'Storage fruniture']
            break;
        case 'Open built in camera':
            //code for opening camera
            botResponseText = "Add 1-3 reference image/images";
            imageUploadMode = true;
            options = ['Start again'];
            break;
        case 'No thank you, give me furniture suggestions that I can browse.':
            options = ['Start again'];
            break;
        case 'Start again':
            botResponseText = 'Welcome! I am your Redecofinder assistant, here to help design your space with suitable furniture.';
            options = ['Help me find suitable furniture for my style'];
            break;
        default:
            //when user selects furniture category
            const categories = ['Chairs', 'Sofas, armchairs and stools', 'Tables', 'Conference sets', 'Storage furniture'];
            if(categories.includes(option)){
              setFurnitureClass(option);
              botResponseText = `Sure, lets find ${option.toLowerCase()} to your liking. Would you like to provide me with reference image/images that I can look at for inspiration?`;
              options = ['Open built in camera', 'No thank you, give me furniture suggestions that I can browse straight away.'];
            }

            //default if user somehow fires function with no specific case
            else {
              botResponseText = 'I didnt understand your selection.';
              options = ['Start again'];
            }
            break;
    }

    const newBotMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'chatbot',
        text: botResponseText,
        imageUploadMode: imageUploadMode,
        imageArray: imageArray,
        options: options
    };

    setMessages([...messages, newUserMessage, newBotMessage]);
};

function toggleDrawer() {
  const drawer : any = document.getElementById('drawer');
  drawer.classList.toggle('open');
}

//func for receiving input from user typing
const receiveInput = (input : string) => {
  //typingPhase tells us to which part of the ai dialog this input is used for 1=describe the space, 2=describe style, 3=needs
  if(typingPhase === 1){
    setChatHistory('1. User describing space: ' + input);
    handleOptionClick('Space described', input);
  }
  else if(typingPhase === 2){
    setChatHistory(prevHistory => prevHistory + '2. User describing style he/she is looking for: ' + input);
    handleOptionClick('Style explained', input);
    setTypingMode(false);
  }
  else if(typingPhase === 3){
    setChatHistory(prevHistory => prevHistory + '3. User describing needs for the furniture: ' + input);
    setTypingPhase(0);
    setTypingMode(false);
  }
}

const addImageCaptureComponent = () => {

}

  return (
    <div className="chat-app-background">
    <div className='screen-wrapper'>
    <div className='app-header'><h1 className='header-title'>ReDecoFinder assistant</h1>
        <div className='hamburger-menu' onClick={()=>toggleDrawer()}>
          &#9776;
        </div>
        </div>
        <div className='drawer' id='drawer'>
        <button className='close-button' onClick={()=>toggleDrawer()}>Close &times;</button>
          <a href={`https://google.com`}>
            <div className='modal-option-button' style={{color: 'white', marginTop: 10}}>Open Google</div>
          </a>
        </div>
      <div className="chat-wrapper">
      {messages.map((message) => (
      <div key={message.id} className={`chat-message ${message.type}`}>
        {message.type === 'chatbot' && (
          <div className="chat-content">
            <img src="/icon.png" alt="Chatbot" className="chatbot-profile" />
            <div>
              <div className="chat-bubble" ref={messageEnd}>{message.text}</div>
              { //paste recommendation images array
                message.imageArray && message.imageArray.length > 0 && (
                message.imageArray.map((image, index) => (
                  <div key={index}>
                      <img src={`${image}`} alt='Furniture recommendation'/>
                  </div>
                ))
                )
              }

              { //paste imageupload compo
                message.imageUploadMode && 
                (
                  <div style={{ flexDirection: 'column', marginTop: 10 }}>
                  
                  { refImage64 && (
                    <img src={refImage64} alt="Captured" style={{marginTop: 10, marginBottom: 10, maxWidth: 200}}/>
                  )}
                  { refImage642 && (
                    <img src={refImage642} alt="Captured" style={{marginTop: 10, marginBottom: 10, maxWidth: 200}}/>
                  )}
                  { refImage643 && (
                    <img src={refImage643} alt="Captured" style={{marginTop: 10, marginBottom: 10, maxWidth: 200}}/>
                  )}
                  { !refImage643 && (
                    <div style={{marginTop: 10}}><ImageCapture updateImage={updateImage}/></div>
                  )}
                  
                  <button style={{marginTop: 20}} className='green-upload-button' onClick={() => uploadImage()}>Send image/images</button>
                  <div ref={messageEnd}></div>
                  </div>
                )
              }

              {
                (message.options && message.id === messages.length) //only render options on the last message so user cant click previous options
                ? 
                <>
                  <div className="chat-options">
                    {message.options.map((option, index) => (
                      <button key={index} onClick={() => handleOptionClick(option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                </>
                : null
              }
            </div>
          </div>
        )}
        {message.type === 'user' && (
          <div className="chat-content">
            <div className="chat-bubble">{message.text}</div>
          </div>
        )}
      </div>
    ))}
      {typingMode && (
        <InputField receiveInput={receiveInput}/>
      )}

      
      </div>
      </div>
    </div>
  );
};

export default App;