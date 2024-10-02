import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, IconButton, Text, Flex, Spinner, VStack, FormControl, Input, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import './style.css'
import SrollableChat from './SrollableChat'
import io from 'socket.io-client';
import Lottie, {} from 'react-lottie'
import animationData from '../animations/typing.json'

const ENDPOINT = "http://localhost:5000";

var socket , selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const {user, setSelectedChat, selectedChat, notification, setNotification} = ChatState()
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const toast = useToast()

  const fetchMessages = async () => {
    if(!selectedChat){
      return;
    }

    try {
       const config ={
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
        }
      }

      setLoading(true)
      const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);
      
      
      setMessages(data)
      setLoading(false)
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to fetch messages. Please try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom"
      })
    }
  }

  const sendMessage = async (e) => {

    if (e.key === "Enter" && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config ={
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
        }
      }
      setNewMessage("")
      const {data} = await axios.post("/api/message", {
        content: newMessage,
        chatId: selectedChat._id,
      }, config)
      
      socket.emit('new message', data);
      setMessages([...messages, data])
      
      } catch (error) {
        toast({
          title: "An error occurred.",
          description: "Unable to send message. Please try again.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom"
        })
      }
      
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)
    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = (new Date()).getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = (new Date()).getTime();
      var timeDiff = timeNow - lastTypingTime;
      if(timeDiff >= timerLength && typing){
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  },[]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat])


  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }

      }else{
        setMessages([...messages, newMessageReceived]);
      }
    })
  });

  
  
  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      display="flex"
      flexDir="column"
      position="relative"  // Added to allow absolute positioning of children
    >
      {selectedChat ? (
        <>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            p={3}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              size="sm"
            />
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="semibold"
              flex={1}
              textAlign="center"
            >
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : getSender(user, selectedChat.users)
              }
            </Text>
            <Box>
              {selectedChat.isGroupChat ? (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              ) : (
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              )}
            </Box>
          </Flex>
          
          <VStack
            flex={1}
            w="100%"
            p={3}
            overflowY="auto"
            bg="gray.50"
            spacing={3}
            align="stretch"
          >
            {/* Your messages will go here */}
          </VStack>

          {/* Spinner positioned in the bottom-left corner */}
          {loading ? (
            <Box
              position="absolute"
              bottom={4}
              left={4}
              zIndex={10}
            >
              <Spinner
                size="md"
                color="blue.500"
                thickness="4px"
              />
            </Box>
          ):(
            <div className='messages'>
              <SrollableChat messages={messages}/>
            </div>
          )}
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping?<div>
              <Lottie
                options={defaultOptions}
                width={70}
                style={{ marginBottom:15, marginLeft: 0}}
            /></div>:(<></>)}
            <Input
              placeholder="Type a message..."
              variant="filled"
              size="lg"
              bg="#E0E0E0"
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>
        </>
      ) : (
        <Flex
          alignItems="center"
          justifyContent="center"
          h="100%"
          bg="gray.50"
        >
          <Text 
            fontSize="xl" 
            fontWeight="medium" 
            color="gray.600"
            textAlign="center"
            px={4}
          >
            Click on a user to start chatting
          </Text>
        </Flex>
      )}
    </Box>
  )
}

export default SingleChat