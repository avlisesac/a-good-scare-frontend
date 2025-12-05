import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios, { 
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  RawAxiosRequestHeaders
} from 'axios';

// const client = axios.create({
//   baseURL: '/'
// })

const makeAxiosCall = async () => {
  try {
    console.log('attempting axios call...');
    const response = await axios.get('/api/');
    console.log('response:', response);
  } catch (error) {
    console.error('error:', error)
  }
}

const App = () => {
  useEffect(() => {
    makeAxiosCall();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
