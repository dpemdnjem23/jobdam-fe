/** @format */

import { useState, useEffect, useMemo, useCallback } from "react";
import ResumeCard from "./ResumeCard";
import ProfileCard from "./Profilecard";
import { ChatUserInfo } from "@/types/chat";
import InterviewNotice from "./InterviewNotice";

interface UserPanelProps {
  userList: ChatUserInfo[];
  myUserId: number;
  created: Date;
  onReady: (ready: boolean) => void;
  onLeave: () => void;
}

interface ParticipantView {
  id: number;
  name: string;
  profileImgUrl: string;
  isReady: boolean;
}

const UserPanel = ({
  userList,
  myUserId,
  created,
  onReady,
  onLeave,
}: UserPanelProps) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(myUserId);
  const [isMeReady, setIsMeReady] = useState(false);

  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);

  const participants: ParticipantView[] = userList.map((user) => ({
    id: user.userId,
    name: user.name,
    profileImgUrl: user.profileImgUrl,
    isReady: user.ready,
  }));

  // //내정보 골라내기
  const me = useMemo(
    () => participants.find((p) => p.id === myUserId),
    [participants, myUserId]
  );

  // //다른 유저정보 골라내기
  const others = useMemo(
    () => participants.filter((p) => p.id !== myUserId),
    [participants, myUserId]
  );

  // //둘의 정보를 합치기(null때문에)
  const allParticipants = useMemo(() => {
    return [...(me ? [me] : []), ...others];
  }, [me, others]);

  //선택된 유저찾아서 정보보여주기
  const selectedUser = useMemo(() => {
    return userList.find((u) => u.userId === selectedUserId);
  }, [userList, selectedUserId]);

  // const me = participants.find((p) => p.id === myUserId);
  // const others = participants.filter((p) => p.id !== myUserId);
  // const allParticipants = [...(me ? [me] : []), ...others];
  // const selectedUser = userList.find((u) => u.userId === selectedUserId);

  useEffect(() => {
    if (userList.length > 0 && selectedUserId === null) {
      setSelectedUserId(myUserId); // 최초에만 설정
    }
  }, [userList, selectedUserId, myUserId]);

  //준비상태 토글
  const handleToggleReady = () => {
    const newReady = !isMeReady;
    setIsMeReady(newReady);
    onReady(newReady);
  };

  //인터뷰 시작을 위한 준비
  const handleStartInterview = () => {
    const newReady = true;
    setIsMeReady(newReady);
    setHasInterviewStarted(true);
    onReady(newReady);
  };

  const handleCardClick = useCallback((id: number) => {
    setSelectedUserId(id);
  }, []);

  return (
    <div
      className={
        "w-[25%] min-w-[480px] h-[95%] bg-[#E5F3FF] p-4 flex flex-col justify-center rounded-[20px]"
      }
    >
      {/* 상단 안내 */}
      <InterviewNotice
        created={created}
        onStartInterview={() => handleStartInterview()}
      />

      <div className="flex items-stretch gap-2 flex-1 min-w-[500px]">
        {/* 프로필카드 리스트 */}
        <div className="flex flex-col gap-10 min-w-[70px] pt-5">
          {allParticipants.map((user) => (
            <ProfileCard
              key={user.id}
              name={user.id === myUserId ? "내 프로필" : user.name}
              profileImgUrl={user.profileImgUrl}
              isReady={user.isReady}
              isSelected={selectedUserId === user.id}
              onClick={() => handleCardClick(user.id)}
            />
          ))}
        </div>

        {/*이력서 카드 */}
        <div className="flex-1">
          {selectedUser && <ResumeCard user={selectedUser} />}
        </div>
      </div>

      {/* 준비 버튼 */}
      <div className="flex justify-center items-stretch gap-4">
        <button
          onClick={handleToggleReady}
          disabled={hasInterviewStarted}
          className={`w-8/12 py-3 rounded-lg text-white self-center 
          ${isMeReady ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {isMeReady ? "준비 취소" : "준비됐어요"}
        </button>
        <button
          onClick={onLeave}
          className="self-center w-28 py-3 bg-[#CFCFCF] text-white rounded-lg"
        >
          나가기
        </button>
      </div>
    </div>
  );
};
export default UserPanel;
