import axios from "axios";
import classNames from "classnames";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import BouncingDotsLoader from "./BoundingDotsLoader";
import { CloseIcon } from "./CloseIcon";
import { FullScreen } from "./FullScreen";
import { Minimize } from "./Minimize";
import avatar from "../assets/avatar.jpg";

// Generate a random ID for the chat session
const randomId = uuidv4();

export const Modal = () => {
  // Ref for scrolling to the bottom of the chat window
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);
  const headerRef = useRef(null);

  const contentRef = useRef(null);
  const inputRef = useRef(null);
  // State for the chat modal
  const [isOpen, setIsOpen] = useState(false);
  // State for the user input text
  const [textInput, setTextInput] = useState("");
  // State for the chat messages
  const [messageContent, setMessageContent] = useState([
    {
      sender: "lito",
      content:
        "Bonjour et bienvenue! Je suis Lito votre compagnon interactif! Vous allez voir on va bien s'entendre!",
    },
  ]);
  const [displayModal, setDisplayModal] = useState(true);

  const [fullScreen, setFullScreen] = useState(false);

  const [isPending, setIsPending] = useState(false);

  const handleFullScreen = () => {
    setFullScreen((prevState) => !prevState);
  };
  useEffect(() => {
    const rotateModal = () => {
      const modal = document.getElementById("modal");
      modal.classList.add("rotate");
      setTimeout(() => {
        modal.classList.remove("rotate");
      }, 1000);
    };
    const showPicture = () => {
      const picture = document.getElementById("pictureLito");
      picture.classList.add("showPicture");
    };
    if (
      messageContent &&
      messageContent.length >= 2 &&
      messageContent[messageContent?.length - 2].content === "flip"
    ) {
      rotateModal();
    }
    if (
      messageContent &&
      messageContent.length >= 2 &&
      messageContent[messageContent?.length - 2].content === "montre toi"
    ) {
      showPicture();
    }
  }, [messageContent, modalRef]);

  const closePicture = () => {
    const picture = document.getElementById("pictureLito");
    picture.classList.remove("showPicture");
  };
  // Function to handle opening and closing the chat modal
  const handleOpen = () => {
    setIsOpen((prevState) => !prevState);
    isOpen === false && inputRef.current.focus();
  };

  // Function to get a response from the chatbot API
  const getResponse = async () => {
    // Use the random ID as the session ID for the chat
    const sessionId = randomId;
    const response = await axios
      // !local .post("http://localhost:8080/dialogflow", {
      .post("https://openchatbot-back.onrender.com/dialogflow", {
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
      // Check for maximum message length
      if (textInput.length >= 255) {
        return setMessageContent([
          "Je suis désolé mais votre message est trop long (plus de 256 charactères)",
        ]);
      }
      // Get the response from the chatbot API

      // Update the message content with the user input and the chatbot response
      setMessageContent((prevState) => [
        ...prevState,
        { sender: "user", content: textInput },
      ]);
      setIsPending(true);
      try {
        const response = await getResponse();
        setMessageContent((prevState) => [
          ...prevState,
          { sender: "lito", content: response },
        ]);
      } catch (error) {
        console.log(error);
        setMessageContent((prevState) => [
          ...prevState,
          {
            sender: "lito",
            content:
              "Je suis désolé mais une erreur est arrivé 😥 Merci de réessayer plus tard ou de contacter l'établissement.",
          },
        ]);
      }
      setIsPending(false);
      // Clear the user input text
      setTextInput("");
    }
  };

  const handleDisplayModal = () => {
    setDisplayModal(false);
  };

  return (
    <>
      <div className="avatar" onClick={handleOpen}>
        <img src={avatar} alt="avatar" />
      </div>
      {displayModal && (
        <div
          id="modal"
          className={classNames(
            "modal",
            isOpen ? " modal-open" : " modal-close",
            fullScreen && "fullscreen"
          )}
          ref={modalRef}
        >
          <div className="header" onClick={handleOpen} ref={headerRef}>
            Open Campus Chat Box
            <div className="iconsBox" onClick={(e) => e.stopPropagation()}>
              <span className="icon" onClick={handleFullScreen}>
                {fullScreen ? (
                  <Minimize size={fullScreen ? 25 : 15} />
                ) : (
                  <FullScreen size={fullScreen ? 25 : 15} />
                )}
              </span>
              <span className="icon" onClick={handleDisplayModal}>
                <CloseIcon size={fullScreen ? 25 : 15} />
              </span>
            </div>
          </div>
          <div className="content" ref={contentRef}>
            {messageContent.map((message, index) => (
              <span key={index} className={message.sender}>
                {message.content}
              </span>
            ))}
            {isPending && (
              <span className="lito">
                <BouncingDotsLoader />
              </span>
            )}

            <div ref={messagesEndRef} />
          </div>
          <div className="chatbox">
            <input
              ref={inputRef}
              type="text"
              className="chatInput"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => handleSubmit(e)}
              disabled={isPending}
            />
          </div>
        </div>
      )}
      <div className="pictureLito" id="pictureLito" onClick={closePicture} />
    </>
  );
};
