import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Phase1 from './../src/components/Phase1_experimental';
import Phase2 from './../src/components/Phase2_experimental';
import App1 from './App1';
// import Phase2 from './components/Phase2';
// import Phase3 from './components/Phase3';

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
    chatHistory: string;
    errorMessage: string;
    recommendations: string;
    refImage64: string;
    refImage642: string;
    refImage643: string;
    modalOpen: boolean;
    selectedProduct: null | CompareObject;
  }

const App: React.FC = () => {
    //const navigate = useNavigate();
    const [currentRoute, setCurrentRoute] = useState<string>('/phase1');
    const [testArray, setTestArray] = useState<string[]>(['juu']);
    const [oldArray, setOldArray] = useState<string[]>();

    const messageEndRef = useRef<HTMLDivElement>(null);

    const [appStates, setAppStates] = useState<AppStates>(
        {
            messages: [
              { id: 1, type: 'chatbot', text: 'Welcome! I am your Redecofinder assistant, here to help design your space with suitable furniture.', options: ['Help me find suitable furniture for my style'] },
            ],
            furnitureClass: 'Chairs',
            messageEnd: messageEndRef,
            typingMode: false,
            loading: false,
            imagesSent: false,
            typingPhase: 0,
            chatHistory: "",
            errorMessage: "",
            recommendations: "",
            refImage64: "",
            refImage642: "",
            refImage643: "",
            modalOpen: false,
            selectedProduct: null,
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
  const setChatHistory = (updater: (prevHistory: string) => string) => setAppStates(prevState => ({ ...prevState, chatHistory: updater(prevState.chatHistory) }));  
  const setChatHistoryDirect = (value: string) => setAppStates(prevState => ({ ...prevState, chatHistory: value }));
  const setErrorMessage = (value: string) => setAppStates(prevState => ({ ...prevState, errorMessage: value }));
  const setRecommendations = (value: string) => setAppStates(prevState => ({ ...prevState, recommendations: value }));
  const setRefImage64 = (value: string) => setAppStates(prevState => ({ ...prevState, refImage64: value }));
  const setRefImage642 = (value: string) => setAppStates(prevState => ({ ...prevState, refImage642: value }));
  const setRefImage643 = (value: string) => setAppStates(prevState => ({ ...prevState, refImage643: value }));
  const setSelectedProduct = (product: null | CompareObject) => setAppStates(prevState => ({ ...prevState, selectedProduct: product }));

    const navigateTest = () => {
        setOldArray(testArray);
        //navigate('/phase2');
        setTestArray(['phasekaks','hahaa']);
        //next, put the original App.tsx inside this compos Route element
        //then put all of its usestate variables here and save them all in one historyobject.
        //each hostoryobject has also value phase like 1, 2 ,3...
        // when user navigates, we fetch all states from the historyobject for the correct phase
    }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<App1
            appStates={appStates}
            setModalOpen={setModalOpen}
            setTypingMode={setTypingMode}
            setLoading={setLoading}
            setMessages={setMessages}
            setFurnitureClass={setFurnitureClass}
            setImagesSent={setImagesSent}
            setTypingPhase={setTypingPhase}
            setChatHistory={setChatHistory}
            setChatHistoryDirect={setChatHistoryDirect}
            setErrorMessage={setErrorMessage}
            setRecommendations={setRecommendations}
            setRefImage64={setRefImage64}
            setRefImage642={setRefImage642}
            setRefImage643={setRefImage643}
            setSelectedProduct={setSelectedProduct}
        />} />
        <Route path='/phase1' element={<Phase1 testArray={testArray} navigate={navigateTest}/>} />
        <Route path='/phase2' element={<Phase1 testArray={testArray} navigate={navigateTest}/>} />
        {/* <Route path='/phase2' element={<Phase2/>} /> */}
      </Routes>
    </Router>
  );
};

export default App;
