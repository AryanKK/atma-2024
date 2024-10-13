import React, { useState } from 'react';
import { Alert, Radio, RadioGroup, Stack } from '@chakra-ui/react';

import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  VStack,
  useToast,
} from '@chakra-ui/react';

const steps = [
  { title: 'Goal Setting', description: 'Select your goals and enter preliminary info' },
  { title: 'Review', description: 'Review your information' },
  { title: 'Select', description: 'Select workouts and send reminder' },
  { title: 'Confirmation', description: 'Submission complete. Keep improving your Aatma' }
];

function StepperWithForm() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [selectedOption, setSelectedOption] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
  });
  const[form2Data, setForm2Data] = useState({
    difficulty: '',
    userName: '',
    phoneNumber: ''
  })

  const toast = useToast();
  const [aiResponse, setAiResponse] = useState('');
  const [easy, setEasyString] = useState('');
  const[medium, setMediumString] = useState('');
  const[hard, setHardString] = useState('');
  const[phoneNumber,setPhoneNumber] =useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlePhone = (e) => {
    const { name, value } = e.target;
    setForm2Data(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveStep(1); // Move to next step
  };
  const handleRadioChange = (value) => {
    setSelectedOption(value);
    setFormData(prevData => ({
      ...prevData,
      goal: value,
    }));
  };
  const submitToBackend = async () => {
    try {
      const response = await fetch('http://localhost:5515/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(response.body);
      console.log(formData);

      if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
      setAiResponse(result.aiResponse);
      setEasyString(result.easy);
     setMediumString(result.medium);
     setHardString(result.hard);
      toast({
        title: 'Form submitted.',
        description: "We've received your submission.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setActiveStep(2); // Move to confirmation step
    } catch (error) {
      console.error('Error: ', error);
      toast({
        title: 'An error occurred.',
        description: "Unable to submit form. Please try again.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const submitToBackendTwo = async() => {
    try {
        const response = await fetch('http://localhost:5515/api/submit-form2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form2Data)
        });
  
        if (!response.ok) {
          console.log(response);
          throw new Error('Network response was not ok');
        }

  
        setActiveStep(3); 

        toast({
          title: 'Form submitted.',
          description: "We've received your submission.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        

      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'An error occurred.',
          description: "Unable to submit form. Please try again.",
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    
  };
  
  const handleRadioChangeTwo = (value) => {
    setDifficulty(value)
    setForm2Data(prevData => ({
        ...prevData,
        difficulty: value,
      }));
    
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Card> Atma is about combining AI with your reality. It focuses on providing you customized workouts made by AI according to your goals and allows you to get reminders.</Card>
              <FormControl as="fieldset">
                <FormLabel as="legend">Select an Atma goal</FormLabel>
                <RadioGroup onChange={handleRadioChange} value={selectedOption}>
                  <Stack direction="column">
                    <Radio value="cardio">Cardio</Radio>
                    <Radio value="muscle">Muscular Strength and Endurance</Radio>
                    <Radio value="flexibility">Flexibility</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <Button type="submit" colorScheme="blue">
                Next
              </Button>
            </VStack>
          </form>
        );
      case 1:
        return (
          <VStack align="start" spacing={4}>
            <Box>Selected Atman Goal: {formData.goal}</Box>
            <Button onClick={submitToBackend} colorScheme="blue">
              Confirm and Submit
            </Button>
          </VStack>
        );
        case 2:
            return (
            <form onSubmit={submitToBackendTwo}>
            <VStack align="start" spacing={4}>
              <FormControl isRequired>
                <FormLabel> Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  value={form2Data.phoneNumber}
                  onChange={handlePhone}
                  placeholder="Enter your phone number (add 1)"
                />
              </FormControl>
              <FormControl isRequired>
                <RadioGroup onChange={handleRadioChangeTwo} value={difficulty}>
                  <Stack direction="column">
                    <Radio value= {easy}>{easy}</Radio>
                    <Radio value={medium}>{medium}</Radio>
                    <Radio value={hard}>{hard}</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
                <Button type="submit" colorScheme="blue" mt={4}>Submit</Button>
            </VStack>
              </form>
            );
        case 3:
            return (
                <Card> Daily Customized Improvement Completed! </Card>
            );
                
        }
        
  };
  return (
    <Box mt={300} mx={40}>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      
      <Box mt={8}>
        {renderStepContent(activeStep)}
      </Box>
    </Box>
  );
}
  



export default StepperWithForm;