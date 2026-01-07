const GIA_DIEN=4000,GIA_NUOC=20000,GIA_PHONG=1500000;
const TEN=["An","Bình","Cường","Dũng","Hạnh","Hòa","Hùng","Khánh","Lâm","Minh","Nam","Phong","Quang","Sơn","Trang","Tuấn","Vinh"];
const PHONG=[...Array(40)].map((_,i)=>"P"+String(i+1).padStart(2,"0"));

let data=JSON.parse(localStorage.getItem("nha_tro")) ||
PHONG.map(p=>({phong:p,ten:TEN[Math.floor(Math.random()*TEN.length)],dien:100,nuoc:3}));

const bang=document.getElementById("bang");

function ve(){
 bang.innerHTML=`<tr>
 <th>Phòng</th><th>Khách</th><th>Điện</th><th>Nước</th><th>Tổng</th></tr>`;
 data.forEach((k,i)=>{
  const tong=GIA_PHONG+k.dien*GIA_DIEN+k.nuoc*GIA_NUOC;
  bang.innerHTML+=`
  <tr>
   <td>${k.phong}</td>
   <td>${k.ten}</td>
   <td><input value="${k.dien}" onchange="data[${i}].dien=this.value"></td>
   <td><input value="${k.nuoc}" onchange="data[${i}].nuoc=this.value"></td>
   <td>${tong.toLocaleString()} đ</td>
  </tr>`;
 });
}
ve();

function luu(){
 localStorage.setItem("nha_tro",JSON.stringify(data));
 alert("Đã lưu dữ liệu");
}

function xuat(){
 let text="HOA DON NHA TRO\n\n";
 data.forEach(k=>{
  let t=GIA_PHONG+k.dien*GIA_DIEN+k.nuoc*GIA_NUOC;
  text+=`${k.phong} - ${k.ten}: ${t.toLocaleString()} đ\n`;
 });
 const blob=new Blob([text],{type:"text/plain"});
 const a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="hoa_don.txt";
 a.click();
}
