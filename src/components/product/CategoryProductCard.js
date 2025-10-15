import { useQuery } from "@tanstack/react-query";
import ProductServices from "../../services/ProductServices";
import CategoryServices from "../../services/CategoryServices";
import ProductCard from "./ProductCard";
import useUtilsFunction from "../../hooks/useUtilsFunction";

const FetchCategoryProducts = () => {
  const { showingTranslateValue } = useUtilsFunction();

  // Fetch all categories
  const {
    data: categories,
    isLoading: catLoading,
    error: catError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  // Get first 4 category objects
  const first4Categories = categories?.[0]?.children?.slice(0, 4) || [];

  // Fetch products for those 4 categories
  const {
    data: productsByCategory,
    isLoading: prodLoading,
    error: prodError,
  } = useQuery({
    queryKey: ["categoryProducts", first4Categories.map((c) => c._id)],
    queryFn: async () => {
      const results = await Promise.all(
        first4Categories.map(async (cat) => {
          const res = await ProductServices.getShowingStoreProducts({
            category: cat._id,
          });
          // Limit to 4 products per category
          return { category: cat, products: res.products?.slice(0, 4) };
        })
      );
      return results;
    },
    enabled: first4Categories.length > 0,
  });

  if (catLoading || prodLoading) return <p>Loading...</p>;
  if (catError || prodError) return <p>Error loading data</p>;

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {productsByCategory?.map(({ category, products }) => (
        <div
          key={category._id}
          className="w-[280px] bg-gray-50 border rounded-lg shadow-sm p-4 flex-shrink-0"
        >
          <h2 className="text-md font-semibold mb-3 text-gray-800 text-center truncate">
            {showingTranslateValue(category.name)}
          </h2>

          {/* 2x2 small grid */}
          <div className="grid grid-cols-2 gap-3">
            {products?.map((product) => (
              <div
                key={product._id}
                className="transform scale-95 hover:scale-100 transition"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FetchCategoryProducts;
