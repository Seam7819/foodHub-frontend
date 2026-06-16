import { useQuery } from "@tanstack/react-query";
import { getProviders } from "../services/provider.service";


export const useProviders =
  () => {
    return useQuery({
      queryKey: [
        "providers",
      ],

      queryFn:
        getProviders,
    });
  };