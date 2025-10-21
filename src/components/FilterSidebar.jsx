import { useQuery } from "@tanstack/react-query";
import { categoriesApi, tagsApi } from "../services/blogApi";

const FilterSidebar = ({
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagChange,
  onResetFilters,
  postCounts = {},
}) => {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  return (
    <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Filter By</h2>

      {/* Categories Filter */}
      <div className="mb-8">
        {categoriesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between"
              >
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-200 rounded-full w-8"></div>
              </div>
            ))}
          </div>
        ) : (
          categories &&
          categories.length > 0 && (
            <div className="space-y-3">
              {categories.map((category) => {
                const count = postCounts.categories?.[category.id] || 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <span className="font-semibold text-lg">
                      {category.name}
                    </span>
                    <span
                      className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? "bg-white/20"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Tags Filter */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Tags</h3>
        {tagsLoading ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse h-9 bg-gray-200 rounded-full w-24"
              ></div>
            ))}
          </div>
        ) : (
          tags &&
          tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => onTagChange(tag.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Reset Filter Button */}
      {(selectedCategory || selectedTags.length > 0) && (
        <button
          onClick={onResetFilters}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Reset Filter
        </button>
      )}
    </div>
  );
};

export default FilterSidebar;
