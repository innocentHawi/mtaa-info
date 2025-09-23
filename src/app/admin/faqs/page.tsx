"use client";
import { useEffect, useState } from "react";
import AdminLogout from "@/components/AdminLogout"

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

  const deleteFaq = async (id: number) => {
    await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const updateFaq = async (id: number, data: { question: string; answer: string }) => {
    const res = await fetch(`/api/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setFaqs(faqs.map(f => (f.id === id ? updated : f)));
  };

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

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">FAQs Admin Panel</h1>
        <AdminLogout />
      </div>

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

      <h1 className="text-xl font-bold mb-4">Manage FAQs</h1>
      {faqs.map(faq => (
        <div key={faq.id} className="border p-3 mb-2 rounded">
          <p className="font-semibold">{faq.question}</p>
          <p>{faq.answer}</p>
          <button
            onClick={() => deleteFaq(faq.id)}
            className="text-red-500 mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => {
              const newAnswer = prompt("Edit answer:", faq.answer);
              if (newAnswer) updateFaq(faq.id, { question: faq.question, answer: newAnswer });
            }}
            className="text-blue-500"
          >
            Edit
          </button>
        </div>
      ))}
      
    </div>
  );
}
