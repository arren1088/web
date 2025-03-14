// 伺服器列表
const servers = [
  {
    name: "4YFOREVER",
    ip: "4yforever.twsrv.xyz",
    icon: "https://eu.mc-api.net/v3/server/favicon/mc.hypixel.net",
    description: "世界上最受歡迎的 Minecraft 伺服器之一"
  }
];

// 獲取伺服器狀態
async function fetchServerStatus(ip) {
  try {
    const response = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`獲取伺服器狀態失敗: ${ip}`, error);
    return { online: false, players: { online: 0, max: 0 }, version: "N/A", motd: "無法獲取 MOTD", ping: "N/A" };
  }
}

// 顯示伺服器列表
async function loadServers() {
  const serverList = document.getElementById("server-list");

  serverList.innerHTML = `<div class="loader"></div>`;

  // 等待所有伺服器資料載入
  const serversData = await Promise.all(
    servers.map(async (server) => {
      const status = await fetchServerStatus(server.ip);
      return { ...server, status };
    })
  );

  // 清除載入動畫
  serverList.innerHTML = "";


  // 顯示伺服器列表
  serversData.forEach((server) => {
    const serverElement = document.createElement("div");
    serverElement.classList.add("server");

    // 如果伺服器離線，新增 .offline 類別
    if (!server.status.online) {
      serverElement.classList.add("offline");
    }


    serverElement.innerHTML = `
            <img src="${server.icon}" alt="${server.name}">
            <h2>${server.name}</h2>
            <p>${server.description}</p>
            <p><strong>版本:</strong> ${server.status.online ? server.status.version : "N/A"}</p>
            <p><strong>玩家數:</strong> ${server.status.online ? `${server.status.players.online} / ${server.status.players.max}` : "N/A"}</p>
            <p><strong>IP:</strong> ${server.ip}</p>
            <p class="status ${server.status.online ? 'online' : 'offline'}">
                ${server.status.online ? "🟢 在線" : "🔴 離線"}</p>
        `;

    serverList.appendChild(serverElement);
  });
}

// 當頁面加載完成後執行
window.onload = loadServers;
