const API_KEY = '2a99ebbd1ef25cd7d6f785cb993e6e16'; // OpenWeatherMapのAPIキーをここに

function getAdvice() {
  if (!navigator.geolocation) {
    alert("位置情報が取得できません");
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);

  function error() {
    alert("位置情報の取得に失敗しました");
  }

  function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const nowJST = new Date(new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
        const today = nowJST.toISOString().slice(0, 10); // "YYYY-MM-DD"

        const cityName = data.city?.name || "不明な地域";
        const countryCode = data.city?.country || "";

        const forecasts = data.list.filter(f => {
          const utc = new Date(f.dt_txt);
          const jst = new Date(utc.getTime() + 9 * 60 * 60 * 1000); // JSTに変換
          const hour = jst.getHours();
          const dateStr = jst.toISOString().slice(0, 10);
          return dateStr === today && hour >= 6 && hour <= 24;
        });

        if (forecasts.length === 0) {
          alert("今日の天気情報が取得できませんでした。");
          return;
        }

        const temps = forecasts.map(f => f.main.temp);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);

        const isRainy = forecasts.some(f => f.weather[0].main.includes("Rain") || f.weather[0].description.includes("雨"));

        let message = `📍 あなたの現在地：${cityName}（${countryCode}）\n\n`;
        message += `📍 現在地の今日の天気情報（${today}）\n`;
        message += `🌡️ 最高気温：${maxTemp.toFixed(1)}℃\n`;
        message += `❄️ 最低気温：${minTemp.toFixed(1)}℃\n`;

        if (isRainy) {
          message += `☔ 雨が予想されます。傘を持って出かけましょう。\n`;
        } else {
          message += `☀️ 雨の心配はなさそうです。\n`;
        }

        if (maxTemp < 10) {
          message += "🧥 厚手のコートを着ましょう。";
        } else if (minTemp < 10 && maxTemp < 18) {
          message += "🧣 朝晩冷えます。軽めの上着がおすすめです。";
        } else if (maxTemp >= 25) {
          message += "🩳 暑くなりそうです。涼しい服装で。";
        } else {
          message += "👕 過ごしやすい気温です。薄手でOK。";
        }

        // OpenWeatherMapの現在地の天気情報へのリンクを追加
        const weatherLink = `https://openweathermap.org/city/${data.city.id}`;
        message += `\n🔗 詳細な天気情報はこちら: ${weatherLink}`;

        message += "\nver25043022";

        alert(message);
        document.getElementById("result").innerText = message;
      })
      .catch(() => {
        alert("天気データの取得に失敗しました。");
      });
  }
}