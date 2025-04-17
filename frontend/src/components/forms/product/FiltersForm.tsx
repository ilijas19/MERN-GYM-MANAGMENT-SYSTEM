import React, { useState } from "react";
import { ProductFilters } from "../../ProductTable";

type FormProps = {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  onClose: () => void;
};

const FiltersForm = ({ filters, setFilters, onClose }: FormProps) => {
  const [localFilters, setLocalFilters] = useState<ProductFilters>({
    page: filters.page,
    name: filters.name,
    priceGte: filters.priceGte,
    priceLte: filters.priceLte,
  });

  const applyFilters = () => {
    setFilters({ ...localFilters, page: 1 }); // reset to page 1 when applying filters
    onClose();
  };

  const resetFilters = () => {
    const reset = {
      page: 1,
      name: "",
      priceGte: undefined,
      priceLte: undefined,
    };
    setFilters(reset);
    setLocalFilters(reset);
    onClose();
  };

  return (
    <form className="flex flex-col">
      <h2 className="font-semibold text-center text-lg">Filters</h2>

      <label htmlFor="">Name</label>
      <input
        value={localFilters.name}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, name: e.target.value })
        }
        type="text"
        className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
      />

      <div className="flex justify-between sm:flex-row flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="">Price Less Than</label>
          <input
            value={localFilters.priceLte ?? ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                priceLte: e.target.value ? +e.target.value : undefined,
              })
            }
            type="number"
            className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="">Price Greater Than</label>
          <input
            value={localFilters.priceGte ?? ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                priceGte: e.target.value ? +e.target.value : undefined,
              })
            }
            type="number"
            className="border border-gray-600 px-2 py-0.5 rounded outline-none mb-2"
          />
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <button
          type="button"
          onClick={resetFilters}
          className="bg-red-600 font-semibold px-3 py-0.5 rounded "
        >
          Reset
        </button>
        <button
          type="button"
          onClick={applyFilters}
          className="bg-white text-black font-semibold px-3 py-0.5 rounded "
        >
          Apply
        </button>
      </div>
    </form>
  );
};

export default FiltersForm;
