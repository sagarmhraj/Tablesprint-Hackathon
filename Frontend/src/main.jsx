import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TablesprintProvider from './contexts/TablesprintContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <TablesprintProvider>
          <App />
        </TablesprintProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
