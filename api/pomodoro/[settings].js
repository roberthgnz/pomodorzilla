import { decode } from "js-base64";

const handler = async (req, res) => {
  const { settings } = req.query;
  const parsedSettings = JSON.parse(decode(settings));

  const js = `
    const STATES = ["pomodoro", "short-break", "long-break"];
    let sessions = 0;
    let currentSession = STATES[0];
    const capitalize = text => {
      return text.split('-').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    };
    const pomodoro = ${parsedSettings.pomodoro}; // how many minutes in a pomodoro
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
                currentSession = STATES[1];
                end = new Date(now.getTime() + ${parsedSettings.shortBreak} * 60000);
                return;
            }
            if(currentSession === "short-break" && sessions === ${parsedSettings.longBreakInterval}) {
                sessions = 0;
                currentSession = STATES[2];
                end = new Date(now.getTime() + ${parsedSettings.longBreak} * 60000);
                return;
            }
            if(currentSession === "short-break" || currentSession === "long-break") {
                currentSession = STATES[0];
                end = new Date(now.getTime() + pomodoro * 60000);
                return;
            }
        }
      document.getElementById("timer-title").innerHTML = capitalize(currentSession);
      document.getElementById("timer-text").innerHTML = String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
    }, 1000);
  `;

  const html = `
  <!DOCTYPE html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>pomodorzilla</title>
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            font-size: 20vw;
            text-align: center;
            display: grid;
            place-content: center;
            min-height: 100vh;
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
