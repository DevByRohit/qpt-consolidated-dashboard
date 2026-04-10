import { useCards } from "../dashboard/CardContext";
import CardItem from "../dashboard/CardItem";
import { useOutletContext } from "react-router-dom";

function Index({ setAlert }) {
  const { cards, loading } = useCards();
  const { searchQuery } = useOutletContext();
  const user = JSON.parse(localStorage.getItem("user"));

  const query = searchQuery?.toLowerCase() || "";

  // ✅ If no search → show empty or welcome
  if (!query) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-lg font-medium">
          Start typing in the search bar to find cards
        </p>
      </div>
    );
  }

  // ✅ Global filtering (NO module filter)
  const filteredCards = cards.filter((card) => {
    return (
      card.title?.toLowerCase().includes(query) ||
      card.url?.toLowerCase().includes(query)
    );
  });

  // ✅ Group by module
  const grouped = {
    fms: filteredCards.filter((c) => c.module === "fms"),
    ims: filteredCards.filter((c) => c.module === "ims"),
    pms: filteredCards.filter((c) => c.module === "pms"),
    dashboard: filteredCards.filter((c) => c.module === "dashboard"),
  };

  return (
    <div className="space-y-8">
      {/* ❌ No Result UI */}
      {filteredCards.length === 0 && !loading && (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-2xl font-medium">No cards found</p>
          <p className="text-sm mt-1">
            We couldn’t find any cards matching your search. Try a different
            keyword.
          </p>
        </div>
      )}

      {/* ✅ Grouped Results */}
      {Object.entries(grouped).map(([module, items]) =>
        items.length > 0 ? (
          <div key={module}>
            <h2 className="text-xl font-semibold mb-3 uppercase text-gray-700">
              {module}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  user={user}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}

export default Index;
