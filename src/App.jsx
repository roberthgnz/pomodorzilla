import { useEffect, useState } from "react";

import "./App.css";
import { Preview } from "./Preview/Preview";
import { fontAvailable } from "./utils/fonts";

function App() {
  const [config, setConfig] = useState({
    timer: {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      pomodoroTitle: "Pomodoro",
      shortBreakTitle: "Short Break",
      longBreakTitle: "Long Break",
      longBreakInterval: 4,
    },
    style: {
      fontFamily: "Impact",
      color: "#ffff",
    },
  });

  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    fontAvailable().then(setFonts);
  }, []);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    const response = await fetch("/api/pomodoro", {
      body: JSON.stringify(config),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setLoading(false);
    setUrl(`${window.location.origin}/api/pomodoro/${data.encodedSettings}`);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    if (name === "fontFamily" || name === "color") {
      setConfig({
        ...config,
        style: {
          ...config.style,
          [name]: value,
        },
      });
    } else {
      setConfig({
        ...config,
        timer: {
          ...config.timer,
          [name]: value,
        },
      });
    }
  };

  return (
    <div className="wrapper">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Pomodorzilla</h1>
        <a href="https://github.com/HolaSoyGonZzA/pomodorzilla" target="_blank">
          GitHub
        </a>
      </header>
      <form onSubmit={handleSubmit}>
        <h2>Timer settings</h2>
        <div>
          <span>Time (minutes):</span>
        </div>
        <div className="control-horizontal">
          <div>
            <label htmlFor="pomodoro">Pomodoro</label>
            <input
              type="number"
              id="pomodoro"
              name="pomodoro"
              value={config.timer.pomodoro}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="short-break">Short Break</label>
            <input
              type="number"
              id="short-break"
              name="shortBreak"
              value={config.timer.shortBreak}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="long-break">Long Break</label>
            <input
              type="number"
              id="long-break"
              name="longBreak"
              value={config.timer.longBreak}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="control-horizontal">
          <div>
            <label htmlFor="pomodoro-title">Pomodoro Title</label>
            <input
              type="text"
              id="pomodoro-title"
              name="pomodoroTitle"
              value={config.timer.pomodoroTitle}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="short-break-title">Short Break Title</label>
            <input
              type="text"
              id="short-break-title"
              name="shortBreakTitle"
              value={config.timer.shortBreakTitle}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="long-break-title">Long Break Title</label>
            <input
              type="text"
              id="long-break-title"
              name="longBreakTitle"
              value={config.timer.longBreakTitle}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="control-horizontal">
          <div>
            <label htmlFor="long-break-interval">Long Break Interval</label>
            <input
              type="number"
              id="long-break-interval"
              name="longBreakInterval"
              value={config.timer.longBreakInterval}
              onChange={handleChange}
            />
            <small>(number of pomodoros before a long break)</small>
          </div>
          <div>
            <label htmlFor="font-family">Font</label>
            <select
              id="font-family"
              name="fontFamily"
              value={config.style.fontFamily}
              onChange={handleChange}
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="color">Color</label>
            <input
              type="color"
              id="color"
              name="color"
              value={config.style.color}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate url"}
        </button>
        <Preview title={config.timer.pomodoroTitle} style={config.style} />
        {url && (
          <p className="url">
            <small>
              Copy and paste this URL into your OBS to start working
            </small>
            <a href={url}>{url}</a>
          </p>
        )}
      </form>
    </div>
  );
}

export default App;
