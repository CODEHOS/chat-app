import React, { useState } from 'react'

import { Stack, HStack, VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);

  const handleClick = () => setShow(!show);

  const postDetails = (pic) => {
    setLoading(true);
    if(pic === undefined){
      return;
    }
  }

  const submitHandler = () => {}
  return <VStack spacing='5px' color="black">
        <FormControl id='first-name' isRequired>
          <FormLabel>Name</FormLabel>
          <Input placeholder='Enter Your Name' onChange={(e)=>setName(e.target.value)} />
        </FormControl>
        <FormControl id='email' isRequired>
          <FormLabel>Email</FormLabel>
          <Input placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)} />
        </FormControl>
        <FormControl id='password' isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input 
            type={show ? 'text' : 'password'}
              placeholder='Enter Your Password'
              onChange={(e)=>setPassword(e.target.value)}
             />
             <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
             </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id='password' isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input 
            type={show ? 'text' : 'password'}
              placeholder='Confirm Password'
              onChange={(e)=>setConfirmPassword(e.target.value)}
             />
             <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
             </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id='pic' >
          <FormLabel>Upload your Profile Picture</FormLabel>
          <Input 
            type='file'
            p={1.5}
            accept='image/*'
            onChange={(e)=>postDetails(e.target.files[0])}
          />
        </FormControl>

        <Button
          colorScheme='blue'
          width="100%"
          style={{marginTop: '15px'}}
          onClick={submitHandler}
        >
          Sign Up
        </Button>
        
    </VStack>

}

export default Signup