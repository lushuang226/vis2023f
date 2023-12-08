const icon = document.getElementById('icon');
const jsonUrlPath = '../json/userLocationData.json';
const jsonUrlCalorie = '../json/AerobicData.json';
let currentIndex = 0;
let currentFloor = '1F';
let calorieIndex = 0;
let calorieData = null;

function calculatePosition(x, y) {
  const minX = 10.45;
  const maxX = 60.47;
  const minY = -11.64;
  const maxY = 15.91;

  const iconX = ((x - minX) / (maxX - minX)) * 100;
  const iconY = ((y - minY) / (maxY - minY)) * 100;

  return { x: iconX, y: iconY };
}

function updateIconPosition(x, y) {
  // console.log(x, y);
  const { x: iconX, y: iconY } = calculatePosition(x, y);
  icon.style.left = `${iconX}%`;
  icon.style.top = `${iconY}%`;
}

// 新增一個函數用來更新資訊
function updateInfo(time, floor, distance, calorie) {
  const timeInfo = document.getElementById('time-info');
  const distanceInfo = document.getElementById('distance-info');
  const calorieInfo = document.getElementById('calories-info');

  // 在這裡可以加上計算速度、卡路里等其他相關邏輯
  const speed = distance / time;

  timeInfo.textContent = `Time: ${time} seconds`;
  distanceInfo.textContent = `Distance: ${distance} meters`;
  calorieInfo.textContent = `Calories: ${calorie} calories`;

  // 這裡可以加上其他相關邏輯
}

function updatePathData(data) {
  if (data && data.length > 0) {
    const point = data[currentIndex];

    if (point.Floor !== currentFloor) {
      // 換樓層時的處理，這裡可以添加你的樓層切換相關邏輯
      console.log(`Switched to Floor ${point.Floor}`);
      currentFloor = point.Floor;
    }

    updateIconPosition(point.X, point.Y);
    currentIndex++;

    // 如果資料到達末尾，重新從頭開始
    if (currentIndex >= data.length) {
      currentIndex = 0;
    }
  }
}

function updateCalorieData(data) {
  if (calorieIndex < data.length) {
    const point = data[calorieIndex];
    updateIconPosition(point.X, point.Y);
    updateInfo(point.Time, point.Floor, point.Distance, point.Calorie);
    calorieIndex++;
  } else {
    calorieIndex = 0;
  }
}

function loadAllJson() {
  fetch(jsonUrlPath)
    .then(response => response.json())
    .then(data => {
      updatePathData(data);
    })
    .catch(error => console.error('Error fetching or parsing JSON:', error));

  fetch(jsonUrlCalorie)
    .then(response => response.json())
    .then(data => {
      updateCalorieData(data);
    })
    .catch(error => console.error('Error fetching JSON:', error));
}

// 初始加載 icon 位置
loadAllJson();

// 每秒更新一次位置
setInterval(loadAllJson, 1000);