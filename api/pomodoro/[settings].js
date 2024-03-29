import { decode } from "js-base64";

const handler = async (req, res) => {
  const { settings } = req.query;
  const { timer, style } = JSON.parse(decode(settings));

  const toKebabCase = (text) =>
    text.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  const css = Object.keys(style).reduce((acc, key) => {
    const value = style[key];
    if (value) {
      acc += `${toKebabCase(key)}: ${value};`;
    }
    return acc;
  }, "");

  const js = `
    const playAudio = () => {
      const audio = new Audio("/alarm.mp3");
      audio.addEventListener("canplaythrough", (event) => (audio.play()));
    }
    const STATE = ["pomodoro", "short-break", "long-break"];
    const STATE_TITLE = {
      "pomodoro": "${timer.pomodoroTitle}",
      "short-break": "${timer.shortBreakTitle}",
      "long-break": "${timer.longBreakTitle}"
    }
    let sessions = 0;
    let currentSession = STATE[0];
    const pomodoro = ${timer.pomodoro}; // how many minutes in a pomodoro
    const now = new Date();
    let end = new Date(now.getTime() + pomodoro * 60000);
    const timer = setInterval(() => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      if (minutes < 0) {
            if (currentSession === "pomodoro") {
                sessions++;
                currentSession = STATE[1];
                end = new Date(now.getTime() + ${timer.shortBreak} * 60000);
                return playAudio();
            }
            if(currentSession === "short-break" && sessions === ${timer.longBreakInterval}) {
                sessions = 0;
                currentSession = STATE[2];
                end = new Date(now.getTime() + ${timer.longBreak} * 60000);
                return playAudio();
            }
            if(currentSession === "short-break" || currentSession === "long-break") {
                currentSession = STATE[0];
                end = new Date(now.getTime() + pomodoro * 60000);
                return playAudio();
            }
        }
      document.getElementById("timer-title").innerHTML = STATE_TITLE[currentSession];
      document.getElementById("timer-text").innerHTML = String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
    }, 1000);
  `;

  const html = `
  <!DOCTYPE html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            font-size: 15vw;
            text-align: center;
            display: grid;
            place-content: center;
            min-height: 100vh;
            ${css}
          }
        </style>
    </head>
    <body>
        <div id="timer-title"></div>
        <div id="timer-text"></div>
        <script>${js}</script>
    </body>
    </html>
  `;

  return res.status(200).send(html);
};

export default handler;
