import { useState, useEffect } from "react";
import RecordView from "./components/RecordView";
import "./App.css";
import { ScaleLoader } from "react-spinners";
import axios from "axios";

function App() {
  const [transcription, settranscription] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const eventSrc = new EventSource("/gptresponse");

    if (transcription !== "") {
      var str = "";
      setloading(true);

      eventSrc.onerror = (e) => {
        console.error(e);
        console.error("error in sse");
        eventSrc.close();
        setloading(false);
      };

      eventSrc.onmessage = (event) => {
        console.log("event received");
        console.log(event.data);
        setloading(false);
        str += event.data;
        // console.log(str);
        setGptResponse(str);

        // console.log(event.data);
        // setGptResponse(gptResponse + event.data);
        // console.log(gptResponse);
      };
      // axios
      //   .get("/gptresponse")
      //   .then((res) => {
      //     setGptResponse(res.data);
      //     setloading(false);
      //   })
      //   .catch((error) => {
      //     setloading(false);
      //     if (error.response) {
      //       console.error(error.response);
      //       console.error(error.response.status);
      //       console.error(error.response.headers);
      //     }
      //   });
    } else {
      eventSrc.close();
    }

    return () => {
      eventSrc.close();
    };
  }, [transcription]);

  return (
    <div className="App">
      <RecordView setLoading={setloading} setTranscription={settranscription} />

      <ScaleLoader color="#5f5f5f" loading={loading} />

      <p>{transcription}</p>
      {transcription && (
        <div>
          <p>GPT response:</p>
          <p>{gptResponse}</p>
        </div>
      )}
    </div>
  );
}

export default App;
