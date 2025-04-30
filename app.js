const API_KEY = '2a99ebbd1ef25cd7d6f785cb993e6e16'; // ここに OpenWeatherMap の API キーを入れてください

function getWeather() {
  if (!navigator.geolocation) {
    alert("位置情報が利用できません");
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const weather = data.weather[0].main;
        const temp = data.main.temp;
        const rain = data.rain ? data.rain["1h"] || 0 : 0;

        let message = "";

        // 傘の判定
        if (weather.includes("Rain") || rain > 0) {
          message += "雨が降りそうです。傘を持っていきましょう。\n";
        } else {
          message += "今日は雨の心配はなさそうです。\n";
        }

        // 服装の提案
        if (temp < 10) {
          message += "寒いのでコートを着ましょう。";
        } else if (temp < 20) {
          message += "少し肌寒いかもしれません。薄手の上着があると良いでしょう。";
        } else {
          message += "暖かい一日になりそうです。軽装で大丈夫です。";
        }

        alert(message);
        document.getElementById("output").innerText = message;
      })
      .catch(() => {
        alert("天気情報の取得に失敗しました。");
      });
  }

  function error() {
    alert("位置情報の取得に失敗しました。");
  }
}
