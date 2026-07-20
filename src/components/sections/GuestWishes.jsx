import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle.jsx";
import Button from "../common/Button.jsx";

export default function GuestWishes() {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/wishes")
      .then((res) => res.json())
      .then(setWishes)
      .catch(() => setError("Couldn't load wishes right now."));
  }, []);

  const deleteWish = async (id) => {
    try {
      const res = await fetch(`/api/wishes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete wish");
      const updated = await res.json();
      setWishes(updated);
    } catch {
      setError("Couldn't delete that wish. Please try again.");
    }
  };

  const addWish = async () => {
    if (!name.trim() || !text.trim()) {
      setError("Please add both your name and a wish.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      if (!res.ok) throw new Error("Failed to save wish");
      const updated = await res.json();
      setWishes(updated);
      setName("");
      setText("");
    } catch {
      setError("Couldn't save your wish. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section" id="wishes">
      <SectionTitle eyebrow="Blessings" title="Guest Wishes" />

      <div className="wishes__form">
        <div className="field">
          <label className="field__label" htmlFor="wish-name">Your Name</label>
          <input
            id="wish-name"
            className="field__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="wish-text">Your Wish</label>
          <input
            id="wish-text"
            className="field__input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a blessing"
          />
        </div>
        <div className="field" style={{ justifyContent: "flex-end" }}>
          <Button solid onClick={addWish} disabled={submitting}>
            {submitting ? "Saving..." : "Add"}
          </Button>
        </div>
      </div>
      {error ? <p className="field__error" style={{ textAlign: "center", marginBottom: "16px" }}>{error}</p> : null}

      <ul className="wishes__list">
        <AnimatePresence initial={false}>
          {wishes.map((wish) => (
            <motion.li
              className="wish"
              key={wish.id}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                type="button"
                className="wish__delete"
                onClick={() => deleteWish(wish.id)}
                aria-label={`Delete wish from ${wish.name}`}
              >
                ×
              </button>
              <p className="wish__name">{wish.name}</p>
              <p className="wish__text">{wish.text}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
