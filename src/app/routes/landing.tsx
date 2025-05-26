/** @format */

import Footer from "./footer";
import LandingTopImage from "./components/landingTopImage";
import LandingCard from "./components/landingCard";
import LandingExplain from "./components/landingExplain";
import End from "./components/end";
import SelectSchool from "./selectschool";

function Apps() {
  return (
    <>
      <div className="relative flex justify-center items-center flex-col  w-[calc(100vw)]  max-w-[1980px] min-w-[1200x]">
        {/* <div
          className="absolute z-1  translate-y-[-1400px] min-w-[1980px]  min-h-[1980px] 
       bg-gradient-round rounded-full"
        ></div> */}
        <div
          className="
        bg-gradient-round rounded-full
        absolute   z-1 h-[4000px] w-[1980px] bottom-[55%] "
        ></div>
        {/* 랜딩 페이지 전체 */}
        <div className="    ">
          {/* 랜딩 페이지 배경 넣기  */}
          <div className="">
            {/* 이미지 및 면접하러가기 */}
            <div className="relative flex flex-col justify-center items-center">
              <LandingTopImage></LandingTopImage>
            </div>
            {/* 카드형 ui 그래픽 함께 */}
            <div
              className="    
              
              w-[calc(100vw)] min-w-[1200px] max-[1980px] bg-gradient-landing-top
"
            >
              <div
                className="
          flex items-center justify-center"
              >
                <LandingCard></LandingCard>
              </div>
              {/* 프로젝트를 설명하는 부분 레이아웃 */}
              <LandingExplain></LandingExplain>
            </div>
          </div>
          <SelectSchool></SelectSchool>

          {/* 서비스 이용 안내 및 마지막부분에 시작하기 넣기(로그인, 면접하러가기) */}
        </div>
        <End></End>
        <Footer></Footer>
      </div>
    </>
  );
}
export default Apps;
