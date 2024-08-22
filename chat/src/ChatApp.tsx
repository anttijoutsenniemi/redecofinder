import React, { useState, useRef, useEffect } from 'react';
import InputField from './components/InputField';
import './App.css';
import ImageCapture from './components/ImageCapture';
import { fetchInterPretationWithReference, fetchInterPretationWithSpaceImg } from './components/Aihandler';
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
  setSpaceImageMode: (value: boolean) => void;
  setAiJson: (value: any) => void;
}

const ChatApp: React.FC<ChildComponentProps> = ({ appStates, navigateHandler, phaseNumber, setModalOpen, setTypingMode, setLoading, setMessages, setFurnitureClass,
  setImagesSent, setTypingPhase, setChatHistoryDirect, setErrorMessage, setRecommendations,
  setRefImage64, setRefImage642, setRefImage643, setSelectedProduct, setSpaceImageMode, setAiJson }) => {

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

  const uploadImage = async (furnitureClass? : string) => {
    try {
      setLoading(true);
      setImagesSent(true);

      let aiJson : any;
      let arrayOfObjects : any;
      if(appStates.aiJson && furnitureClass){ //this should trigger if user wants to find more products after already getting the first set of recommendations
        aiJson = appStates.aiJson;
        arrayOfObjects = await fetchFurnitureData(furnitureClass);
      }
      else{ //this should trigger if its the first time user wants product recommendations
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
  
        let aiJsonUnParsed;
        if(appStates.spaceImgMode){ //we use ai prompt with images of the space
          aiJsonUnParsed = await fetchInterPretationWithSpaceImg(refImageArray);
        }
        else{ //we use ai prompt with user typed data + ref images
          let userFilledData : string = "";
  
          for(let i = 0; i < appStates.chatHistory.length; i++){
            userFilledData += appStates.chatHistory[i] + " ";
          }
          
          aiJsonUnParsed = await fetchInterPretationWithReference(userFilledData, refImageArray);
        }
  
        aiJson = JSON.parse(aiJsonUnParsed);
        setAiJson(aiJson);
        arrayOfObjects = await fetchFurnitureData(appStates.furnitureClass);
      }
      
      let botAnswr : string = aiJson.explanation;  
  
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
    
        // Select top 3 matches
        const top3Matches = sortedObjects.slice(0, 3).map((item : any) => item.object);
        setRecommendations(top3Matches);
        // handleOptionClick('recommendations', 'Show me the recommendations please', top3Matches, botAnswr);
        handleOptionClick('suositukset', 'Voisitko näyttää minulle huonekalusuositukset?', top3Matches, botAnswr);
        //here next show the 3 results to user: handleoptionclick where images go to imagearray
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
    let newArr = getRandomElements(arrayOfObjects, 3);
    
    //handleOptionClick('recommendations', 'Show me the recommendations please', newArr, 'Here are some random recommendations as promised:')
    handleOptionClick('suositukset', 'Voisitko näyttää minulle huonekalusuosituket?', newArr, 'Tässä on satunnaisia suosituksia kujten lupasin:')
  }

  // Function to handle option click, send next
  const handleOptionClick = (option: string, userMessage? : string, recommendations? : CompareObject[], botAnswr?: string) => {
    const newUserMessage: ChatMessage = { id: appStates.messages.length + 1, type: 'user', text: (userMessage) ? userMessage : option }; // ternäärinen ehto lähettää käyttäjän viestin kuplana, kun käyttäjä kirjoittaa ja lähettää

    let botResponseText : string = 'Hetkinen...';  // Oletusvastausteksti, korvataan tapauskohtaisesti
    let options : string[] = [];
    let imageUploadMode : boolean = false;
    let recommendationArray : CompareObject[] = [];
    let nextPageNumber : number;
    switch (option) {
        case '1. Etsi huonekaluja käyttämällä kuvia tilasta':
            botResponseText = 'Tottakai! Minkä tyyppisiä huonekaluja etsitään?';
            options = ['1. Tuolit', '2. Sohvat, nojatuolit ja rahit', '3. Pöydät', '4. Neuvotteluryhmät', '5. Säilytyskalusteet'];
            nextPageNumber = phaseNumber + 1;
            break;
        case '2. Etsi huonekaluja täyttämällä koko tyylikysely':
            botResponseText = 'Hienoa, aloitetaan! Voitko kuvailla omin sanoin millaista tilaa suunnittelet?';
            setTypingPhase(1);
            setTypingMode(true);
            nextPageNumber = phaseNumber + 1;
            break;
        case 'Tila kuvailtu':
            botResponseText = 'Selvä! Voitko seuraavaksi kertoa, millaista tyyliä haet? (esim. värit ja teemat)';
            setTypingPhase(2);
            setTypingMode(true);
            nextPageNumber = phaseNumber + 1;
            break;
        case 'Tyyli kuvailtu':
            botResponseText = 'Ymmärretty, minkä tyyppisiä huonekaluja etsit? Tässä muutamia vaihtoehtoja:';
            options = ['Tuolit', 'Sohvat, nojatuolit ja rahit', 'Pöydät', 'Neuvotteluryhmät', 'Säilytyskalusteet'];
            nextPageNumber = phaseNumber + 1;
            break;
        case 'Lisää kuvia':
            botResponseText = "Lisää 1-3 referenssikuvaa";
            setSpaceImageMode(false);
            imageUploadMode = true;
            nextPageNumber = phaseNumber + 1;
            break;
        case 'Lisää kuva/kuvia tilasta':
            botResponseText = "Lisää 1-3 kuvaa tilasta";
            setSpaceImageMode(true);
            imageUploadMode = true;
            nextPageNumber = phaseNumber + 1;
            break;
        case 'suositukset':
            if(botAnswr && recommendations){ 
              botResponseText = botAnswr + " Löysin nämä suositukset, jotka sopivat parhaiten tyyliisi:";
              recommendationArray = recommendations;
              setLoading(false);
            }
            else{
              botResponseText = 'En ymmärtänyt valintaasi.'
            }
            
            options = ['Aloita alusta', 'Etsitään lisää huonekaluja eri kategoriasta'];
            nextPageNumber = phaseNumber + 1;
            break;
        case 'Ei kiitos, anna minulle satunnaisia ehdotuksia, joita voin selata heti.':
            botResponseText = 'Selvä, odota hetki, valitsen sinulle kolme satunnaista huonekalu ehdotusta...';
            getRandomRecommendations();
            nextPageNumber = phaseNumber + 1;
            break;
        case 'Etsitään lisää huonekaluja eri kategoriasta':
            botResponseText = 'Selvä, mitä kategoriaa etsitään?';
            options = ['Tuolit', 'Sohvat, nojatuolit ja rahit', 'Pöydät', 'Neuvotteluryhmät', 'Säilytyskalusteet'];
            nextPageNumber = phaseNumber + 1;
            break;
        case 'Aloita alusta':
            botResponseText = 'Tervetuloa! Olen Redecofinder AI-avustajasi, ja autan sinua suunnittelemaan tilaasi sopivilla käytetyillä huonekaluilla. Voit jatkaa valitsemalla 1: saat suosituksia nopeasti ja helposti käyttämällä kuvia suunnittelemastasi tilasta. 2: täytä koko tyylikysely, jossa löydämme sinulle sopivat huonekalut yhdessä.';
            options = ['1. Etsi huonekaluja käyttämällä kuvia tilasta', '2. Etsi huonekaluja täyttämällä koko tyylikysely'];
            nextPageNumber = phaseNumber + 1;
            break;
        default:
            //kun käyttäjä valitsee huonekalukategorian
            const categories = ['Tuolit', 'Sohvat, nojatuolit ja rahit', 'Pöydät', 'Neuvotteluryhmät', 'Säilytyskalusteet'];
            const categories2 = ['1. Tuolit', '2. Sohvat, nojatuolit ja rahit', '3. Pöydät', '4. Neuvotteluryhmät', '5. Säilytyskalusteet'];

            if(categories.includes(option)){
              const words = option.split(' ').filter(word => /^[A-Za-z,]+$/.test(word));
              const firstWord = words[0].replace(/[^A-Za-z]/g, '').toLowerCase();
              setFurnitureClass(firstWord);
              if(appStates.aiJson){
                uploadImage(firstWord);
                nextPageNumber = phaseNumber + 1;
              }
              else{
                botResponseText = `Selvä, etsitään ${option.toLowerCase()} toiveittesi mukaan. Haluatko antaa minulle referenssikuvan/kuvia, joita voin katsoa inspiraatioksi?`;
                options = ['Lisää kuvia', 'Ei kiitos, anna minulle satunnaisia ehdotuksia, joita voin selata heti.'];
                nextPageNumber = phaseNumber + 1;
              }
            }
            else if(categories2.includes(option)){
              const words = option.split(' ').filter(word => /^[A-Za-z,]+$/.test(word));
              const firstWord = words[0].replace(/[^A-Za-z]/g, '').toLowerCase();
              setFurnitureClass(firstWord);
              botResponseText = `Selvä, etsitään ${firstWord} toiveittesi mukaan. Haluatko antaa minulle kuvan/kuvia suunnittelemastasi tilasta, jotta voin löytää sopivat ${firstWord}?`;
              options = ['Lisää kuva/kuvia tilasta', 'Ei kiitos, anna minulle satunnaisia ehdotuksia, joita voin selata heti.'];
              nextPageNumber = phaseNumber + 1;
            }

            //oletusarvo, jos käyttäjä jollain tapaa suorittaa toiminnon ilman tiettyä tapausta
            else {
              botResponseText = 'Valinnan käsittelyssä tapahtui virhe';
              options = ['Aloita alusta'];
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
      // handleOptionClick('Space described', input);
      handleOptionClick('Tila kuvailtu', input);
      setErrorMessage('');
    }
    else if(appStates.typingPhase === 2){
      historyArrayMessages[1] = '2. User describing style he/she is looking for: ' + input;
      setChatHistoryDirect(historyArrayMessages);
      // handleOptionClick('Style explained', input);
      handleOptionClick('Tyyli kuvailtu', input);
      setTypingMode(false);
      setErrorMessage('');
    }
    // this is since 22.8.24 redacted and should not trigger
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
    <div className='app-header'><h1 className='header-title'>ReDecoFinder avustaja</h1>
        <div className='hamburger-menu' onClick={()=>toggleDrawer()}>
          &#9776;
        </div>
        </div>
        <div className='drawer' id='drawer'>
        <button className='close-button' onClick={()=>toggleDrawer()}>Sulje &times;</button>
          <a href={clientPublic.webStoreUrl}>
            <div className='modal-option-button' style={{color: 'white', marginTop: 10}}>Avaa {clientPublic.webStoreName} verkkokauppa</div>
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

export default ChatApp;