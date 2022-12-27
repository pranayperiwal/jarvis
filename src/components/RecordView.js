import axios from "axios";
import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export default function RecordView({
  setLoading,
  setTranscription,
  setGptResponse,
}) {
  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    mediaRecorderOptions: {
      video: false,
      audio: true,
      blobPropertyBag: {
        type: "audio/wav",
      },
    },
    onStop: (blobURL, audioBlob) => {
      setTranscription("");
      setGptResponse("");
      // console.log("URL", blobURL);
      // console.log(audioBlob);

      var data = new FormData();
      data.append("file", audioBlob, "file");

      setLoading(true);
      axios
        .post("/receive", data)
        .then((res) => {
          // console.log(res);
          setTranscription(res.data);
          setLoading(false);
          setGptResponse("");
        })
        .catch((error) => {
          setLoading(false);
          if (error.response) {
            console.error(error.response);
            console.error(error.response.status);
            console.error(error.response.headers);
          }
        });
    },
  });

  return (
    <div className="recording-group">
      <h4>Status: {status}</h4>
      <div className="recorder-buttons">
        <button onClick={startRecording}>Record voice input</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
    </div>
  );
}
