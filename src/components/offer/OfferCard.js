import React from "react";

//internal import
import Coupon from "../../components/coupon/Coupon";
import useGetSetting from "../../hooks/useGetSetting";
import useUtilsFunction from "../../hooks/useUtilsFunction";

const OfferCard = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <div className="w-full h-full flex-shrink-0 min-h-0 group">
      <div className="bg-gray-50 h-full border-2 border-orange-500 transition duration-150 ease-linear transform group-hover:border-emerald-500 rounded shadow flex flex-col">
        <div className="bg-orange-100 text-gray-900 px-6 py-2 rounded-t border-b flex items-center justify-center flex-shrink-0">
          <h3 className="text-base font-serif font-medium ">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.discount_title
            )}
          </h3>
        </div>
        <div className="overflow-hidden flex-1 p-2.5">
          <Coupon couponInHome />
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
