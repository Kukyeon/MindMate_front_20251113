import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiaryEmojiPicker from "../components/DiaryEmojiPicker";
import { fetchDiaryByDate, updateDiaryWithImage } from "../api/diaryApi"; // Multipart용 API
import { useModal } from "../context/ModalContext";
import LoadingBar from "../components/LoadingBar";
export default function DiaryEditor() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [emoji, setEmoji] = useState(null);
  const [diary, setDiary] = useState({
    title: "",
    content: "",
    username: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null); // 새 이미지
  const [deleteImage, setDeleteImage] = useState(false);
  const [errors, setErrors] = useState({ title: "", content: "", emoji: "" });
  const [previewUrl, setPreviewUrl] = useState(diary.imageUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!date) return;

    const fetchDiary = async () => {
      try {
        const res = await fetchDiaryByDate(date);
        setDiary(res.data);
        setEmoji(res.data.emoji);
      } catch (error) {
        console.error("❌ fetchDiary 오류:", error);
        const status = error.response?.status;
        if (status === 404) showModal("해당 날짜에 작성된 일기가 없습니다.");
        else if (status === 403) showModal("로그인이 필요합니다.");
        else showModal("일기 조회 실패");

        navigate("/diary/calendar");
      }
    };

    fetchDiary();
  }, [date, navigate]);

  const handleChange = (e) => {
    setDiary({ ...diary, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // 이미지 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    // setImageFile("");
  };
  useEffect(() => {
    let objectUrl;
    if (imageFile) {
      objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
    } else if (diary.imageUrl) {
      setPreviewUrl(`http://localhost:8888${diary.imageUrl}`);
    } else {
      setPreviewUrl("");
    }
    return () => objectUrl && URL.revokeObjectURL(objectUrl); // 메모리 해제
  }, [diary.imageUrl, imageFile]);

  const handleSave = async (e) => {
    e.preventDefault();

    // 유효성 검사
    let newErrors = { title: "", content: "", emoji: "" };
    if (!diary.title.trim()) newErrors.title = "제목을 입력해 주세요";
    else if (diary.title.trim().length < 5)
      newErrors.title = "글 제목은 최소 5글자 이상이어야 합니다.";

    if (!diary.content.trim()) newErrors.content = "내용을 입력해 주세요";
    else if (diary.content.trim().length < 5)
      newErrors.content = "글 내용은 최소 5글자 이상이어야 합니다.";

    if (!emoji) newErrors.emoji = "감정을 선택해 주세요";

    setErrors(newErrors);
    if (newErrors.title || newErrors.content || newErrors.emoji) return;

    // FormData 준비 (JSON + 이미지)
    const formData = new FormData();
    const dataToSend = {
      title: diary.title.trim() || undefined,
      content: diary.content.trim() || undefined,
      emoji: emoji || undefined, // id, type, imageUrl 전체 포함
      deleteImage: deleteImage,
    };
    formData.append("data", JSON.stringify(dataToSend));
    if (imageFile) formData.append("image", imageFile);
    setIsSaving(true);
    try {
      await updateDiaryWithImage(date, dataToSend, imageFile);
      showModal("수정되었습니다.", () => {
        navigate("/diary/calendar", { state: { selectedDate: date } });
      });
    } catch (error) {
      console.error("❌ handleSave 오류:", error);
      const status = error.response?.status;

      if (status === 400) {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          setErrors(serverErrors);
          return;
        }
        showModal("입력값이 올바르지 않습니다.");
      } else if (status === 403) {
        showModal("권한이 없습니다. 다시 로그인 해주세요!", "/login");
      } else {
        showModal("수정 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="diary-editor-card">
      {isSaving && (
        <div className="graph-loading-overlay">
          <LoadingBar loading={true} message="🤖 일기를 저장 중이에요..." />
        </div>
      )}

      <h2>✏️ {date} 일기 수정</h2>

      <form onSubmit={handleSave}>
        {/* 제목 */}
        <div className="editor-field">
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={diary.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
          />
          {errors.title && <p className="diary-error">{errors.title}</p>}
        </div>

        {/* 내용 */}
        <div className="editor-field">
          <label>내용</label>
          <textarea
            name="content"
            value={diary.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
          />
          {errors.content && <p className="diary-error">{errors.content}</p>}
        </div>

        {/* 감정 이모지 */}
        <div className="emoji-picker-wrapper">
          <DiaryEmojiPicker selectedEmoji={emoji} onSelectEmoji={setEmoji} />
          {errors.emoji && <p className="diary-error">{errors.emoji}</p>}
        </div>

        {/* 이미지 업로드 */}
        <div className="editor-field">
          <input
            type="file"
            id="customFileInput"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {/* 커스텀 버튼 */}
          <label htmlFor="customFileInput" className="custom-file-button">
            이미지 첨부
          </label>

          {/* 미리보기 */}
          {previewUrl && (
            <div className="image-preview-wrapper">
              <img src={previewUrl} alt="Preview" className="image-preview" />
              <button
                type="button"
                className="delete-image-button"
                onClick={() => {
                  setPreviewUrl(""); // 화면에서 제거
                  setImageFile(null); // 새로 선택한 이미지 제거
                  setDeleteImage(true);
                }}
              >
                ❌ 삭제
              </button>
            </div>
          )}
        </div>

        <div className="diary-editor-buttons">
          <button type="submit">저장</button>
          <button
            type="button"
            onClick={() =>
              navigate("/diary/calendar", { state: { selectedDate: date } })
            }
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
