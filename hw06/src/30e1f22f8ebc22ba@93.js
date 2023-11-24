function _1(md){return(
md`# HW06 `
)}

function _artistVer(__query,FileAttachment,invalidation){return(
__query(FileAttachment("artistVer.csv"),{from:{table:"artistVer"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _artistPublic(__query,FileAttachment,invalidation){return(
__query(FileAttachment("artistPublic.csv"),{from:{table:"artistPublic"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _4(md){return(
md`<h1>Data</h1>`
)}

function _artist_columnKey(artistVer){return(
Object.keys(artistVer[0])[3]
)}

function _artist_Column(artistVer,artist_columnKey){return(
artistVer.map(row => row[artist_columnKey])
)}

function _artistver_uniqueValues(artist_Column){return(
[...new Set(artist_Column)].sort()
)}

function _artist_counts(artistver_uniqueValues,artist_Column){return(
artistver_uniqueValues.map(val => ({
  value: val,
  count: artist_Column.filter(v => v === val).length
}))
)}

function _artistpublic_columnKey(artistPublic){return(
Object.keys(artistPublic[0])[4]
)}

function _artistpublic_Column(artistPublic,artistpublic_columnKey){return(
artistPublic.map(row => String(row[artistpublic_columnKey]))
)}

function _artistpublic_uniqueValues(artistpublic_Column){return(
[...new Set(artistpublic_Column)].sort()
)}

function _artistpublic_counts(artistpublic_uniqueValues,artistpublic_Column){return(
artistpublic_uniqueValues.map(val => ({
  value: val,
  count: artistpublic_Column.filter(v => v === String(val)).length
}))
)}

function _data(artist_counts,artistpublic_counts)
{
 return artist_counts.flatMap((item, index) => ([
  {
    value: item.value,
    count: item.count,
    series: 'artist'
  },
  {
    value: item.value,
    count: artistpublic_counts[index].count,
    series: 'artistpublic'
  }
]))
}


function _14(md){return(
md`<h2>Simple baseline (plot圖 & Checkbox input)<h2>`
)}

function _selectedSeries(Inputs){return(
Inputs.checkbox(["artist", "artistpublic"], {label: "Choose datasets", value: ["artist", "artistpublic"]})
)}

function _16(Plot,artist_columnKey,data,selectedSeries){return(
Plot.plot({
  height: 500,
  width: 600,
  title: artist_columnKey,
  x: {
    label: 'Value',
    domain: data.map(d => d.value),
    padding: 0.1
  },
  y: {
    label: 'Count',
    grid: true
  },
  color: {
    domain: ['artist', 'artistpublic'],
    range: ['#9B90C2', '#D9CD90'],  // 你可以根據需要更改顏色
    legend: true //在圖表最上方表示兩種domain的顏色區別
  },
  marks: [
    Plot.barY(data.filter(d => selectedSeries.includes(d.series)), Plot.stackY({ 
      x: "value",
      y: "count",
      fill: "series",
      title: d => `${d.series}\nvalue: ${d.value}\ncount: ${d.count}`
    }))
  ]
})
)}

function _17(md){return(
md`<h2>Medium baseline(SVG圖 & Checkbox input<br> & 過渡效果)<h2>`
)}

function _selectedSeries1(Inputs){return(
Inputs.checkbox(["artist", "artistpublic"], {label: "Choose datasets", value: ["artist", "artistpublic"]})
)}

function _chart(data,selectedSeries1,d3,artist_columnKey)
{
  // 定義邊界大小，以及圖形的寬度和高度
  const margin = {top: 70, right: 80, bottom: 70, left: 60};
  const width = 700 - margin.left - margin.right;
  const height = 580 - margin.top - margin.bottom;

  // 取得所有的系列名稱（無重複）
  const keys = Array.from(new Set(data.map(d => d.series)));
  
  // 根據選擇的系列過濾數據
  const filteredData = data.filter(d => selectedSeries1.includes(d.series));

  // 對過濾後的數據進行分組處理
  let grouped = Array.from(d3.group(filteredData, d => d.value), ([key, value]) => {
    return {value: key, ...Object.fromEntries(value.map(obj => [obj.series, obj.count]))};
  });

  // 定義堆疊方式並計算
  const stack = d3.stack().keys(keys);
  const series = stack(grouped);
  
  // 定義x軸的比例尺
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.value))
    .range([0, width])
    .padding(0.1);

  // 定義y軸的比例尺
  const yMax = d3.max(series, serie => d3.max(serie, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([height, 0]);

  // 定義顏色的比例尺
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#9B90C2', '#D9CD90']);

  // 創建SVG元素
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // 在創建 SVG 元素後，新增標題
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text(artist_columnKey);

  // 新增 x 軸標題
  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + margin.bottom / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Value");
  
  // 新增 y 軸標題
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", margin.left / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Count");

  // 在SVG中添加一個包含所有內容的g元素(對它進行一個平移變換，以便為接下來的元素提供一個留白的區域)
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 繪製每一個系列的柱子
  series.forEach((serie) => {
      let bars = g.append("g")
          .attr("fill", colorScale(serie.key))
          .selectAll("rect")
          .data(serie);
  
      bars.enter().append("rect")
          .attr("x", d => xScale(d.data.value))
          .attr("y", height)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)

          .attr("y", d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]))
          .append("title")
          .text((d) => `${serie.key}\nValue: ${d.data.value}\nCount: ${d[1] - d[0]}`);
  });

  // 繪製x軸
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // 繪製y軸
  g.append("g")
    .call(d3.axisLeft(yScale));

  // 在創建 SVG 元素後，新增兩種domain的顏色區別和名稱
  const legendGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top - 15})`);  // 設置 g 元素的位置
  
  // 添加第一個正方形
  legendGroup.append("rect")
    .attr("x", 10)
    .attr("y", -10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#9B90C2");
  
  // 添加第一個正方形的名稱
  legendGroup.append("text")
    .attr("x", 40)
    .attr("y", 5)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "#000")
    .text("artist");
  
  // 添加第二個正方形
  legendGroup.append("rect")
    .attr("x", 100)
    .attr("y", -10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#D9CD90");
  
  // 添加第二個正方形的名稱
  legendGroup.append("text")
    .attr("x", 130)
    .attr("y", 5)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "#000")
    .text("artistpublic");

  return svg.node();
}


function _selectedSeries2(Inputs){return(
Inputs.checkbox(["artist", "artistpublic"], {label: "Choose datasets", value: ["artist", "artistpublic"]})
)}

function _chart1(data,selectedSeries2,d3,artist_columnKey)
{
  // 定義邊界大小，以及圖形的寬度和高度
  const margin = {top: 70, right: 80, bottom: 70, left: 60};
  const width = 700 - margin.left - margin.right;
  const height = 580 - margin.top - margin.bottom;

  // 取得所有的系列名稱（無重複）
  const keys = Array.from(new Set(data.map(d => d.series)));
  
  // 根據選擇的系列過濾數據
  const filteredData = data.filter(d => selectedSeries2.includes(d.series));

  // 對過濾後的數據進行分組處理
  let grouped = Array.from(d3.group(filteredData, d => d.value), ([key, value]) => {
    return {value: key, ...Object.fromEntries(value.map(obj => [obj.series, obj.count]))};
  });

  // 定義堆疊方式並計算
  const stack = d3.stack().keys(keys);
  const series = stack(grouped);
  
  // 定義x軸的比例尺
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.value))
    .range([0, width])
    .padding(0.1);

  // 定義y軸的比例尺
  const yMax = d3.max(series, serie => d3.max(serie, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([height, 0]);

  // 定義顏色的比例尺
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#9B90C2', '#D9CD90']);

  // 創建SVG元素
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // 在創建 SVG 元素後，新增標題
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text(artist_columnKey);

  // 新增 x 軸標題
  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + margin.bottom / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Value");
  
  // 新增 y 軸標題
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", margin.left / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Count");

  // 在SVG中添加一個包含所有內容的g元素(對它進行一個平移變換，以便為接下來的元素提供一個留白的區域)
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 繪製每一個系列的柱子
  series.forEach((serie) => {
      let bars = g.append("g")
          .attr("fill", colorScale(serie.key))
          .selectAll("rect")
          .data(serie);
  
      bars.enter().append("rect")
          .attr("x", d => xScale(d.data.value))
          .attr("y", height)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
        //新增以下兩行可新增出過渡效果
          .transition() 
          .duration(1000) //改為0可以呈現無過度效果
        //新增到這兩行可新增出過渡效果
          .attr("y", d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]));

      // 在每個柱狀圖元素上新增 title
      bars.enter().append("title")
        .text((d) => `${serie.key}\nValue: ${d.data.value}\nCount: ${d[1] - d[0]}`);
  });

  // 繪製x軸
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // 繪製y軸
  g.append("g")
    .call(d3.axisLeft(yScale));

  // 在創建 SVG 元素後，新增兩種domain的顏色區別和名稱
  const legendGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top - 15})`);  // 設置 g 元素的位置
  
  // 添加第一個正方形
  legendGroup.append("rect")
    .attr("x", 10)
    .attr("y", -10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#9B90C2");
  
  // 添加第一個正方形的名稱
  legendGroup.append("text")
    .attr("x", 40)
    .attr("y", 5)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "#000")
    .text("artist");
  
  // 添加第二個正方形
  legendGroup.append("rect")
    .attr("x", 100)
    .attr("y", -10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#D9CD90");
  
  // 添加第二個正方形的名稱
  legendGroup.append("text")
    .attr("x", 130)
    .attr("y", 5)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "#000")
    .text("artistpublic");

  return svg.node();
}


function _22(htl){return(
htl.html`<h2>Strong baseline (陰影效果 & 滑鼠游標偵測效果)<h2>`
)}

function _selectedSeries3(Inputs){return(
Inputs.checkbox(["artist", "artistpublic"], {label: "Choose datasets", value: ["artist", "artistpublic"]})
)}

function _chart2(data,selectedSeries3,d3,artist_columnKey)
{
  // 定義邊界大小，以及圖形的寬度和高度
  const margin = {top: 70, right: 80, bottom: 70, left: 60};
  const width = 700 - margin.left - margin.right;
  const height = 580 - margin.top - margin.bottom;

  // 取得所有的系列名稱（無重複）
  const keys = Array.from(new Set(data.map(d => d.series)));
  
  // 根據選擇的系列過濾數據
  const filteredData = data.filter(d => selectedSeries3.includes(d.series));

  // 對過濾後的數據進行分組處理
  let grouped = Array.from(d3.group(filteredData, d => d.value), ([key, value]) => {
    return {value: key, ...Object.fromEntries(value.map(obj => [obj.series, obj.count]))};
  });

  // 定義堆疊方式並計算
  const stack = d3.stack().keys(keys);
  const series = stack(grouped);
  
  // 定義x軸的比例尺
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.value))
    .range([0, width])
    .padding(0.1);

  // 定義y軸的比例尺
  const yMax = d3.max(series, serie => d3.max(serie, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([height, 0]);

  // 定義顏色的比例尺
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#9B90C2', '#D9CD90']);
   // .range(['lightblue', 'lightblue']);
     //d3.scaleLinear().domain([舊的範圍]).range([新的範圍]) 
    //就是把舊範圍縮放到新的範圍內 

  // 創建SVG元素
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // 在創建 SVG 元素後，新增標題
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text(artist_columnKey);

  // 新增 x 軸標題
  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + margin.bottom / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Value");
  
  // 新增 y 軸標題
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", margin.left / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Count");
  
  // 添加陰影濾鏡效果
  const defs = svg.append("defs");
  const filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
  
  filter.append("feGaussianBlur") //SVG濾鏡效果(高斯模糊) 用於模糊影像
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 4) //模糊的程度
      .attr("result", "blur"); //濾鏡的輸出

  filter.append("feOffset") //濾鏡的輸出(位移)
      .attr("in", "blur") //濾鏡的輸出(為前面定義的blur)
      .attr("dx", 4) //水平位移量
      .attr("dy", 4) //垂直位移量
      .attr("result", "offsetBlur"); //濾鏡的輸出名稱

  const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
               .attr("in", "offsetBlur");
        feMerge.append("feMergeNode")
               .attr("in", "SourceGraphic");

  // 在SVG中添加一個包含所有內容的g元素(對它進行一個平移變換，以便為接下來的元素提供一個留白的區域)
  const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // 繪製每一個系列的柱子
  series.forEach((serie) => {
      let bars = g.append("g")
          .attr("fill", colorScale(serie.key))
          .selectAll("rect")
          .data(serie);
  
      bars.enter().append("rect")
          .attr("x", d => xScale(d.data.value))
          .attr("y", height)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
          .attr("y", d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]))
          .attr("filter", "url(#drop-shadow)") // 添加陰影濾鏡效果
          .on("mouseover", function(d) {
              d3.select(this).attr("fill", "#66BAB7");
            })
          .on("mouseout", function(d) {
              d3.select(this).attr("fill", colorScale(serie.key)); // 恢復原來的顏色
              d3.select(".tooltip").remove();
            });

      // 在每個柱狀圖元素上新增 title
      bars.enter().append("title")
        .text((d) => `${serie.key}\nValue: ${d.data.value}\nCount: ${d[1] - d[0]}`);
  });
  
  // 繪製x軸
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // 繪製y軸
  g.append("g")
    .call(d3.axisLeft(yScale));

  // 在創建 SVG 元素後，新增兩種domain的顏色區別和名稱
  const legendGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top - 15})`);  // 設置 g 元素的位置
  
  // 添加第一個正方形
  legendGroup.append("rect")
    .attr("x", 10)
    .attr("y", -10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#9B90C2");
  
  // 添加第一個正方形的名稱
  legendGroup.append("text")
    .attr("x", 40)
    .attr("y", 5)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "#000")
    .text("artist");
  
  // 添加第二個正方形
  legendGroup.append("rect")
    .attr("x", 100)
    .attr("y", -10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#D9CD90");
  
  // 添加第二個正方形的名稱
  legendGroup.append("text")
    .attr("x", 130)
    .attr("y", 5)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "#000")
    .text("artistpublic");

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artistPublic.csv", {url: new URL("./files/41a9c6bfdf8907c7f19b5a52517012d51d11afcdf769218a6b5c1af5288c865ca2bf10f0fdac5144f8d3676054b833c736642053e880c85ec6123fb15744ae7f.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["artistVer.csv", {url: new URL("./files/363ea43eed3c6a6a6fed83d3e26ac23641da56f4f0689da720760208af84f1c3caff531322fc2ceeaf3924e4ff2f0ca4314a49adfe0e45701c6687fc36ee24d3.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artistVer")).define("artistVer", ["__query","FileAttachment","invalidation"], _artistVer);
  main.variable(observer("artistPublic")).define("artistPublic", ["__query","FileAttachment","invalidation"], _artistPublic);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("artist_columnKey")).define("artist_columnKey", ["artistVer"], _artist_columnKey);
  main.variable(observer("artist_Column")).define("artist_Column", ["artistVer","artist_columnKey"], _artist_Column);
  main.variable(observer("artistver_uniqueValues")).define("artistver_uniqueValues", ["artist_Column"], _artistver_uniqueValues);
  main.variable(observer("artist_counts")).define("artist_counts", ["artistver_uniqueValues","artist_Column"], _artist_counts);
  main.variable(observer("artistpublic_columnKey")).define("artistpublic_columnKey", ["artistPublic"], _artistpublic_columnKey);
  main.variable(observer("artistpublic_Column")).define("artistpublic_Column", ["artistPublic","artistpublic_columnKey"], _artistpublic_Column);
  main.variable(observer("artistpublic_uniqueValues")).define("artistpublic_uniqueValues", ["artistpublic_Column"], _artistpublic_uniqueValues);
  main.variable(observer("artistpublic_counts")).define("artistpublic_counts", ["artistpublic_uniqueValues","artistpublic_Column"], _artistpublic_counts);
  main.variable(observer("data")).define("data", ["artist_counts","artistpublic_counts"], _data);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("viewof selectedSeries")).define("viewof selectedSeries", ["Inputs"], _selectedSeries);
  main.variable(observer("selectedSeries")).define("selectedSeries", ["Generators", "viewof selectedSeries"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","artist_columnKey","data","selectedSeries"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("viewof selectedSeries1")).define("viewof selectedSeries1", ["Inputs"], _selectedSeries1);
  main.variable(observer("selectedSeries1")).define("selectedSeries1", ["Generators", "viewof selectedSeries1"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["data","selectedSeries1","d3","artist_columnKey"], _chart);
  main.variable(observer("viewof selectedSeries2")).define("viewof selectedSeries2", ["Inputs"], _selectedSeries2);
  main.variable(observer("selectedSeries2")).define("selectedSeries2", ["Generators", "viewof selectedSeries2"], (G, _) => G.input(_));
  main.variable(observer("chart1")).define("chart1", ["data","selectedSeries2","d3","artist_columnKey"], _chart1);
  main.variable(observer()).define(["htl"], _22);
  main.variable(observer("viewof selectedSeries3")).define("viewof selectedSeries3", ["Inputs"], _selectedSeries3);
  main.variable(observer("selectedSeries3")).define("selectedSeries3", ["Generators", "viewof selectedSeries3"], (G, _) => G.input(_));
  main.variable(observer("chart2")).define("chart2", ["data","selectedSeries3","d3","artist_columnKey"], _chart2);
  return main;
}
