import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, selectedChat } = ChatState();

  return (
    <Box width="100%" height="100vh">
      {user && <SideDrawer />}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        w="100%" 
        h={{ base: "calc(100vh - 60px)", md: "91.5vh" }}
        p="10px"
      >
        {user && (
          <Box 
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            w={{ base: "100%", md: "30%" }}
            mr={{ md: "10px" }}
          >
            <MyChats fetchAgain={fetchAgain} />
          </Box>
        )}
        {user && (
          <Box 
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            w={{ base: "100%", md: "70%" }}
          >
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chatpage;