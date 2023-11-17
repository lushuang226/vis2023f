function _1(md){return(
md`# Untitled`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _cCounts(){return(
[]
)}

function _constellations(data){return(
data.map(item => item.Constellation)
)}

function _constellationList(){return(
["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"]
)}

function _6(cCounts,constellations,constellationList,data)
{
  cCounts.length = 0; //將cCounts清空
  var minConstellation = Math.min(...constellations); //最小星座編號
  var maxConstellation = Math.max(...constellations); //最大星座編號
  for (var c=minConstellation; c<=maxConstellation; c++) { 
    //所有星座都建立兩個Object，一個存放男性資料，一個存放女性資料
    cCounts.push({cNunber:c, constellation:constellationList[c], gender:"male", count:0}); 
    //Object包含：1.星座編號，2.星座名稱，3.男性，4.人數(設為0)
    cCounts.push({cNunber:c, constellation:constellationList[c], gender:"female", count:0}); 
    //Object包含：1.星座編號，2.星座名稱，3.女性，4.人數(設為0)
  }
  data.forEach (x=> { 
    var i = (x.Constellation-minConstellation)*2 + (x.Gender== "男" ? 0 : 1); 
    cCounts[i].count++;
    //讀取data array，加總每個星座的人數
  })
   return cCounts
}


function _7(Plot,constellationList,cCounts){return(
Plot.plot({
  grid: true,
  x: {domain: constellationList},
  y: {label: "count"},

  marks: [
    Plot.ruleY([0]),
    Plot.barY(cCounts, {x: "constellation", y: "count"}),
  ]
})
)}

function _plot3(Inputs){return(
Inputs.form({
  mt: Inputs.range([0, 100], {label: "marginTop", step: 1}),
  mr: Inputs.range([0, 100], {label: "marginRight", step: 1}),
  mb: Inputs.range([0, 100], {label: "marginBottom", step: 1}),
  ml: Inputs.range([0, 100], {label: "marginLeft", step: 1}),
})
)}

function _9(Plot,plot3,constellationList,cCounts){return(
Plot.plot({
  marginTop: plot3.mt,
  marginRight: plot3.mr,
  marginBottom: plot3.mb,
  marginLeft: plot3.ml,
  
  grid: true,
  x: {domain: constellationList},
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(cCounts, {x: "constellation", y: "count", tip: true, fill:"gender"}),
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("cCounts")).define("cCounts", _cCounts);
  main.variable(observer("constellations")).define("constellations", ["data"], _constellations);
  main.variable(observer("constellationList")).define("constellationList", _constellationList);
  main.variable(observer()).define(["cCounts","constellations","constellationList","data"], _6);
  main.variable(observer()).define(["Plot","constellationList","cCounts"], _7);
  main.variable(observer("viewof plot3")).define("viewof plot3", ["Inputs"], _plot3);
  main.variable(observer("plot3")).define("plot3", ["Generators", "viewof plot3"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot3","constellationList","cCounts"], _9);
  return main;
}
