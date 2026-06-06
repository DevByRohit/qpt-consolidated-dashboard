const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: "Total Raw Materials",
      value: summary.total_materials,
    },
    {
      title: "Short Raw Materials",
      value: summary.short_items,
    },
    {
      title: "Total Production Cost",
      value: `₹ ${summary.total_production_cost?.toLocaleString()}`,
    },
    {
      title: "Minimum Selling Price",
      value: `₹ ${summary.minimum_selling_price?.toLocaleString()}`,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mt-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-transparent border-2 border-gray-400 rounded-lg text-center p-2">
          <p className="text-xl text-gray-700 font-medium">{card.title}</p>
          <h3 className="text-2xl font-semibold mt-2">{card.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
