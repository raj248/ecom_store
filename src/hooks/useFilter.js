import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const useFilter = (data) => {
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [sortedField, setSortedField] = useState("");
  const router = useRouter();

  // console.log("sortedfield", sortedField, data);

  const productData = useMemo(() => {
    let services = data;
    //filter user order
    if (router.pathname === "/user/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "pending"
      );
      setPending(orderPending);

      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "processing"
      );
      setProcessing(orderProcessing);

      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "delivered"
      );
      setDelivered(orderDelivered);
    }

    //service sorting with low and high price
    if (sortedField === "Low") {
      services = services?.sort(
        (a, b) => a.prices.price < b.prices.price && -1
      );
    }
    if (sortedField === "High") {
      services = services?.sort(
        (a, b) => a.prices.price > b.prices.price && -1
      );
    }

    return services;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedField, data]);

  return {
    productData,
    pending,
    processing,
    delivered,
    setSortedField,
  };
};

export default useFilter;
