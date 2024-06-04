import React, { useState, useRef, useEffect } from 'react';
import './App.css';

export interface ChatMessage {
  id: number;
  type: 'user' | 'chatbot';
  text: string;
  options?: string[]; // Only present if type is 'chatbot'
}

export interface ChatOption {
  label: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Initial chat messages and options
    { id: 1, type: 'chatbot', text: 'Welcome! I am your Furnival assistant, here to help you find suitable furniture sets for your event!', options: ['Help me find suitable furniture sets'] },
  ]);
  const [furnitureClass, setFurnitureClass] = useState<string>('Chairs');
  const messageEnd = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  // Function to handle option click, send next
  const handleOptionClick = (option: string) => {
    const newUserMessage: ChatMessage = { id: messages.length + 1, type: 'user', text: option };

    let botResponseText : string = 'I am not coded that far yet';  // Default response text
    let options : string[] = [];
    switch (option) {
        case 'Help me find suitable furniture for my home.':
            botResponseText = 'Great! What type of furniture are you looking for? Here are some categories to choose from:';
            options = ['Chairs', 'Tables'];
            break;
        case 'Chairs':
            setFurnitureClass('Chairs');
            botResponseText = 'Sure, lets find a chair to your liking. Do you want to take a picture of the room so I can suggest chairs that I think fit the space?';
            options = ['Open Camera', 'No thank you, give me chair suggestions that I can browse.'];
            break;
        case 'Tables':
            setFurnitureClass('Tables');
            botResponseText = 'Sure, lets find a table to your liking. Do you want to take a picture of the room so I can suggest chairs that I think fit the space?';
            options = ['Open Camera', 'No thank you, give me table suggestions that I can browse.'];
            break;
        case 'Open Camera':
            //code for opening camera
            options = ['Start again'];
            break;
        case 'No thank you, give me chair suggestions that I can browse.':
            //code for giving chair suggestions
            options = ['Start again'];
            break;
        case 'No thank you, give me table suggestions that I can browse.':
            //code for giving table suggestions
            options = ['Start again'];
            break;
        case 'Start again':
            botResponseText = 'Welcome! I am your Homedesigner assistant, lets find furniture that matches your needs together!';
            options = ['Help me find suitable furniture for my home.'];
            break;
        default:
            botResponseText = 'I didnt understand your selection.';
            options = ['Start again'];
            break;
    }

    const newBotMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'chatbot',
        text: botResponseText,
        options: options
    };

    setMessages([...messages, newUserMessage, newBotMessage]);
};

function toggleDrawer() {
  const drawer : any = document.getElementById('drawer');
  drawer.classList.toggle('open');
}

  return (
    <div className="chat-app-background">
    <div className='screen-wrapper'>
    <div className='app-header'><h1 className='header-title'>Furnival assistant</h1>
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
      </div>
      </div>
    </div>
  );
};

export default App;