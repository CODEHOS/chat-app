import { useState } from "react";
import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useToast, Tooltip, useDisclosure, Spinner } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from '@chakra-ui/react'
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { Effect } from "react-notification-badge";

import NotificationBadge from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  

  const {user, setSelectedChat, chats, setChats,notification,
        setNotification} = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();


  const LogoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if(!search){
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
       toast({
          title: 'Error occurred',
          description: "Failed to load the search Results",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left"
        })

    }
  }

  const accessChat =async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post('/api/chat', { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([...chats, data]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: "Failed to load the chat",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  };

  return <div>
          <Box 
            display='flex'
            justifyContent='space-between'
            bg='white'
            w='100%'
            p='5px 10px 5px 10px'
            borderWidth='5px'
          >
              <Tooltip label="Search Users to chat" hasArrow placeContent="bottom-end">
                <Button variant="ghost" onClick={onOpen}>
                  <i className="fas fa-search" ></i>
                  <Text display={{base:"none", md:"flex"}} px="4">
                    Search User
                  </Text>
                </Button>
              </Tooltip>
              <Text fontSize='2xl' fontFamily='Work sans'>
                Family-Talk
              </Text>
              <div>
                <Menu>
                  <MenuButton p={1}>
                    <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
                    <BellIcon fontSize="2xl" m={1}/>
                  </MenuButton>
                  <MenuList pl={2}>
                    {!notification.length && "No Notifications"}
                    {notification.map((n) => (
                      <MenuItem key={n._id} onClick={() => {
                        setSelectedChat(n.chat);
                        setNotification(notification.filter((not) => not._id !== n._id));
                      }}>
                        {n.chat.isGroupChat ? `New Message in ${notification.chat.chatName}` : `New Message from ${getSender(user, n.chat.users)}`}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    <Avatar size='sm' cursor="pointer" name={user.name} src={user.pic}/>
                  </MenuButton>
                  <MenuList>
                    <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider/>
                    <MenuItem onClick={LogoutHandler}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </div>
          </Box>

          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay>
              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                <Box display="flex" pb={2}>
                  <input
                    
                    placeholder="Search by name or email"
                    margin-right="2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    onClick={handleSearch}
                    // isLoading={loading}
                    // colorScheme="teal"
                    // size="sm"
                  >
                    Go
                  </Button>
                </Box>
                {loading ? <ChatLoading />:
                (
                  searchResult?.map(user => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction ={()=>accessChat(user._id)}
                    />
                  ))
                )
                }
                {loadingChat && <Spinner ml="auto" display="flex"/>}
              </DrawerBody>
              </DrawerContent>
              
            </DrawerOverlay>
          </Drawer>
  </div>
};

export default SideDrawer;