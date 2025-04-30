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
        const tempMin = data.main.temp_min;
        const tempMax = data.main.temp_max;
        const rain = data.rain ? data.rain["1h"] || 0 : 0;

        let message = "";

        // 傘の要否
        if (weather.includes("Rain") || rain > 0) {
          message += "雨が降りそうです。傘を持っていきましょう。\n";
        } else {
          message += "今日は雨の心配はなさそうです。\n";
        }

        // 服装提案（昼の気温）
        if (temp < 10) {
          message += "寒いのでコートを着ましょう。\n";
        } else if (temp < 20) {
          message += "薄手の上着があると安心です。\n";
        } else {
          message += "暖かいので軽装で大丈夫そうです。\n";
        }

        // 朝晩の冷え込みチェック（最低気温）
        if (tempMin < 10 && temp - tempMin > 5) {
          message += "朝晩は冷えるかもしれません。重ね着で調節できる服装がおすすめです。";
        }

        document.getElementById("output").innerText = message;
        alert(message);
      })
      .catch(() => {
        alert("天気情報の取得に失敗しました。");
      });
  }

  function error() {
    alert("位置情報の取得に失敗しました。");
  }
}

