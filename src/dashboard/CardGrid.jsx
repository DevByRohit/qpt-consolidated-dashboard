import CardItem from "./CardItem";
import { useCards } from "../dashboard/CardContext";
import EditCardModal from "./EditCardModal";
import { useState } from "react";
import Loader from "../alert-modal/Loader";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzwbyEVzFVowbjK0VAFcq3buB1vCLWty3inW_KrDoiy1LpLwnUvLwv5g54r6Q1219NGPQ/exec";

const CardGrid = ({ module, setAlert, searchQuery }) => {
  const { cards, loading, fetchCards } = useCards();
  const user = JSON.parse(localStorage.getItem("user"));

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // delete loading
  const [isDeleting, setIsDeleting] = useState(false);

  // filter logic
  const filteredCards = cards.filter((card) => {
    const matchesModule = card.module === module;

    const matchesSearch =
      !searchQuery ||
      card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.url?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesModule && matchesSearch;
  });

  // ✅ DELETE
  const handleDelete = (card) => {
    setAlert({
      open: true,
      title: "Delete Card",
      message: "Are you sure you want to delete this card?",
      type: "confirm",
      onConfirm: async () => {
        try {
          // close alert first
          setAlert((prev) => ({ ...prev, open: false }));

          await new Promise((r) => setTimeout(r, 100));

          setIsDeleting(true);

          await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
              action: "delete",
              id: card.id,
            }),
          });

          setAlert({
            open: true,
            title: "Success",
            message: "Card deleted successfully",
            type: "info",
          });

          await fetchCards();
        } catch (err) {
          setAlert({
            open: true,
            title: "Error",
            message: "Delete failed",
            type: "info",
          });
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  // ✅ EDIT
  const handleEdit = (card) => {
    setSelectedCard(card);
    setIsEditOpen(true);
  };

  return (
    <>
      {/* GLOBAL LOADER */}
      {(loading || isDeleting) && (
        <Loader
          message={isDeleting ? "Deleting card..." : "Loading cards..."}
          subMessage="Please wait"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            user={user}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        <EditCardModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={fetchCards}
          setAlert={setAlert}
          card={selectedCard}
        />

        {filteredCards.length === 0 && !loading && (
          <div className="col-span-full flex gap-1 flex-col items-center justify-center mt-28 text-gray-600">
            <p className="text-2xl font-medium">No cards found</p>
            <p className="mt-1">
              We couldn’t find any system matching your search.
            </p>
            <p>Try a different keyword.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CardGrid;
