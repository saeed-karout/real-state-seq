import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    const filteredQuery = {};
    if (query.type) filteredQuery.type = query.type;
    if (query.city) filteredQuery.city = query.city;
    if (query.property) filteredQuery.property = query.property;
    if (query.minPrice && parseInt(query.minPrice) > 0) filteredQuery.minPrice = query.minPrice;
    if (query.maxPrice && parseInt(query.maxPrice) > 0) filteredQuery.maxPrice = query.maxPrice;
    if (query.bedroom) filteredQuery.bedroom = query.bedroom;
    setSearchParams(filteredQuery);
  };

  return (
    <div className="filter">
      <h1>
        نتائج البحث عن <b>{searchParams.get("city") || "جميع المدن"}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">الموقع</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="موقع المدينة"
            onChange={handleChange}
            value={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">النوع</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            <option value="">أي</option>
            <option value="buy">شراء</option>
            <option value="rent">إيجار</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">العقار</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            value={query.property}
          >
            <option value="">أي</option>
            <option value="apartment">شقة</option>
            <option value="house">منزل</option>
            <option value="condo">شقة مشتركة</option>
            <option value="land">أرض</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">الحد الأدنى للسعر</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="أي"
            onChange={handleChange}
            value={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">الحد الأقصى للسعر</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="أي"
            onChange={handleChange}
            value={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">غرف النوم</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="أي"
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;