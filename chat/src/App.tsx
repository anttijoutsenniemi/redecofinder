import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import Phase1 from './../src/components/Phase1_experimental';
import Phase2 from './../src/components/Phase2_experimental';
import App1 from './App1';
import useNavigationDetection from './components/NavigationDetecter';

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

  export interface AppStates {
    messages: ChatMessage[];
    furnitureClass: string;
    messageEnd: React.RefObject<HTMLDivElement>;
    typingMode: boolean;
    loading: boolean;
    imagesSent: boolean;
    typingPhase: number;
    chatHistory: string[];
    errorMessage: string;
    recommendations: string;
    refImage64: string;
    refImage642: string;
    refImage643: string;
    modalOpen: boolean;
    selectedProduct: null | CompareObject;
  }

  export interface StateHistory {
    phase: number;
    states: AppStates;
  }

const App0: React.FC = () => {

    const messageEndRef = useRef<HTMLDivElement>(null);

    const [appStates, setAppStates] = useState<AppStates>(
        {
            messages: [
              { id: 1, type: 'chatbot', text: 'Welcome! I am your Redecofinder AI assistant, here to help design your space with suitable furniture.', options: ['Help me find suitable furniture for my style'] },
            ],
            furnitureClass: 'Chairs',
            messageEnd: messageEndRef,
            typingMode: false,
            loading: false,
            imagesSent: false,
            typingPhase: 0,
            chatHistory: [],
            errorMessage: "",
            recommendations: "",
            refImage64: "",
            refImage642: "",
            refImage643: "",
            modalOpen: false,
            selectedProduct: null,
          }
    );
    const [stateHistory, setStateHistory] = useState<StateHistory[]>([{ phase: 0, states: appStates}]);
    const [currentPhase, setCurrentPhase] = useState<number>(0);
    const [previousPhase, setPreviousPhase] = useState<number>(0);
    const location = useLocation();

    useNavigationDetection(
        () => {
          console.log('User navigated back');
          let lastChar = Number(location.pathname.slice(-1));
          let newStates : AppStates = appStates;
          for(let i = 0; i < stateHistory.length; i++){
            if(stateHistory[i].phase === lastChar){
                newStates = stateHistory[i].states;
            }
            setAppStates(newStates);
          }
        },
        () => {
          console.log('User navigated forward');
          let lastChar = Number(location.pathname.slice(-1));
          let newStates : AppStates = appStates;
          for(let i = 0; i < stateHistory.length; i++){
            if(stateHistory[i].phase === lastChar){
                newStates = stateHistory[i].states;
            }
            setAppStates(newStates);
          }
        }
      );

    // helper functions to update specific parts of the state
    const setModalOpen = (value: boolean) => setAppStates(prevState => ({ ...prevState, modalOpen: value }));
    const setTypingMode = (value: boolean) => setAppStates(prevState => ({ ...prevState, typingMode: value }));
    const setLoading = (value: boolean) => setAppStates(prevState => ({ ...prevState, loading: value }));
    const setMessages = (messages: ChatMessage[]) => setAppStates(prevState => ({ ...prevState, messages }));
    const setFurnitureClass = (furnitureClass: string) => setAppStates(prevState => ({ ...prevState, furnitureClass }));
    const setImagesSent = (value: boolean) => setAppStates(prevState => ({ ...prevState, imagesSent: value }));
    const setTypingPhase = (value: number) => setAppStates(prevState => ({ ...prevState, typingPhase: value }));
    const setChatHistory = (updater: (prevHistory: string[]) => string[]) => setAppStates(prevState => ({ ...prevState, chatHistory: updater(prevState.chatHistory) }));  
    const setChatHistoryDirect = (value: string[]) => setAppStates(prevState => ({ ...prevState, chatHistory: value }));
    const setErrorMessage = (value: string) => setAppStates(prevState => ({ ...prevState, errorMessage: value }));
    const setRecommendations = (value: string) => setAppStates(prevState => ({ ...prevState, recommendations: value }));
    const setRefImage64 = (value: string) => setAppStates(prevState => ({ ...prevState, refImage64: value }));
    const setRefImage642 = (value: string) => setAppStates(prevState => ({ ...prevState, refImage642: value }));
    const setRefImage643 = (value: string) => setAppStates(prevState => ({ ...prevState, refImage643: value }));
    const setSelectedProduct = (product: null | CompareObject) => setAppStates(prevState => ({ ...prevState, selectedProduct: product }));

    const navigateHandler = (sourcePhase : number) => {

        //next, put the original App.tsx inside this compos Route element
        //then put all of its usestate variables here and save them all in one historyobject.
        //each hostoryobject has also value phase like 1, 2 ,3...
        // when user navigates, we fetch all states from the historyobject for the correct phase

        // let newHistoryObject : StateHistory = { phase: sourcePhase + 1, states: appStates };
        // setStateHistory(prevState => ([...prevState, newHistoryObject]));
        setPreviousPhase(sourcePhase);
        let newPhase = sourcePhase + 1;
        setCurrentPhase(newPhase);

        setStateHistory(prevStateHistory => {
            const existingIndex = prevStateHistory.findIndex(item => item.phase === newPhase);
      
            if (existingIndex !== -1) {
              // If it exists, overwrite the object
              const updatedHistory = [...prevStateHistory];
              updatedHistory[existingIndex] = { phase: newPhase, states: appStates };
              return updatedHistory;
            } else {
              // If it doesn't exist, add the new object
              return [...prevStateHistory, { phase: newPhase, states: appStates }];
            }
          });
    }

  return (
      <Routes>
        <Route path='/' element={<App1 appStates={appStates} navigateHandler={navigateHandler} phaseNumber={0} setModalOpen={setModalOpen} setTypingMode={setTypingMode} setLoading={setLoading} setMessages={setMessages} setFurnitureClass={setFurnitureClass} setImagesSent={setImagesSent} setTypingPhase={setTypingPhase} setChatHistory={setChatHistory} setChatHistoryDirect={setChatHistoryDirect} setErrorMessage={setErrorMessage} setRecommendations={setRecommendations} setRefImage64={setRefImage64} setRefImage642={setRefImage642} setRefImage643={setRefImage643} setSelectedProduct={setSelectedProduct} />} />
        <Route path='/1' element={<App1 appStates={appStates} navigateHandler={navigateHandler} phaseNumber={1} setModalOpen={setModalOpen} setTypingMode={setTypingMode} setLoading={setLoading} setMessages={setMessages} setFurnitureClass={setFurnitureClass} setImagesSent={setImagesSent} setTypingPhase={setTypingPhase} setChatHistory={setChatHistory} setChatHistoryDirect={setChatHistoryDirect} setErrorMessage={setErrorMessage} setRecommendations={setRecommendations} setRefImage64={setRefImage64} setRefImage642={setRefImage642} setRefImage643={setRefImage643} setSelectedProduct={setSelectedProduct} />} />
        <Route path='/2' element={<App1 appStates={appStates} navigateHandler={navigateHandler} phaseNumber={2} setModalOpen={setModalOpen} setTypingMode={setTypingMode} setLoading={setLoading} setMessages={setMessages} setFurnitureClass={setFurnitureClass} setImagesSent={setImagesSent} setTypingPhase={setTypingPhase} setChatHistory={setChatHistory} setChatHistoryDirect={setChatHistoryDirect} setErrorMessage={setErrorMessage} setRecommendations={setRecommendations} setRefImage64={setRefImage64} setRefImage642={setRefImage642} setRefImage643={setRefImage643} setSelectedProduct={setSelectedProduct} />} />
        <Route path='/3' element={<App1 appStates={appStates} navigateHandler={navigateHandler} phaseNumber={3} setModalOpen={setModalOpen} setTypingMode={setTypingMode} setLoading={setLoading} setMessages={setMessages} setFurnitureClass={setFurnitureClass} setImagesSent={setImagesSent} setTypingPhase={setTypingPhase} setChatHistory={setChatHistory} setChatHistoryDirect={setChatHistoryDirect} setErrorMessage={setErrorMessage} setRecommendations={setRecommendations} setRefImage64={setRefImage64} setRefImage642={setRefImage642} setRefImage643={setRefImage643} setSelectedProduct={setSelectedProduct} />} />
        <Route path='/4' element={<App1 appStates={appStates} navigateHandler={navigateHandler} phaseNumber={4} setModalOpen={setModalOpen} setTypingMode={setTypingMode} setLoading={setLoading} setMessages={setMessages} setFurnitureClass={setFurnitureClass} setImagesSent={setImagesSent} setTypingPhase={setTypingPhase} setChatHistory={setChatHistory} setChatHistoryDirect={setChatHistoryDirect} setErrorMessage={setErrorMessage} setRecommendations={setRecommendations} setRefImage64={setRefImage64} setRefImage642={setRefImage642} setRefImage643={setRefImage643} setSelectedProduct={setSelectedProduct} />} />
        <Route path='/5' element={<App1 appStates={appStates} navigateHandler={navigateHandler} phaseNumber={5} setModalOpen={setModalOpen} setTypingMode={setTypingMode} setLoading={setLoading} setMessages={setMessages} setFurnitureClass={setFurnitureClass} setImagesSent={setImagesSent} setTypingPhase={setTypingPhase} setChatHistory={setChatHistory} setChatHistoryDirect={setChatHistoryDirect} setErrorMessage={setErrorMessage} setRecommendations={setRecommendations} setRefImage64={setRefImage64} setRefImage642={setRefImage642} setRefImage643={setRefImage643} setSelectedProduct={setSelectedProduct} />} />
        <Route path='/6' element={<App1 appStates={appStates} navigateHandler={navigateHandler} phaseNumber={6} setModalOpen={setModalOpen} setTypingMode={setTypingMode} setLoading={setLoading} setMessages={setMessages} setFurnitureClass={setFurnitureClass} setImagesSent={setImagesSent} setTypingPhase={setTypingPhase} setChatHistory={setChatHistory} setChatHistoryDirect={setChatHistoryDirect} setErrorMessage={setErrorMessage} setRecommendations={setRecommendations} setRefImage64={setRefImage64} setRefImage642={setRefImage642} setRefImage643={setRefImage643} setSelectedProduct={setSelectedProduct} />} />
      </Routes>
  );
};

const App = () => (
    <Router>
      <App0 />
    </Router>
  );

export default App;
