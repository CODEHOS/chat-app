import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      w={{ base: "100%", md: "100%" }} // Ensure it fills 100% width
      h="100%" // Add this to ensure the Chatbox takes the full height
      p={3}
      bg="white"
      flexDir="column"
      alignItems="center"
      borderRadius="lg"
      borderWidth="1px"
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
