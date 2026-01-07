const bang = document.getElementById("bang");

KHACH.forEach(k=>{
  const tong = GIA_PHONG + k.dien*GIA_DIEN + k.nuoc*GIA_NUOC;
  bang.innerHTML += `
    <tr>
      <td>${k.phong}</td>
      <td>${k.ten}</td>
      <td>${k.dien}</td>
      <td>${k.nuoc}</td>
      <td>${tong.toLocaleString()} đ</td>
    </tr>
  `;
});
