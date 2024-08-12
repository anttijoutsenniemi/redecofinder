import React, { useState, useRef, useEffect } from 'react';
import InputField from './components/InputField';
import './App.css';
import ImageCapture from './components/ImageCapture';
import { fetchInterPretationWithReference } from './components/Aihandler';
import { fetchFurnitureData } from './components/ApiFetches';
import clientPublic from './assets/clientPublic.json';
import ProductCard from './components/Products';
import Modal from './components/Modal';
import { AppStates } from './App';
import { useNavigate } from 'react-router';
import { quantum } from 'ldrs';
import type {} from 'ldrs';
quantum.register();


export interface ChatMessage {
  id: number;
  type: 'user' | 'chatbot';
  text: string;
  recommendationArray?: CompareObject[],
  imageUploadMode?: boolean,
  options?: string[]; // Only present if type is 'chatbot'
}

export interface ChatOption {
  label: string;
}

export type StyleObject = {
  nonValidImage?: boolean;
  explanation?: string;
  colorThemes: {
    [key: string]: number;
  };
  designStyles: {
    [key: string]: number;
  };
};

export type CompareObject = {
  _id: any;
  picUrl: string;
  title: string;
  productUrl: string;
  quantity?: string;
  price?: string;
  deleted: boolean;
  styleJson: StyleObject;
};

interface ChildComponentProps {
  appStates: AppStates;
  navigateHandler: (sourcePhase: number) => void;
  phaseNumber: number;
  setModalOpen: (value: boolean) => void;
  setTypingMode: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setFurnitureClass: (furnitureClass: string) => void;
  setImagesSent: (value: boolean) => void;
  setTypingPhase: (value: number) => void;
  setChatHistory?: (updater: (prevHistory: string[]) => string[]) => void;
  setChatHistoryDirect: (value: string[]) => void;
  setErrorMessage: (value: string) => void;
  setRecommendations: (value: string) => void;
  setRefImage64: (value: string) => void;
  setRefImage642: (value: string) => void;
  setRefImage643: (value: string) => void;
  setSelectedProduct: (product: null | CompareObject) => void;
}

const App1: React.FC<ChildComponentProps> = ({ appStates, navigateHandler, phaseNumber, setModalOpen, setTypingMode, setLoading, setMessages, setFurnitureClass,
  setImagesSent, setTypingPhase, setChatHistoryDirect, setErrorMessage, setRecommendations,
  setRefImage64, setRefImage642, setRefImage643, setSelectedProduct }) => {

  const navigate = useNavigate();

  const openModal = (product : CompareObject) => {
    setModalOpen(true);
    setSelectedProduct(product);
  }
  const closeModal = () => setModalOpen(false);

  const scrollToBottom = () => {
    appStates.messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [appStates.messages]); 

  //&_&
  const updateImage = (img64 : string) => {
    setImagesSent(false);
    //this is monkey solution but the updated state didnt render in an array based solution
    if (!appStates.refImage64 || appStates.refImage64 === '') {
      setRefImage64(img64);
    } else if (!appStates.refImage642 || appStates.refImage642 === '') {
      setRefImage642(img64);
    } else {
      setRefImage643(img64);
    }

    setTimeout(() => { //timeout to let rendering happen first before autoscroll
      scrollToBottom();
    }, 50);
  }

  const uploadImage = async () => {
    try {
      setLoading(true);
      setImagesSent(true);

      let refImageArray : string[] = [];
      if (appStates.refImage64) {
        refImageArray.push(appStates.refImage64);
      }
      
      if (appStates.refImage642) {
        refImageArray.push(appStates.refImage642);
      }
      
      if (appStates.refImage643) {
        refImageArray.push(appStates.refImage643);
      }

      let userFilledData : string = "";
      for(let i = 0; i < appStates.chatHistory.length; i++){
        userFilledData += appStates.chatHistory[i] + " ";
      }
      
      let aiJson1 = await fetchInterPretationWithReference(userFilledData, refImageArray);
      let aiJson = JSON.parse(aiJson1);
      let botAnswr : string = aiJson.explanation;
  
      let arrayOfObjects = await fetchFurnitureData(appStates.furnitureClass);  
  
      // Function to flatten the object
      const flattenObject = (obj: StyleObject): number[] => {
        const colorThemes = obj.colorThemes ? Object.values(obj.colorThemes) : [];
        const designStyles = obj.designStyles ? Object.values(obj.designStyles) : [];
        return [...colorThemes, ...designStyles];
      };
  
      // Calculate Euclidean distance
      const calculateDistance = (obj1: StyleObject, obj2: StyleObject): number => {
        const values1 = flattenObject(obj1);
        const values2 = flattenObject(obj2);
        //console.log(values1, values2);
        return Math.sqrt(values1.reduce((sum, value, index) => sum + Math.pow(value - values2[index], 2), 0));
      };
  
      // Compute distances
        const distances = arrayOfObjects.map((obj : any, index : number) => {
          const distance = calculateDistance(aiJson, obj.styleJson);
          return {
            distance,
            object: obj
          };
        });
        //console.log(distances);
    
        // Sort by distance
        const sortedObjects = distances.sort((a : any, b : any) => a.distance - b.distance);
    
        // Select top 10 matches
        const top10Matches = sortedObjects.slice(0, 10).map((item : any) => item.object);
        setRecommendations(top10Matches);
        handleOptionClick('recommendations', 'Show me the recommendations please', top10Matches, botAnswr);
        //here next show the 10 results to user: handleoptionclick where images go to imagearray
        //add other elements to jsx like price and avaialabity
      
    } catch (error) {
      console.log(error);
      setErrorMessage('An unexpected error occured fetching AI response');
    }
  }

  function getRandomElements(arr : any, count : number) {
    const shuffled = arr.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Get the first `count` elements
  }

  const getRandomRecommendations = async () => {
    let arrayOfObjects = await fetchFurnitureData(appStates.furnitureClass);
    let newArr = getRandomElements(arrayOfObjects, 10);
    handleOptionClick('recommendations', 'Show me the recommendations please', newArr, 'Here are some random recommendations as promised:')
  }

  // Function to handle option click, send next
  const handleOptionClick = (option: string, userMessage? : string, recommendations? : CompareObject[], botAnswr?: string) => {
    const newUserMessage: ChatMessage = { id: appStates.messages.length + 1, type: 'user', text: (userMessage) ? userMessage : option }; //ternary to post usermessage as bubble when user types and sends

    let botResponseText : string = 'I am not coded that far yet';  // Default response text
    let options : string[] = [];
    let imageUploadMode : boolean = false;
    let recommendationArray : CompareObject[] = [];
    let nextPageNumber : number;
    switch (option) {
        case 'Help me find suitable furniture for my style':
            botResponseText = 'Great! Can you describe to me in your own words what kind of space you are designing?';
            setTypingPhase(1);
            setTypingMode(true);
            nextPageNumber = 1;
            break;
        case 'Space described':
            botResponseText = 'Got it! Can you next explain what kind of style you are looking for? (fe. colors and themes)';
            setTypingPhase(2);
            setTypingMode(true);
            nextPageNumber = 2;
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
            nextPageNumber = 3;
            break;
        case 'Add images':
            botResponseText = "Add 1-3 reference image/images";
            imageUploadMode = true;
            options = ['Start again'];
            nextPageNumber = 5;
            break;
        case 'recommendations':
            if(botAnswr && recommendations){ 
              botResponseText = botAnswr + " I found these recommendations best suited for your style:";
              recommendationArray = recommendations;
              setLoading(false);
            }
            else{
              botResponseText = 'I did not understand your selection.'
            }
            
            options = ['Start again'];
            nextPageNumber = 6;
            break;
        case 'No thank you, give me random suggestions that I can browse straight away.':
            botResponseText = 'Alright, give me a second as I pick 10 table suggestions for you at random...';
            getRandomRecommendations();
            nextPageNumber = 5;
            break;
        case 'Start again':
            botResponseText = 'Welcome! I am your Redecofinder assistant, here to help design your space with suitable furniture.';
            options = ['Help me find suitable furniture for my style'];
            nextPageNumber = 0;
            break;
        default:
            //when user selects furniture category
            const categories = ['Chairs', 'Sofas, armchairs and stools', 'Tables', 'Conference sets', 'Storage furniture'];
            if(categories.includes(option)){
              const words = option.split(' ');
              const firstWord = words[0].toLowerCase();
              setFurnitureClass(firstWord);
              botResponseText = `Sure, lets find ${option.toLowerCase()} to your liking. Would you like to provide me with reference image/images that I can look at for inspiration?`;
              options = ['Add images', 'No thank you, give me random suggestions that I can browse straight away.'];
              nextPageNumber = 4;
            }

            //default if user somehow fires function with no specific case
            else {
              botResponseText = 'An error occured processing your selection';
              options = ['Start again'];
              nextPageNumber = 0;
            }
            break;
    }

    const newBotMessage: ChatMessage = {
        id: appStates.messages.length + 2,
        type: 'chatbot',
        text: botResponseText,
        imageUploadMode: imageUploadMode,
        recommendationArray: recommendationArray,
        options: options
    };

    setMessages([...appStates.messages, newUserMessage, newBotMessage]);

    if(nextPageNumber === 0){
      navigate('/');
    }
    else {
      navigateHandler(phaseNumber);
      navigate(`/${nextPageNumber}`);
    }
};

function toggleDrawer() {
  const drawer : any = document.getElementById('drawer');
  drawer.classList.toggle('open');
}

//func for receiving input from user typing
const receiveInput = (input : string) => {
  if(input.length < 1 || !input){
    setErrorMessage("Im sorry but I do not understand empty messages");
  }
  else{
    //typingPhase tells us to which part of the ai dialog this input is used for 1=describe the space, 2=describe style, 3=needs
    let historyArrayMessages : string[] = appStates.chatHistory;
    if(appStates.typingPhase === 1){
      historyArrayMessages[0] = '1. User describing space: ' + input;
      setChatHistoryDirect(historyArrayMessages);
      handleOptionClick('Space described', input);
      setErrorMessage('');
    }
    else if(appStates.typingPhase === 2){
      historyArrayMessages[1] = '2. User describing style he/she is looking for: ' + input;
      setChatHistoryDirect(historyArrayMessages);
      handleOptionClick('Style explained', input);
      setTypingMode(false);
      setErrorMessage('');
    }
    else if(appStates.typingPhase === 3){
      historyArrayMessages[2] = '3. User describing needs for the furniture: ' + input;
      setChatHistoryDirect(historyArrayMessages);
      setTypingPhase(0);
      setTypingMode(false);
      setErrorMessage('');
    }
  }
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
          <a href={clientPublic.webStoreUrl}>
            <div className='modal-option-button' style={{color: 'white', marginTop: 10}}>Open {clientPublic.webStoreName} ecom store</div>
          </a>
        </div>
      <div className="chat-wrapper">
      {appStates.messages.map((message) => (
      <div key={message.id} className={`chat-message ${message.type}`}>
        {message.type === 'chatbot' && (
          <div className="chat-content">
            <img src="/icon.png" alt="Chatbot" className="chatbot-profile" />
            <div>
              <div className="chat-bubble" ref={appStates.messageEnd}>{message.text}</div>

              { //paste recommendation products
                message.recommendationArray && message.recommendationArray.length > 0 && (
                  <>
                    <ProductCard products={message.recommendationArray} onCardClick={openModal}/>
                    <Modal title='Select from options below' product={appStates.selectedProduct} isOpen={appStates.modalOpen} onClose={closeModal}/>
                  </>
                )
              }

              { //paste imageupload compo
                message.imageUploadMode &&
                (
                  <div style={{ flexDirection: 'column', marginTop: 10 }}>
                  { appStates.refImage64 && (
                    <div className="x-image-container">
                      <img src={appStates.refImage64} alt="Captured" style={{ maxWidth: 200 }} />
                      <button
                        className="x-image-button"
                        onClick={() => setRefImage64('')}
                      >
                        X
                      </button>
                    </div>
                  )}
                  { appStates.refImage642 && (
                    <div className="x-image-container">
                      <img src={appStates.refImage642} alt="Captured" style={{ maxWidth: 200 }} />
                      <button
                        className="x-image-button"
                        onClick={() => setRefImage642('')}
                      >
                        X
                      </button>
                    </div>
                  )}
                  { appStates.refImage643 && (
                    <div className="x-image-container">
                      <img src={appStates.refImage643} alt="Captured" style={{ maxWidth: 200 }} />
                      <button
                        className="x-image-button"
                        onClick={() => setRefImage643('')}
                      >
                        X
                      </button>
                    </div>
                  )}
                  {((appStates.refImage64 && appStates.refImage642 && appStates.refImage643) || appStates.imagesSent)
                    ? null
                    : <div style={{marginTop: 10}}><ImageCapture updateImage={updateImage}/></div>
                  }
                  { (appStates.refImage64 && !appStates.imagesSent)
                  ? <div style={{float: 'none'}}><button style={{marginTop: 20}} className='green-upload-button' onClick={() => uploadImage()}>Send image/images</button></div>
                  : null
                  }
                  <div ref={appStates.messageEnd}></div>
                  </div>
                )
              }

              {
                (message.options && message.id === appStates.messages.length) //only render options on the last message so user cant click previous options
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
      {appStates.loading && ( 
        <div className='loadingWrapper'>
          <l-quantum size={60} color={'#2196f3'} speed={3}></l-quantum>
          <p>Hold on tight as I analyze your data and find best furniture for your style...</p>
        </div>
      )}
      {appStates.errorMessage && (
        <div><p style={{color: 'red'}}>{appStates.errorMessage}</p></div>
      )}
      {appStates.typingMode && (
        <InputField receiveInput={receiveInput}/>
      )}
      
      </div>
      </div>
    </div>
  );
};

export default App1;