import { useEffect, useRef, useState } from "react";
import ToolPage from "./ToolPage";
import { useKeyboardViewport } from "../../utils/useKeyboardViewport";

const INITIAL_MESSAGES = [
  "这是一个模拟聊天输入区，用来测试软键盘弹起时底部输入栏的表现。",
  "文章里的核心思路是：Android 看 resize，iOS 优先看 visualViewport，同时在 focus 后延迟滚动输入框。",
  "请在手机里打开这个页面再测试，桌面浏览器只能看到状态面板，不会真的弹出移动端软键盘。",
  "如果你的机型支持 visualViewport，这个 demo 会实时展示可视区高度和计算出的键盘高度。",
  "输入几条消息，观察底部工具栏、消息列表和视口指标是否保持同步。",
];

export default function KeyboardViewportDemo() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const {
    bindInput,
    metrics,
    focusCount,
    blurCount,
    footerLift,
    contentPaddingBottom,
  } = useKeyboardViewport<HTMLTextAreaElement>({
    baseContentPadding: 96,
    maxLift: 320,
    onFocusSettled: () => {
      const list = messageListRef.current;
      if (!list) return;
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    },
  });

  useEffect(() => {
    const list = messageListRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const value = text.trim();
    if (!value) return;
    setMessages((current) => [...current, value]);
    setText("");
  };

  return (
    <ToolPage
      title="软键盘优化 Demo"
      description="基于 visualViewport、resize、focus/blur 和 scrollIntoView 的 H5 底部输入栏优化方案"
    >
      <div className="space-y-6">
        <div
          className="rounded-2xl border p-4 sm:p-5"
          style={{
            background: "var(--color-bg-card)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["平台识别", metrics.platform],
              ["键盘状态", metrics.keyboardOpen ? "已弹起" : "未弹起"],
              ["键盘高度", `${metrics.keyboardHeight}px`],
              ["最后事件", metrics.lastEvent],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border p-3"
                style={{
                  background: "var(--color-bg-secondary)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </div>
                <div
                  className="mt-2 text-base font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
          <p
            className="mt-4 text-sm leading-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            推荐策略：Android 监听 window.resize，iOS 优先监听 visualViewport.resize；输入框 focus
            后延迟执行 scrollIntoView，blur 后按需恢复滚动位置。
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div
            className="mx-auto w-full max-w-[420px] rounded-[2rem] border p-3 shadow-lg"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-bg-card) 92%, white) 0%, var(--color-bg-card) 100%)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div
              className="overflow-hidden rounded-[1.4rem] border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-bg)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: "var(--color-bg-secondary)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    移动端聊天输入区
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    真机测试时最能观察键盘遮挡问题
                  </div>
                </div>
                <div
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    background: metrics.keyboardOpen
                      ? "color-mix(in srgb, var(--color-accent) 15%, transparent)"
                      : "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                    color: metrics.keyboardOpen
                      ? "var(--color-accent)"
                      : "var(--color-primary)",
                  }}
                >
                  {metrics.keyboardOpen ? "Keyboard On" : "Keyboard Idle"}
                </div>
              </div>

              <div
                ref={messageListRef}
                className="relative h-[32rem] overflow-y-auto px-4 py-4"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 94%, var(--color-accent) 6%) 0%, var(--color-bg) 100%)",
                  paddingBottom: `${contentPaddingBottom}px`,
                }}
              >
                <div className="space-y-3">
                  {messages.map((message, index) => {
                    const isSelf = index % 3 === 2;
                    return (
                      <div
                        key={`${message}-${index}`}
                        className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-6"
                          style={{
                            background: isSelf
                              ? "var(--color-primary)"
                              : "var(--color-bg-card)",
                            color: isSelf ? "#ffffff" : "var(--color-text)",
                            border: isSelf
                              ? "1px solid transparent"
                              : "1px solid var(--color-border)",
                            boxShadow: "var(--shadow-sm)",
                          }}
                        >
                          {message}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-bg) 96%, var(--color-bg-secondary) 4%) 100%)",
                  }}
                />
              </div>

              <div
                className="sticky bottom-0 z-10 p-3"
                style={{
                  background: "color-mix(in srgb, var(--color-bg-card) 92%, transparent)",
                  borderTop: "1px solid var(--color-border)",
                  backdropFilter: "blur(10px)",
                  transform: `translateY(-${footerLift}px)`,
                  transition: "transform 180ms ease, padding-bottom 180ms ease",
                }}
              >
                <div className="flex items-end gap-2">
                  <textarea
                    ref={bindInput.ref}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    onFocus={bindInput.onFocus}
                    onBlur={bindInput.onBlur}
                    rows={2}
                    placeholder="点击这里，观察键盘弹起后输入栏是否仍贴住可视区底部"
                    className="min-h-[56px] flex-1 rounded-2xl px-4 py-3 text-sm"
                    style={{
                      resize: "none",
                      background: "var(--color-bg-secondary)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold"
                    style={{
                      background: "var(--color-primary)",
                      color: "#ffffff",
                    }}
                  >
                    发送
                  </button>
                </div>
                <div
                  className="mt-2 flex items-center justify-between text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <span>focus {focusCount} 次</span>
                  <span>blur {blurCount} 次</span>
                  <span>lift {footerLift}px</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className="rounded-2xl border p-4"
              style={{
                background: "var(--color-bg-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                实时视口指标
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {[
                  ["window.innerHeight", `${metrics.innerHeight}px`],
                  [
                    "visualViewport.height",
                    metrics.visualViewportHeight === null
                      ? "不支持"
                      : `${metrics.visualViewportHeight}px`,
                  ],
                  [
                    "visualViewport.offsetTop",
                    metrics.visualViewportOffsetTop === null
                      ? "不支持"
                      : `${metrics.visualViewportOffsetTop}px`,
                  ],
                  [
                    "visualViewport",
                    metrics.supportsVisualViewport ? "supported" : "unsupported",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border px-3 py-2"
                    style={{
                      background: "var(--color-bg-secondary)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {label}
                    </div>
                    <div
                      className="mt-1 text-sm font-semibold"
                      style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-code)",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{
                background: "var(--color-bg-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                本 demo 的实现要点
              </h2>
              <ul
                className="mt-3 space-y-2 text-sm leading-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <li>1. 初始记录基线高度，用于估算软键盘占用的可视区差值。</li>
                <li>2. iOS 优先监听 visualViewport.resize 和 visualViewport.scroll。</li>
                <li>3. Android 在没有 visualViewport 时退回到 window.resize。</li>
                <li>4. focus 后延迟调用 scrollIntoView，避免键盘尚未完全弹起时滚动失效。</li>
                <li>5. 底部输入栏根据计算出的 keyboardHeight 上移，减少 fixed 底部被遮挡的问题。</li>
              </ul>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{
                background: "var(--color-bg-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                关键逻辑
              </h2>
              <pre
                className="mt-3 overflow-x-auto rounded-xl p-4 text-xs leading-6"
                style={{
                  background: "var(--color-code-bg)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <code>{`const effectiveHeight = window.visualViewport?.height ?? window.innerHeight;
const offsetTop = window.visualViewport?.offsetTop ?? 0;
const keyboardHeight = Math.max(0, baselineHeight - effectiveHeight - offsetTop);

const keyboard = useKeyboardViewport<HTMLTextAreaElement>({
  baseContentPadding: 96,
  onFocusSettled: () => list.scrollTo({ top: list.scrollHeight })
});

<textarea {...keyboard.bindInput} />
<div style={{ transform: \`translateY(-\${keyboard.footerLift}px)\` }} />`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}