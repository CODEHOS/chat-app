import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const Login = () => {
   const [show, setShow] = useState(false);
   const [email, setEmail] = useState(''); // Initialized with an empty string
   const [password, setPassword] = useState(''); // Initialized with an empty string
   const [isLoading, setIsLoading] = useState(false);

   const history = useHistory();
   const toast = useToast();

   const handleClick = () => setShow(!show);

   const submitHandler = async () => {
     setIsLoading(true);
     if (!email || !password) {
       toast({
         title: "Please Fill all the Fields",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       setIsLoading(false);
       return;
     }
     try {
       const config = {
         headers: {
           "Content-type": "application/json",
         },
       };
       const { data } = await axios.post(
         "/api/user/login",
         { email, password },
         config
       );
       console.log(data);
       toast({
         title: "Login Successful",
         status: "success",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       localStorage.setItem("userInfo", JSON.stringify(data));
       setIsLoading(false);
       history.push("/chats");
     } catch (error) {
       toast({
         title: "Error Occurred!",
         description: error.response.data.message,
         status: "error",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       setIsLoading(false);
     }
   };

   return (
     <VStack spacing='5px' color="black">
       <FormControl id='email' isRequired>
         <FormLabel>Email</FormLabel>
         <Input placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
       </FormControl>

       <FormControl id='password' isRequired>
         <FormLabel>Password</FormLabel>
         <InputGroup>
           <Input
             type={show ? 'text' : 'password'}
             value={password}
             placeholder='Enter Your Password'
             onChange={(e) => setPassword(e.target.value)}
           />
           <InputRightElement width='4.5rem'>
             <Button h='1.75rem' size='sm' onClick={handleClick}>
               {show ? 'Hide' : 'Show'}
             </Button>
           </InputRightElement>
         </InputGroup>
       </FormControl>

       <Button
         colorScheme='blue'
         width="100%"
         style={{ marginTop: '15px' }}
         onClick={submitHandler}
         isLoading={isLoading}
       >
         Login
       </Button>

       <Button
         variant="solid"
         colorScheme='red'
         width="100%"
         onClick={() => {
           setEmail("guest@gmail.com");
           setPassword("123");
         }}
       >
         Get Guest User Credentials
       </Button>
     </VStack>
   );
};

export default Login;
