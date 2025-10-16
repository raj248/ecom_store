import { useQuery } from "@tanstack/react-query";
import ProductServices from "../../services/ProductServices";
import CategoryServices from "../../services/CategoryServices";
import Image from "next/image";

const HomeImages = () => {
  // Fetch all categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  // Get first 4 category objects
  const first4Categories = categories?.[0]?.children?.slice(0, 4) || [];

  // Fetch products for those 4 categories
  const { data: productsByCategory } = useQuery({
    queryKey: ["categoryProducts", first4Categories.map((c) => c._id)],
    queryFn: async () => {
      const results = await Promise.all(
        first4Categories.map(async (cat) => {
          const res = await ProductServices.getShowingStoreProducts({
            category: cat._id,
          });
          return { products: res.products?.slice(0, 4) };
        })
      );
      return results;
    },
    enabled: first4Categories.length > 0,
  });

  if (!productsByCategory) return null;

  return (
    <div className="flex w-full">
      {productsByCategory.slice(0, 4).map(({ products }, index) => {
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];

        return (
          <div key={index} className="flex-1">
            <Image
              src={
                randomProduct?.image?.[0] ||
                "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
              }
              alt={randomProduct?.title || "product"}
              width={0}
              height={0}
              sizes="25vw"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HomeImages;
