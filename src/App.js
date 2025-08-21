import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import React from 'react';
import '@/theme.css';

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
