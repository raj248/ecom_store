import { useQuery } from "@tanstack/react-query";
import ProductServices from "../../services/ProductServices";
import CategoryServices from "../../services/CategoryServices";
import Image from "next/image";
import useUtilsFunction from "../../hooks/useUtilsFunction";

const FetchCategoryProductsRandomImage = () => {
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
      {productsByCategory?.map(({ category, products }) => {
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];

        return (
          <div
            key={category._id}
            className="w-[280px] bg-gray-50 border rounded-lg shadow-sm flex-shrink-0"
          >
            <h2 className="text-md font-semibold mb-2 text-gray-800 text-center truncate p-2">
              {showingTranslateValue(category.name)}
            </h2>

            {randomProduct && (
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={
                    randomProduct.image?.[0] ||
                    "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  }
                  alt={showingTranslateValue(randomProduct.title)}
                  fill
                  style={{ objectFit: "contain" }}
                  className="transition-transform duration-150 ease-in-out hover:scale-105"
                  sizes="100%"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FetchCategoryProductsRandomImage;
