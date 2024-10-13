import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import StepperWithForm from './StepperWithForm';

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <StepperWithForm/>
      </ChakraProvider>
    </div>
  );
}

export default App;
