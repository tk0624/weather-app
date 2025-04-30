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

        const forecasts = data.list.filter(f => {
          const utc = new Date(f.dt_txt);
          const jst = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
          const hour = jst.getHours();
          const dateStr = jst.toISOString().slice(0, 10);
          return dateStr === today && hour >= 6 && hour <= 24;
        });

        if (forecasts.length === 0) {
          alert("今日の天気情報が取得できませんでした。");
          return;
        }
        
        const temps = forecasts.map(f => f.main.temp);
        // const temps_min = forecasts.map(f => f.main.temp_min);
        // const temps_max = forecasts.map(f => f.main.temp_max);
        const minTemp = Math.min(...temps_min);
        const maxTemp = Math.max(...temps_max);

        const isRainy = forecasts.some(f => f.weather[0].main.includes("Rain") || f.weather[0].description.includes("雨"));

  console.log(temps); // ← 返り値を確認