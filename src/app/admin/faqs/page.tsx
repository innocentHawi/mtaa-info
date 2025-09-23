"use client";
import { useEffect, useState } from "react";

export default function FaqAdminPage() {
  const [faqs, setFaqs] = useState<{ id: number; question: string; answer: string }[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Load FAQs
  useEffect(() => {
    fetch("/api/faqs")
      .then(res => res.json())
      .then(setFaqs);
  }, []);

  async function addFaq() {
    if (!question || !answer) return;
    const res = await fetch("/api/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    const newFaq = await res.json();
    setFaqs([...faqs, newFaq]);
    setQuestion("");
    setAnswer("");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">FAQ Admin</h1>

      <div className="mb-6">
        <input
          className="border p-2 mr-2"
          placeholder="Question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Answer"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />
        <button
          onClick={addFaq}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add FAQ
        </button>
      </div>

      <ul>
        {faqs.map(f => (
          <li key={f.id} className="mb-2 border-b pb-2">
            <strong>{f.question}</strong>
            <p>{f.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
