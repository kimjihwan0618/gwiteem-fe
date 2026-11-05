"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { useChoiceCategories } from "@/app/(page)/hooks/use-choice-categories";
import { ApiError } from "@/lib/api/response";
import { useCreateQuestion } from "./hooks";
import { createQuestionSchema } from "./type";
import { styles } from "./NewQuestionPage.styles";

export default function NewQuestionPage() {
  const { user, isReady } = useAuth();
  const categories = useChoiceCategories();
  const create = useCreateQuestion();
  const toast = useToast();
  const router = useRouter();
  const submitted = useRef(false);
  const sending = useRef(false);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [reasons, setReasons] = useState([
    "나에게 더 잘 맞아서",
    "부담이 적어서",
    "새로운 경험을 하고 싶어서",
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState("");
  const [dirty, setDirty] = useState(false);
  const availableCategories =
    categories.data?.filter((item) => item.enabled) ?? [];

  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (dirty && !submitted.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || submitted.current) return;
    const parsed = createQuestionSchema.safeParse({
      category,
      title,
      options,
      reasons,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues)
        next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      return;
    }
    if (!availableCategories.some((item) => item.code === category)) {
      setErrors({ category: "현재 등록할 수 없는 카테고리입니다." });
      return;
    }
    sending.current = true;
    setErrors({});
    setFailure("");
    try {
      const response = await create.mutateAsync(parsed.data);
      submitted.current = true;
      toast.success(response.message);
      router.replace(`/?question=${response.data.id}`);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "질문을 게시하지 못했어요. 다시 시도해 주세요.";
      setFailure(message);
      toast.error(message);
    } finally {
      sending.current = false;
    }
  }

  return (
    <div className={styles.root}>
      <AppHeader />
      <main className={styles.main}>
        <Link
          href="/"
          className={styles.back}
          onClick={(event) => {
            if (
              (dirty || create.isPending) &&
              !window.confirm("작성 중인 내용이 사라집니다. 나가시겠어요?")
            )
              event.preventDefault();
          }}
        >
          <ArrowLeft size={16} /> 질문 목록으로
        </Link>
        <h1 className={styles.heading}>사람들의 생각이 궁금한가요?</h1>
        <p className={styles.description}>
          일상의 고민을 질문으로 만들고, 다른 사람들의 선택과 이유를 들어보세요.
        </p>
        {!isReady ? (
          <div
            className={styles.loading}
            role="status"
            aria-label="로그인 상태 확인 중"
          />
        ) : !user ? (
          <div className={styles.state}>
            <h2 className={styles.previewTitle}>
              로그인하고 질문을 만들어 보세요.
            </h2>
            <p className={styles.description}>
              게시한 질문에는 내 닉네임이 표시됩니다.
            </p>
            <Link
              className={styles.loginLink}
              href="/login?next=/questions/new"
            >
              로그인하기
            </Link>
          </div>
        ) : categories.isPending ? (
          <div
            className={styles.loading}
            role="status"
            aria-label="카테고리 불러오는 중"
          />
        ) : categories.isError ? (
          <div className={styles.state} role="alert">
            카테고리를 불러오지 못했어요.
            <Button onClick={() => void categories.refetch()}>다시 시도</Button>
          </div>
        ) : availableCategories.length === 0 ? (
          <div className={styles.state}>
            현재 질문 등록을 준비 중입니다. 잠시 후 다시 방문해 주세요.
          </div>
        ) : (
          <div className={styles.layout}>
            <form
              className={styles.form}
              onSubmit={submit}
              onChange={() => setDirty(true)}
              noValidate
            >
              <fieldset
                disabled={create.isPending || create.isSuccess}
                className={styles.rows}
              >
                <div className={styles.field}>
                  <label htmlFor="question-category" className={styles.label}>
                    카테고리
                  </label>
                  <select
                    id="question-category"
                    className={styles.select}
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby="category-error"
                  >
                    <option value="">카테고리를 선택해 주세요</option>
                    {availableCategories.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <p id="category-error" className={styles.error}>
                    {errors.category}
                  </p>
                </div>
                <div className={styles.field}>
                  <label htmlFor="question-title" className={styles.label}>
                    질문
                  </label>
                  <Input
                    id="question-title"
                    value={title}
                    maxLength={200}
                    placeholder="예: 주말에 딱 하루 쉰다면?"
                    onChange={(event) => setTitle(event.target.value)}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby="title-error"
                  />
                  <p className={styles.note}>{title.length} / 200</p>
                  <p id="title-error" className={styles.error}>
                    {errors.title}
                  </p>
                </div>
                <div className={styles.field}>
                  <h2 className={styles.label}>
                    선택지 <span className={styles.note}>2~4개</span>
                  </h2>
                  {options.map((value, index) => (
                    <div className={styles.row} key={index}>
                      <span className={styles.marker}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <Input
                        className={styles.input}
                        value={value}
                        maxLength={100}
                        aria-label={`선택지 ${String.fromCharCode(65 + index)}`}
                        aria-describedby="options-error"
                        placeholder={
                          index === 0
                            ? "집에서 푹 쉬기"
                            : index === 1
                              ? "밖에서 기분 전환"
                              : "선택지를 입력해 주세요"
                        }
                        onChange={(event) =>
                          setOptions((items) =>
                            items.map((item, at) =>
                              at === index ? event.target.value : item,
                            ),
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        aria-label={`선택지 ${index + 1} 삭제`}
                        disabled={options.length <= 2}
                        onClick={() => {
                          setOptions((items) =>
                            items.filter((_, at) => at !== index),
                          );
                          setDirty(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    disabled={options.length >= 4}
                    onClick={() => {
                      setOptions([...options, ""]);
                      setDirty(true);
                    }}
                  >
                    <Plus size={16} /> 선택지 추가
                  </Button>
                  <p id="options-error" className={styles.error}>
                    {errors.options}
                  </p>
                </div>
                <div className={styles.field}>
                  <h2 className={styles.label}>
                    선택 이유 <span className={styles.note}>2~6개</span>
                  </h2>
                  <p className={styles.note}>
                    참여자는 선택지와 이유를 하나씩 고릅니다. 어느 선택지에도
                    사용할 수 있는 이유를 작성해 주세요.
                  </p>
                  {reasons.map((value, index) => (
                    <div key={index} className={styles.row}>
                      <Input
                        className={styles.input}
                        value={value}
                        maxLength={120}
                        aria-label={`선택 이유 ${index + 1}`}
                        aria-describedby="reasons-error"
                        onChange={(event) =>
                          setReasons((items) =>
                            items.map((item, at) =>
                              at === index ? event.target.value : item,
                            ),
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        aria-label={`선택 이유 ${index + 1} 삭제`}
                        disabled={reasons.length <= 2}
                        onClick={() => {
                          setReasons((items) =>
                            items.filter((_, at) => at !== index),
                          );
                          setDirty(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    disabled={reasons.length >= 6}
                    onClick={() => {
                      setReasons([...reasons, ""]);
                      setDirty(true);
                    }}
                  >
                    <Plus size={16} /> 이유 추가
                  </Button>
                  <p id="reasons-error" className={styles.error}>
                    {errors.reasons}
                  </p>
                </div>
              </fieldset>
              {failure && (
                <p className={styles.error} role="alert">
                  {failure}
                </p>
              )}
              <div className={styles.actions}>
                <p className={styles.note}>
                  게시 즉시 공개됩니다.
                  <br />
                  등록 후 수정·삭제는 현재 지원하지 않습니다.
                </p>
                <Button
                  type="submit"
                  isPending={create.isPending}
                  disabled={create.isSuccess}
                  loadingText="게시 중…"
                >
                  질문 게시하기
                </Button>
              </div>
            </form>
            <aside className={styles.preview} aria-label="질문 미리보기">
              <h2 className={styles.previewTitle}>이렇게 보여요</h2>
              <span className={styles.badge}>
                {availableCategories.find((item) => item.code === category)
                  ?.label ?? "카테고리"}
              </span>
              <h3 className={styles.question}>
                {title.trim() || "질문을 입력해 주세요"}
              </h3>
              <p className={styles.note}>{user.name}</p>
              {options.map((option, index) => (
                <div key={index} className={styles.option}>
                  <span className={styles.marker}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={styles.optionText}>
                    {option.trim() || "선택지"}
                  </span>
                </div>
              ))}
              <p className={styles.label}>이 선택을 한 이유는?</p>
              <div className={styles.reasons}>
                {reasons.map((reason, index) => (
                  <span key={index} className={styles.reason}>
                    {reason.trim() || "선택 이유"}
                  </span>
                ))}
              </div>
              <p className={styles.note}>
                미리보기입니다. 실제 투표는 게시 후 시작됩니다.
              </p>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
