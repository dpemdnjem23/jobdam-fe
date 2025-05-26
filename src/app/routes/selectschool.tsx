/** @format */
import React from "react";
import universities from "@/constants/전국대학및전문대학정보표준데이터.json";
import Hangul from "hangul-js";
import { Label } from "@/components/ui/form";
import { Input } from "@/components/ui/form";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn";

type University = {
  학교명: string;
  "학교 영문명": string;
  제공기관코드: string;
};

type Props = {
  name: string;
  control: any;
  className?: any;
};

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const SelectSchool = ({ name, control, className }: Props) => {
  const { setValue } = useFormContext();
  const [input, setInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<University[]>([]);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);

  const debouncedInput = useDebounce(input, 200);

  const filterUniversities = (query: string) => {
    if (!query) return [];

    const disassembledQuery = Hangul.disassemble(query).join("");
    const filtered = universities.records.filter((item: { 학교명: string }) => {
      const disassembledName = Hangul.disassemble(item.학교명, true)
        .map((char) => (Array.isArray(char) ? char[0] : char))
        .join("");

      return (
        item.학교명.includes(query) ||
        disassembledName.includes(disassembledQuery)
      );
    });
    //대학교를 우선순위로 대학교 ->고려학교 등등 -> 고려대학교 대학원
    filtered.sort((a, b) => {
      // 우선순위 점수 계산 함수
      const getPriority = (name: string) => {
        if (/대학교$/.test(name)) return 1; // 1순위: '대학교'로 끝나는 이름
        if (/학교/.test(name)) return 2; // 2순위: '학교' 포함 이름
        if (/대학교/.test(name)) return 3; // 3순위: '대학교' 포함하지만 '대학교'로 끝나지 않는 경우 (대학원 등)
        return 4; // 그 외
      };

      const aPriority = getPriority(a.학교명);
      const bPriority = getPriority(b.학교명);

      if (aPriority !== bPriority) return aPriority - bPriority;

      // 우선순위가 같으면, 이름 길이 짧은 순서로 (예: '고려대학교' < '고려대학교 대학원')
      if (a.학교명.length !== b.학교명.length) {
        return a.학교명.length - b.학교명.length;
      }

      // 추가로 포함 여부 우선
      const aIncludes = a.학교명.includes(query);
      const bIncludes = b.학교명.includes(query);
      if (aIncludes !== bIncludes) {
        return aIncludes ? -1 : 1;
      }

      return 0;
    });
    return filtered;
  };

  React.useEffect(() => {
    setSuggestions(filterUniversities(debouncedInput).slice(0, 30));
  }, [debouncedInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      const selected = suggestions[highlightIndex];
      setInput(selected.학교명);
      setValue("university", selected["학교 영문명"]);
      setSuggestions([]);
    }
  };

  return (
    <div className={cn("w-full flex items-center relative", className)}>
      <Label className="w-[143px] text-[20px] font-semibold">학력</Label>

      {/* 대학교 입력 + 자동완성 드롭다운 */}
      <div className="relative w-[266px] mr-[8px]">
        <Controller
          name="university"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                field.onChange(e);
              }}
              onKeyDown={handleKeyDown}
              placeholder="학교명 (예: ㄱㄹㄷ → 고려대)"
              className="w-full h-[60px] text-[18px] font-medium"
              profile={true}
            />
          )}
        />

        {suggestions.length > 0 && (
          <div className="absolute left-0 top-full mt-1 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10">
            {suggestions.map((item, i) => (
              <div
                key={`${item.제공기관코드}-${i}`}
                onMouseDown={() => {
                  setInput(item.학교명);
                  setValue("university", item["학교 영문명"]);
                  setSuggestions([]);
                }}
                className={`px-4 py-2 text-[14px] hover:bg-gray-100 cursor-pointer ${
                  i === highlightIndex ? "bg-blue-100" : ""
                }`}
              >
                {item.학교명}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 전공 입력 */}
      <Controller
        name="major"
        control={control}
        render={({ field }) => (
          <Input
            maxLength={15}
            {...field}
            value={field.value ?? ""}
            placeholder="전공 입력"
            className="w-[266px] h-[60px] text-[18px] font-medium"
            profile={true}
          />
        )}
      />
    </div>
  );
};

export default SelectSchool;
