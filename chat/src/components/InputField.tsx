import React, { useState } from 'react';
import './../styles/inputfield.css';

const InputField: React.FC = () => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    alert(`You typed: ${input}`);
    setInput('');
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="rounded-input"
        placeholder="Type something..."
      />
      <button onClick={handleSend} className="send-button">
        Send
      </button>
    </div>
  );
};

export default InputField;