import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const {selectedChat} = ChatState();
  return (
    <Box 
      w="100%" 
      h="100%" 
      p="10px" 
      textAlign="right"  
    >
      Single Chat
    </Box>
  );
};

export default Chatbox;
