import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase.js";
import SectionTitle from "../common/SectionTitle.jsx";
import Button from "../common/Button.jsx";

const wishesQuery = query(collection(db, "wishes"), orderBy("createdAt", "desc"));

export default function GuestWishes() {
  const [wishes, setWishes] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      wishesQuery,
      (snapshot) => {
        setWishes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => setError("Couldn't load wishes right now.")
    );
    return unsubscribe;
  }, []);

  const deleteWish = async (id) => {
    try {
      await deleteDoc(doc(db, "wishes", id));
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
      await addDoc(collection(db, "wishes"), {
        name: name.trim(),
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
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
