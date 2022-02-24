import { useState } from "react";

import "./App.css";

function App() {
  const [config, setConfig] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });

  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

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

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Pomodorzilla</h1>
        <a href="https://github.com/eliutdev/pomodorzilla" target="_blank">
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
              value={config.pomodoro}
              onChange={(e) =>
                setConfig({ ...config, pomodoro: parseInt(e.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="short-break">Short Break</label>
            <input
              type="number"
              id="short-break"
              value={config.shortBreak}
              onChange={(e) =>
                setConfig({ ...config, shortBreak: parseInt(e.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="long-break">Long Break</label>
            <input
              type="number"
              id="long-break"
              value={config.longBreak}
              onChange={(e) =>
                setConfig({ ...config, longBreak: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
        <div>
          <label htmlFor="long-break-interval">Long Break Interval</label>
          <input
            type="number"
            id="long-break-interval"
            value={config.longBreakInterval}
            onChange={(e) =>
              setConfig({
                ...config,
                longBreakInterval: parseInt(e.target.value),
              })
            }
          />
          <small>(number of pomodoros before a long break)</small>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate url"}
        </button>
        {url && (
          <p className="url">
            <small>
              Copy and paste this URL into your OBS to start working
            </small>
            <a href={url}>{url}</a>
          </p>
        )}
      </form>
    </>
  );
}

export default App;
