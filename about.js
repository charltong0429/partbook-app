const voices = {
  product: {
    role: "Product Director",
    title: "真正的产品机会，不在多一个电价页面。",
    body: "动态电价只有进入热泵、储能和 EV 的自动控制闭环，才会从‘用户需要每天关注的数据’变成‘系统替用户持续做出的更好决定’。",
  },
  market: {
    role: "Market Intelligence",
    title: "动态电价竞争，正在转向家庭能源控制权。",
    body: "当供应商开始把 tariff、设备和自动化打包销售，比较对象就不再只是每度电价格，而是谁能拥有家庭负荷的长期调度入口。",
  },
  founder: {
    role: "Founder",
    title: "用户不需要理解每一个价格波动。",
    body: "好的能源产品，不是让家庭成为交易员，而是把复杂价格转换成更舒适、更便宜、也更低碳的日常决定。技术应该承担复杂度。",
  },
};

const tabs = document.querySelectorAll("[data-voice]");
const role = document.querySelector("#voice-role");
const title = document.querySelector("#voice-title");
const body = document.querySelector("#voice-body");
const approveButton = document.querySelector("#approve-button");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const voice = voices[tab.dataset.voice];
    tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    role.textContent = voice.role;
    title.textContent = voice.title;
    body.textContent = voice.body;
    approveButton.textContent = "标记为可发布";
    approveButton.classList.remove("is-ready");
  });
});

approveButton.addEventListener("click", () => {
  const isReady = approveButton.classList.toggle("is-ready");
  approveButton.textContent = isReady ? "已可发布 ✓" : "标记为可发布";
});
