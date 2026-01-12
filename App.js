import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [surveys, setSurveys] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/survey")
      .then(res => res.json())
      .then(data => setSurveys(data));
  }, []);

  const createSurvey = () => {
    fetch("http://localhost:5000/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        question,
        options: options.split(","),
        responses: []
      })
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Survey</h2>

      <input placeholder="Title" onChange={e => setTitle(e.target.value)} /><br/><br/>
      <input placeholder="Question" onChange={e => setQuestion(e.target.value)} /><br/><br/>
      <input placeholder="Options (comma separated)" onChange={e => setOptions(e.target.value)} /><br/><br/>

      <button onClick={createSurvey}>Create</button>

      <h2>Surveys</h2>
      {surveys && surveys.map(s => (
        <div key={s._id}>
          <h4>{s.title}</h4>
          <p>{s.question}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
