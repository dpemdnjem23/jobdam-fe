/** @format */

import { useNavigate, useSearchParams } from "react-router";
import { useGetOauth } from "./api/get-oauth";
import { useEffect } from "react";
import { getAccessToken, saveTokens } from "@/lib/authSerivices";

const OauthCallback = () => {
  console.log("여기에 도착");
  const navigate = useNavigate();

  const [URLsearchParams] = useSearchParams();

  const token = URLsearchParams.get("token") ?? "";

  console.log(token);

  const { data, isSuccess } = useGetOauth({ params: token });

  useEffect(() => {
    if (isSuccess) {
      //   console.log(data);
      const token = data.headers["authorization"].replace("Bearer ", "");

      // header로 받아오 accesstoken저장하기

      saveTokens(token);
      navigate("/", { replace: true });
    }
  }, [data]);

  //데이털ㄹ 불러오는데 성공하면 다시 메인으로 넘어가기

  console.log(data);

  return <div>OAuth 처리 중...</div>;
};

export default OauthCallback;
