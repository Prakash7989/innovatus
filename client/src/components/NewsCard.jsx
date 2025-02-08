import React from "react";
import { Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function NewsCard({ article, onSave, theme, savedArticle = false }) {
  const handleReadMore = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    let categoryScores = {};
    if (userDoc.exists()) {
      categoryScores = userDoc.data().categoryScores || {};
    }

    // Increment category score
    article.category.forEach((cat) => {
      categoryScores[cat] = (categoryScores[cat] || 0) + 1;
    });

    await setDoc(userRef, { categoryScores }, { merge: true });
  };
  // const { theme } = theme();
  const handleClick = (event) => {
    event.stopPropagation();
    onSave?.(article);
    handleReadMore();

    toast(article.isSaved ? "Removed from saved articles" : "Saved!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: theme === "dark" ? "toast-dark" : "toast-light",
      progressClassName: theme === "dark" 
        ? "Toastify__progress-bar--dark" 
        : "Toastify__progress-bar--light"
    });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl group">
      <div className="relative w-full h-[450px] sm:h-[550px]">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white">
        <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
          {article.title}
        </h3>
        <p className="text-base sm:text-lg opacity-80 mb-6 line-clamp-3">
          {article.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm opacity-80">
            <Clock className="w-5 h-5 mr-2" />
            <span>{article.readTime || "5"} min read</span>
          </div>
          <div className="flex gap-4">
            {!savedArticle && (
              <button
                onClick={handleClick}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                {article.isSaved ? (
                  <BookmarkCheck className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Bookmark className="w-6 h-6 text-white" />
                )}
              </button>
            )}

            <a
              href={article.url}
              onClick={handleReadMore}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-lg font-medium transition bg-opacity-40"
            >
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
