import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Generate a random ID for the chat session
const randomId = uuidv4();

export const Modal = () => {
  // Ref for scrolling to the bottom of the chat window
  const messagesEndRef = useRef(null);

  // State for the chat modal
  const [isOpen, setIsOpen] = useState(false);

  // State for the user input text
  const [textInput, setTextInput] = useState("");

  // State for the chat messages
  const [messageContent, setMessageContent] = useState([
    {
      sender: "lito",
      content:
        "Bonjour et bienvenue sur notre Chat intéractif! Vous allez voir on va bien s'entendre!",
    },
  ]);

  // Function to handle opening and closing the chat modal
  const handleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Function to get a response from the chatbot API
  const getResponse = async () => {
    // Use the random ID as the session ID for the chat
    const sessionId = randomId;
    const response = await axios
      .post("http://localhost:8080/dialogflow", {
        queryText: textInput,
        sessionId: sessionId,
      })
      .catch((error) => {
        console.error(error);
      });
    return response.data;
  };

  // UseEffect hook to scroll to the bottom of the chat window when new messages are added
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messageContent]);

  // Function to handle user input submission
  const handleSubmit = async (e) => {
    if (e.key === "Enter") {
      // Check for special commands
      if (textInput === "flip") {
        /* animation flip */
      }

      // Check for maximum message length
      if (textInput.length >= 255) {
        return setMessageContent([
          "Je suis désolé mais votre message est trop long (plus de 256 charactères)",
        ]);
      }

      // Get the response from the chatbot API
      const response = await getResponse();

      // Update the message content with the user input and the chatbot response
      setMessageContent((prevState) => [
        ...prevState,
        { sender: "user", content: textInput },
      ]);
      setMessageContent((prevState) => [
        ...prevState,
        { sender: "lito", content: response },
      ]);

      // Clear the user input text
      setTextInput("");
    }
  };
  return (
    <>
      <div className={isOpen ? "modal modal-open" : "modal modal-close"}>
        <div className="header" onClick={handleOpen}>
          Open Campus Chat Box
        </div>
        <div className="content">
          {messageContent.map((message, index) => (
            <span key={index} className={message.sender}>
              {message.content}
            </span>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbox">
          <input
            type="text"
            className="chatInput"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => handleSubmit(e)}
          />
        </div>
      </div>
    </>
  );
};
