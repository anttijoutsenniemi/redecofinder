import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigation, useLocation } from 'react-router-dom';
import Phase1 from './../src/components/Phase1_experimental';
import Phase2 from './../src/components/Phase2_experimental';
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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/phase1' element={<Phase1/>} />
        <Route path='/phase2' element={<Phase2/>} />
      </Routes>
    </Router>
  );
};

export default App;
