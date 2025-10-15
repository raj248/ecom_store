import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoChevronForwardSharp } from "react-icons/io5";

// internal imports
import CategoryServices from "../../services/CategoryServices";
import CMSkeleton from "../../components/preloader/CMSkeleton";
import { SidebarContext } from "../../context/SidebarContext";
import useUtilsFunction from "../../hooks/useUtilsFunction";

const FeatureCategory = () => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const handleCategoryClick = (id, categoryName) => {
    const category_name = categoryName
      .toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");
    const url = `/search?category=${category_name}&_id=${id}`;
    router.push(url);
    setIsLoading(!isLoading);
  };

  return (
    <>
      {loading ? (
        <CMSkeleton count={10} height={20} error={error} loading={loading} />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
          {data[0]?.children?.map((category) => (
            <li key={category._id} className="group">
              <div
                className="flex flex-col items-center justify-center border border-gray-100 shadow-sm bg-white p-4 cursor-pointer transition duration-200 ease-linear transform hover:shadow-lg"
                onClick={() =>
                  handleCategoryClick(
                    category._id,
                    showingTranslateValue(category?.name)
                  )
                }
              >
                <div className="w-20 h-20 relative mb-2">
                  <Image
                    src={
                      category.icon ||
                      "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                    }
                    alt={showingTranslateValue(category?.name)}
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-sm text-gray-600 font-medium text-center line-clamp-1 group-hover:text-orange-500">
                  {showingTranslateValue(category?.name)}
                </h3>
                <ul className="pt-1 mt-1">
                  {category?.children?.slice(0, 3).map((child) => (
                    <li
                      key={child._id}
                      className="hover:text-orange-500 hover:ml-2 transition-all duration-150"
                    >
                      <a
                        onClick={() =>
                          handleCategoryClick(
                            child._id,
                            showingTranslateValue(child?.name)
                          )
                        }
                        className="flex items-center font-serif text-xs text-gray-400 cursor-pointer"
                      >
                        <span className="text-xs text-gray-400">
                          <IoChevronForwardSharp />
                        </span>
                        {showingTranslateValue(child?.name)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default FeatureCategory;
