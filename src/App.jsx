import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [chatList, setChatList] = useState([]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    try {
      setChatList((prev) => [...prev, { source: "user", text: query }]);

      const apiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  text: "",
                },
                {
                  text: query,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": "AIzaSyCika5xFVWZZvA9wR3sR4NLxRUoJoxGxCQ",
            "Content-Type": "application/json",
          },
        },
      );

      const aiRes = apiRes.data.candidates[0].content.parts[0].text;
      setChatList((prev) => [...prev, { source: "ai", text: aiRes }]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1>ChatBot</h1>
      <br />

      <div className="pb-32">
        {chatList.map((ms, index) => (
          <div
            key={index}
            className={`w-full flex ${
              ms.source === "user"
                ? "justify-end bg-red-500"
                : ms.source === "ai"
                  ? "justify-start bg-green-500"
                  : ""
            }`}
          >
            <div>{ms.text}</div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleQuerySubmit}
        className="fixed bottom-0 left-0 w-full"
      >
        <div className="max-w-sm w-full space-y-3 ">
          <label htmlFor="query" className="sr-only">
            Name
          </label>
          <input
            id="query"
            type="text"
            className="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-layer border-layer-line sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Enter your name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <br />

        <div className="inline-flex flex-wrap gap-2">
          <button
            type="submit"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus disabled:opacity-50 disabled:pointer-events-none"
          >
            Submit
          </button>
        </div>
      </form>

      <img src="/image.png" alt="" className="w-24" />
    </>
  );
}

export default App;
