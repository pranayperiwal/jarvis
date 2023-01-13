from flask import Flask, request, Response, render_template, send_file
from flask_cors import CORS, cross_origin
import replicate
import whisper
import os
import openai
import base64

from utility import synthesize_speech

app = Flask(__name__ , static_folder='client/build', static_url_path='/')
CORS(app)


model = whisper.load_model("base.en")
# model = replicate.models.get("openai/whisper")
# version = model.versions.get("30414ee7c4fffc37e260fcab7842b5be470b9b840f2b608f5baa9bbef9a259ed")

openai.api_key = os.getenv("OPENAI_API_KEY")
result = {}

@app.route('/')
@cross_origin()
def index():
    return {"text": "text recevied"}
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))


@app.route('/receive', methods=['POST'])
@cross_origin()
def receive_audio():
    files = request.files
    file = files.get('file')
    file.save(os.path.abspath("test.wav"))
    global result
    result = model.transcribe("test.wav")

    # enc = base64.b64encode(open("test.wav", "rb").read())
    # uri = "data:audio/wav;base64,"+ enc.decode()

    # result1 = version.predict(audio=uri, model="base", transcription="plain text", translate=False, language="en")
    # print(result1["transcription"])
    # result["text"] = result1["transcription"]
    return result["text"]

# def eventStream():
#     while True:
#         time.sleep(1)
#         now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
#         print(now)
#         # DO NOT forget the prefix and suffix
#         yield 'data: %s\n\n' % now
#
# def get_message():
#     '''this could be any function that blocks until data is ready'''
#     time.sleep(1.0)
#     s = time.ctime(time.time())
#
#     return s

@app.route('/gptresponse', methods=['GET'])
@cross_origin()
def get_gpt_response():
    # def eventStream():
    # #     while True:
    #         # wait for source data to be available, then push it
    #
    #
    #     response = openai.Completion.create(
    #         model="text-davinci-003",
    #         prompt=result["text"],
    #         max_tokens=1250,
    #         temperature=0.7,
    #         stream=True
    #     )
    #
    #     for text in response:
    #         # print(text.choices[0].text, datetime.now())
    #         yield "data: {}\n\n".format(text.choices[0].text)
    #         # time.sleep(1)
    response = openai.Completion.create(
            model="text-davinci-003",
            prompt=result["text"],
            max_tokens=1250,
            temperature=0.7,
            # stream=True
        )
    synthesize_speech(response.choices[0].text)
    # return response.choices[0].text

    # TODO: maybe don't need to save as mp3, can send binary stream directly
    return send_file("./output.mp3", mimetype="audio/mp3")

    # return Response(eventStream(), mimetype="text/event-stream")

