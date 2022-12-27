import { useState, useEffect } from "react";
import RecordView from "./components/RecordView";
import "./App.css";
import { ScaleLoader } from "react-spinners";
import axios from "axios";

function App() {
  const [transcription, settranscription] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [AILoading, setAILoading] = useState(false);

  useEffect(() => {
    if (transcription !== "") {
      // const eventSrc = new EventSource("/gptresponse");

      // var str = "";
      setAILoading(true);

      // eventSrc.onerror = (e) => {
      //   console.error(e);
      //   console.error("error in sse");
      //   eventSrc.close();
      //   setloading(false);
      // };

      // eventSrc.onmessage = (event) => {
      //   console.log("event received");
      //   console.log(event.data);
      //   setloading(false);
      //   str += event.data;
      //   // console.log(str);
      //   setGptResponse(str);

      //   // console.log(event.data);
      //   // setGptResponse(gptResponse + event.data);
      //   // console.log(gptResponse);
      // };
      axios
        .get("/gptresponse")
        .then((res) => {
          setGptResponse(res.data);
          setAILoading(false);
        })
        .catch((error) => {
          setAILoading(false);
          if (error.response) {
            console.error(error.response);
            console.error(error.response.status);
            console.error(error.response.headers);
          }
        });
    }
    // else {
    //   eventSrc.close();
    // }

    // return () => {
    //   eventSrc.close();
    // };
  }, [transcription]);

  return (
    <div className="App">
      <h2>AI Bot</h2>
      <RecordView
        setLoading={setUserLoading}
        setTranscription={settranscription}
        setGptResponse={setGptResponse}
      />

      <div className="chatting-box">
        <ScaleLoader color="#5f5f5f" loading={userLoading} />

        {transcription && (
          <div>
            <p style={{ color: "red" }}>You: </p>
            <p>{transcription}</p>
            <p style={{ color: "red" }}>AI: </p>
          </div>
        )}
        <ScaleLoader color="#5f5f5f" loading={AILoading} />
        {gptResponse && <p>{gptResponse}</p>}
      </div>
    </div>
  );
}

export default App;
