import { useQuery } from "@tanstack/react-query";
import ProductServices from "../../services/ProductServices";
import CategoryServices from "../../services/CategoryServices";

const FetchCategoryProducts = () => {
  // Fetch all categories
  const {
    data: categories,
    isLoading: catLoading,
    error: catError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  console.log("categories", categories);
  // Get first 4 category IDs
  const first4CategoryIds =
    categories?.[0].children?.slice(0, 4).map((cat) => {
      console.log(cat);
      return cat._id;
    }) || [];

  // Fetch products for those 4 categories
  const {
    data: products,
    isLoading: prodLoading,
    error: prodError,
  } = useQuery({
    queryKey: ["categoryProducts", first4CategoryIds],
    queryFn: async () => {
      // Fetch products category by category
      console.log("Fetching products for categories:", first4CategoryIds);
      const allProducts = await Promise.all(
        first4CategoryIds.map((id) =>
          ProductServices.getShowingStoreProducts({ category: id })
        )
      );
      return allProducts.flat(); // flatten the array
    },
    enabled: first4CategoryIds.length > 0, // only fetch if we have categories
  });

  if (catLoading || prodLoading) return <p>Loading...</p>;
  if (catError || prodError) return <p>Error loading data</p>;

  console.log("First 4 categories:", first4CategoryIds);
  console.log("Products for categories:", products);

  return <div>hello</div>;
};

export default FetchCategoryProducts;
