import { useEffect, useState } from "react";

export const Modal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [textInput, setTextInput] = useState();
  const [messageContent, setMessageContent] = useState([]);
  const handleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };
  useEffect(() => {});
  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      if (textInput === "flip") {
        /* animation flip */
      }
      console.log(textInput);
      let storedMessage = [
        "Bonjour et bienvenue sur notre Chat intéractif! Vous allez voir on va bien s'entendre!",
      ];
      storedMessage.push(textInput);
      setMessageContent(storedMessage);
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
            <span key={index}>{message}</span>
          ))}
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
