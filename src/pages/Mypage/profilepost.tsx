/** @format */

import { Input, Radio, Select, Form, Label } from "@/components/ui/form";

import * as React from "react";
import {
  educationOptions,
  stateOptions,
  targetCompany,
  experienceOptions,
} from "../../constants/mainContents";
import { useForm } from "react-hook-form";
import { useJobCategory } from "./api/get-jobcategory";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { fetchAndLogImage, formatBirthday } from "../../utils/format";
import { usePostProfile } from "./api/post-profile";

import ProfilePreview from "./components/profilepreview";

import { useNavigate, useSearchParams } from "react-router";
import { paths } from "@/config/paths";
import LoadingGradient from "@/components/ui/spinner/loadingSpinner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setIsLogin } from "@/store/slices/uistate";
import SelectSchool from "@/app/routes/selectschool";
import { translateDepartment } from "@/constants/openaiTransalte";

const ProfilePost = () => {
  const [loading, isLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const { data } = useJobCategory({});
  const jobGroups = data?.data ?? [];
  const form = useForm<any>({
    defaultValues: {
      name: "",
      jobCode: "",
      jobDetailCode: "",
      birthday: "",
      experienceType: "신입",
      educationLevel: "",
      educationStatus: "",
      targetCompanySize: "",
      university: "",
      major: "",
    },
  });
  const initializedRef = React.useRef(false);

  const jobCode = form.watch("jobCode");
  // const jobDetailCode = form.watch("jobDetailCode");

  // 버튼누르면 작동해서 값이다 초기화가 되어버린다.
  //
  React.useEffect(() => {
    if (!initializedRef.current && jobGroups.length > 0) {
      console.log(jobGroups[0]?.details[0]?.jobDetailCode);

      form.reset({
        jobCode: jobGroups[0].jobCode,
        jobDetailCode: jobGroups[0]?.details[0]?.jobDetailCode ?? "",
        // 다른 필드도 필요 시 설정
        name: form.getValues("name"),
        birthday: form.getValues("birthday"),
        experienceType: form.getValues("experienceType"),
        educationLevel: form.getValues("educationLevel"),
        educationStatus: form.getValues("educationStatus"),
        targetCompanySize: form.getValues("targetCompanySize"),
      });

      initializedRef.current = true;
    }
  }, [jobGroups]);

  // jobcode를 선택햇을때 jobdetail의 1번째 요소를 자동으로 지정해준다.
  React.useEffect(() => {
    if (!jobCode) return;

    const selectedGroup = jobGroups.find((group) => group.jobCode === jobCode);
    const firstDetailCode = selectedGroup?.details[0].jobDetailCode;
    console.log(firstDetailCode);

    if (firstDetailCode) {
      form.setValue("jobDetailCode", firstDetailCode ?? "");
    }
  }, [jobCode, jobGroups]);

  const jobGroup = jobGroups.find((group) => group.jobCode === jobCode);
  const jobDetails = jobGroup?.details ?? [];
  const dispatch = useDispatch<AppDispatch>();

  //프로필 등록 하고 나면 , mypage 로 이동해서 바로 확인할수있도록,
  //프로필 등록에 실패하면
  const registerProfile = usePostProfile({
    mutationConfig: {
      onMutate: () => {
        isLoading(true);
      },
      onSuccess: () => {
        navigate(redirectTo ? redirectTo : paths.mypage.root.path, {
          replace: true,
        });
        dispatch(setIsLogin(true));
      },
      onSettled: () => {
        isLoading(false);
      },
    },
  });
  //state끌어올리기
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    // 서버 업로드 or FormData 처리 등
  };
  const data2 = form.getValues("jobDetailCode");
  console.log(data2);
  translateDepartment("경영학과");
  return (
    <Form
      className="space-y-[20px]"
      form={form}
      onSubmit={async (value) => {
        const formData = new FormData();
        let imageFile: File | null | undefined = selectedFile;
        if (!imageFile) {
          try {
            imageFile = await fetchAndLogImage(); // ✅ Promise 처리
          } catch (error) {
            console.error("이미지 파일 변환 실패:", error);
            return; // 요청 중단
          }
        }

        if (imageFile) {
          formData.append("image", imageFile); // ✅ 실제 File 추가
        }

        // 데이터 추가
        formData.append(
          "data",
          new Blob([JSON.stringify(value)], { type: "application/json" })
        );

        console.log(value, "value");
        registerProfile.mutate(formData);
      }}
    >
      {({ register, control }) => (
        <>
          {loading && <LoadingGradient></LoadingGradient>}
          <ProfilePreview onSelectFile={handleFileSelect}></ProfilePreview>
          <div className="flex flex-row h-[60px] items-center">
            <Label className="w-[143px] text-[20px] font-semibold">이름</Label>
            <Input
              profile={true}
              className="w-[150px] h-[60px]  pl-[23px]  text-[18px] font-medium"
              {...register("name")}
            />
          </div>
          <div className="flex flex-row justify-start h-[60px] items-center ">
            <Label className="w-[143px] text-[20px] font-semibold">
              생년월일
            </Label>
            <Input
              profile={true}
              className="w-[266px] h-[60px] text-[18px] font-medium"
              {...register("birthday")}
              onChange={(e) => {
                const formatted = formatBirthday(e.target.value);
                form.setValue("birthday", formatted);
              }}
              placeholder="2025-04-25"
            ></Input>
          </div>

          <div className="flex flex-row  items-center ">
            <Label className="w-[143px] text-[20px] font-semibold">직무</Label>
            <div className="flex flex-row gap-x-[8px]">
              <Controller
                name="jobCode"
                control={control}
                render={({ field }) => (
                  <Select
                    className="w-[227px]"
                    value={field.value}
                    labelkey="jobGroup"
                    valuekey="jobCode"
                    onChange={field.onChange}
                    options={jobGroups}
                  />
                )}
              />
              <Controller
                control={control}
                name="jobDetailCode"
                render={({ field }) => (
                  <Select
                    className="w-[227px]"
                    value={field.value}
                    labelkey="jobDetail"
                    valuekey="jobDetailCode"
                    onChange={field.onChange}
                    options={jobDetails}
                  />
                )}
              />{" "}
            </div>
          </div>

          <div className="flex flex-row items-center ">
            <Label className="w-[143px] text-[20px] font-semibold">경력</Label>
            <Radio className="" name="exp" options={experienceOptions}></Radio>
          </div>

          <div className="flex items-center  flex-row ">
            <Label className="w-[143px] text-[20px] font-semibold">학력</Label>
            <div className="flex flex-row gap-[8px]">
              <Controller
                name="educationLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    labelkey="label"
                    valuekey="value"
                    className="w-[266px] "
                    value={field.value}
                    onChange={field.onChange}
                    options={educationOptions}
                  />
                )}
              />

              <Controller
                name="educationStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    className="w-[266px]"
                    labelkey="label"
                    valuekey="value"
                    value={field.value}
                    onChange={field.onChange}
                    options={stateOptions}
                  />
                )}
              />
              {/* <Input className="w-[142px]  "></Input>
            <Input className="w-[142px] "></Input> */}
            </div>
          </div>

          <SelectSchool control={control} name="university"></SelectSchool>

          <div className=" items-center  flex flex-row ">
            <Label className="w-[143px] text-[20px] font-semibold">
              희망 기업
            </Label>
            <Controller
              name="targetCompanySize"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-[194px] "
                  labelkey="label"
                  valuekey="value"
                  options={targetCompany}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div
            className=" flex 
          
              translate-x-22
          mt-[139px] items-center"
          >
            <Button
              type="submit"
              className=" 
              w-[60%]
              cursor-pointer rounded-[10px]   font-semibold flex items-center justify-center h-[65px]   leading-[150%] text-[24px]"
            >
              입력 완료
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default ProfilePost;
