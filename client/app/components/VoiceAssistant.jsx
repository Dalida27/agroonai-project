'use client'

import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

const VoiceAssistant = () => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [listening, setListening] = useState(false);

  const handleVoiceCommand = async (transcript) => {
    console.log('Отправка команды на сервер:', transcript);

    try {
      const res = await axios.post('/voice-assistant', { command: transcript });
      const { action } = res.data;

      console.log('Ответ от сервера:', action);

      if (action === 'navigate_dashboard') {
        window.location.href = '/dashboard';
      } else if (action === 'navigate_clients') {
        window.location.href = '/dashboard/users';
      } else if (action === 'navigate_products') {
        window.location.href = '/dashboard/products';
      } else if (action === 'navigate_add_products') {
        window.location.href = '/dashboard/products/add';
      } else {
        setResponse('Команда не распознана');
      }
    } catch (error) {
      console.error('Ошибка при отправке голосовой команды:', error);
      setResponse('Ошибка при отправке голосовой команды');
    } finally {
      setListening(false);
    }
  };

  const startRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      handleVoiceCommand(transcript);
    };

    recognition.start();
  };

  return (
    <div>
      <button
        className='border border-white sm:px-3 sm:py-2 px-2 py-1 rounded-xl cursor-pointer hover:bg-white hover:text-black'
        onClick={startRecognition}
        disabled={listening}
      >
        {listening ? 'Слушает...' : 'Голосовой помощник'}
      </button>
      {response && <p>Ответ: {response}</p>}
    </div>
  );
};

export default VoiceAssistant;
