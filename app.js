const GIA_PHONG = 1500000;
const GIA_DIEN = 4000;
const GIA_NUOC = 20000;

const TEN = ["An","Bình","Cường","Dũng","Hạnh","Hòa","Hùng","Khánh","Lâm","Minh","Nam","Phong","Quang","Sơn","Trang","Tuấn","Vinh"];
const PHONG = [...Array(40)].map((_,i)=>"P"+String(i+1).padStart(2,"0"));

let data = JSON.parse(localStorage.getItem("nhatro_pro")) ||
PHONG.map(p=>({
  phong:p,
  ten:TEN[Math.floor(Math.random()*TEN.length)],
  dien:100,
  nuoc:3
}));

const bang = document.getElementById("bang");

function render(){
  bang.innerHTML="";
  data.forEach((k,i)=>{
    const tong = GIA_PHONG + k.dien*GIA_DIEN + k.nuoc*GIA_NUOC;
    bang.innerHTML += `
      <tr>
        <td>${k.phong}</td>
        <td>${k.ten}</td>
        <td><input class="form-control" value="${k.dien}" onchange="data[${i}].dien=this.value"></td>
        <td><input class="form-control" value="${k.nuoc}" onchange="data[${i}].nuoc=this.value"></td>
        <td>${tong.toLocaleString()} đ</td>
      </tr>
    `;
  });
}
render();

function luu(){
  localStorage.setItem("nhatro_pro", JSON.stringify(data));
  alert("Đã lưu dữ liệu");
}

function xuat(){
  let csv = "Phong,Khach,Dien,Nuoc,Tong\n";
  data.forEach(k=>{
    let t = GIA_PHONG + k.dien*GIA_DIEN + k.nuoc*GIA_NUOC;
    csv += `${k.phong},${k.ten},${k.dien},${k.nuoc},${t}\n`;
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download = "quan_ly_nha_tro.csv";
  a.click();
}
