import axios from "axios";
import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export default function RecordView({ setLoading, setTranscription }) {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      mediaRecorderOptions: {
        video: false,
        audio: true,
        blobPropertyBag: {
          type: "audio/wav",
        },
      },
      onStop: (blobURL, audioBlob) => {
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
    <div>
      {/* <p>{status}</p> */}
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>

      {/* <audio src={mediaBlobUrl} controls /> */}
    </div>
  );
}
