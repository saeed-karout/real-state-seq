import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["شراء", "إيجار"];
const typeMap = {
  "شراء": "buy",
  "إيجار": "rent",
};

function SearchBar() {
  const [query, setQuery] = useState({
    type: "شراء",
    city: "",
    minPrice: "", // القيمة الافتراضية فارغة
    maxPrice: "", // القيمة الافتراضية فارغة
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const translatedType = typeMap[query.type];
  const searchParams = new URLSearchParams();
  if (translatedType) searchParams.set("type", translatedType);
  if (query.city) searchParams.set("city", query.city);
  if (query.minPrice && parseInt(query.minPrice) > 0) searchParams.set("minPrice", query.minPrice);
  if (query.maxPrice && parseInt(query.maxPrice) > 0) searchParams.set("maxPrice", query.maxPrice);

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="city"
          placeholder="المدينة"
          value={query.city}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="أقل سعر"
          value={query.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="أعلى سعر"
          value={query.maxPrice}
          onChange={handleChange}
        />
          <Link to={`/list?type=${translatedType}${query.city ? `&city=${query.city}` : ''}${query.minPrice ? `&minPrice=${query.minPrice}` : ''}${query.maxPrice ? `&maxPrice=${query.maxPrice}` : ''}`}>
            <button type="button">
              <img src="/search.png" alt="" />
            </button>
          </Link>
      </form>
    </div>
  );
}

export default SearchBar;