import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, IconButton, Text, Flex } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'

const SingleChat = ({fetchAgain, setFetchAgain}) => {
  const {user, setSelectedChat, selectedChat} = ChatState()
  
  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      display="flex"
      flexDir="column"
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
                />
              ) : (
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              )}
            </Box>
          </Flex>
          
          <Box
            flex={1}
            w="100%"
            p={3}
            overflowY="auto"
            bg="gray.50"
          >
            {/* Messages will go here */}
            <Text color="gray.500">Messages Here</Text>
          </Box>
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