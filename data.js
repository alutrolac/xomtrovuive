const GIA_DIEN = 4000;
const GIA_NUOC = 20000;
const GIA_PHONG = 1500000;

const PHONG = Array.from({length:40}, (_,i)=>"P"+String(i+1).padStart(2,"0"));
const TEN = ["An","Bình","Cường","Dũng","Hạnh","Hòa","Hùng","Khánh","Lâm","Minh","Nam","Phong","Quang","Sơn","Trang","Tuấn","Vinh"];

const KHACH = PHONG.map(p=>({
  phong:p,
  ten:TEN[Math.floor(Math.random()*TEN.length)],
  dien:Math.floor(Math.random()*250+50),
  nuoc:Math.floor(Math.random()*8+2)
}));
