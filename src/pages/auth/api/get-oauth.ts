/** @format */

import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";

// import { api } from "@/lib/api-client";

// export const oauth;

export const getOauth = (params) => {
  console.log(`/oauth-redirect/?token=${params}`);
  return api.get(`/oauth-redirect?token=${params}`);
};
//소셜 로그인은 바로바로 요청
export const getOauthQuery = (params) => {
  return queryOptions({
    queryKey: ["oauth"],
    queryFn: () => getOauth(params),
    staleTime: 0,
    gcTime: 0,
  });
};

type useOauthQueryOptions = {
  params: string;
  queryConfig?: QueryConfig<typeof getOauthQuery>;
};

export const useGetOauth = ({ params, queryConfig }: useOauthQueryOptions) => {
  return useQuery({
    ...queryConfig,
    ...getOauthQuery(params),
  });
};
