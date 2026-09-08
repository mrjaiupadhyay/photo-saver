import { useState } from "react";

export default function VoiceInputButton({ onText }) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onText(text);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return (
    <button
      onClick={startListening}
      className={`rounded-full px-5 py-3 text-white shadow ${listening ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
    >
      {listening ? "Listening..." : "Voice Command"}
    </button>
  );
}
