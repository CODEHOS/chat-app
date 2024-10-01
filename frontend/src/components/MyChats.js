import React from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { ChatState } from '../context/ChatProvider';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';

const MyChats = ({  }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { setSelectedChat, setChats, user, chats, selectedChat } = ChatState();
  
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get('/api/chat', config);
      console.log(data);
      
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: "Failed to load the chats",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      bg="white"
      w="100%"
      h="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <Button 
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </Box>
      <Box
        flexDir="column"
        display='flex'
        h='100%'
        w="100%"
        p={3}
        bg="#F8F8F8"
        borderRadius="lg"
        overflowY="hidden"
      >
        {/* Chat list content goes here */}
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat)=>(
              <Box
                onClick={()=>setSelectedChat(chat)}
                key={chat._id}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC": "#E8E8E8"}
                color={selectedChat === chat ? "white": "black"}
                px={3}
                py={2}
                borderRadius="lg"

              >
                <Text>
                  {!chat.isGroupChat? getSender(loggedUser, chat.users):(chat.chatName)}
                </Text>
              </Box>
            ))}

          </Stack>
        ):(
          <ChatLoading/>
        ) }
      </Box>
    </Box>
  )
}

export default MyChats;