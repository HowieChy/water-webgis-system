import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import 'antd/dist/reset.css'; // Ant Design Reset

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
