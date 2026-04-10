import CardItem from "./CardItem";
import { useCards } from "../dashboard/CardContext";
import EditCardModal from "./EditCardModal";
import { useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzwbyEVzFVowbjK0VAFcq3buB1vCLWty3inW_KrDoiy1LpLwnUvLwv5g54r6Q1219NGPQ/exec";

const CardGrid = ({ module, setAlert, searchQuery }) => {
  const { cards, loading, fetchCards } = useCards();
  const user = JSON.parse(localStorage.getItem("user"));

  // hadle edit state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // filter logic
  const filteredCards = cards.filter((card) => {
    const matchesModule = card.module === module;

    const matchesSearch =
      !searchQuery || // 👈 important
      card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.url?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesModule && matchesSearch;
  });

  // ✅ Delete handler
  const handleDelete = (card) => {
    setAlert({
      open: true,
      title: "Delete Card",
      message: "Are you sure you want to delete this card?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
              action: "delete",
              id: card.id,
            }),
          });

          fetchCards(); // 🔁 global refresh
        } catch (err) {
          console.error("Delete failed", err);
        }
      },
    });
  };

  // ✅ Edit handler
  const handleEdit = (card) => {
    setSelectedCard(card);
    setIsEditOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
            We couldn’t find any cards matching your search.
          </p>
          <p>Try a different keyword.</p>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
