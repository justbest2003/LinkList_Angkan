let carriageCount = 0;
let dragged;

document.addEventListener('DOMContentLoaded', (event) => {
  const train = document.getElementById("train");

  // สร้างฟังก์ชันเพิ่มโบกี้ใหม่
window.addCarriage = function () {
  if (carriageCount < 10) {
    carriageCount++;
    const newCarriage = document.createElement("div");
    newCarriage.className = "carriage";
    newCarriage.setAttribute("draggable", true);
    newCarriage.id = "carriage" + carriageCount;
    newCarriage.innerHTML = `<img src="images/head.png" alt="train_carriage_image"> โบกี้ ${carriageCount}`;
    train.appendChild(newCarriage);
    addDragEvents(newCarriage);
    updateCarriageCountDisplay(); // เพิ่มบรรทัดนี้เพื่ออัปเดตการแสดงจำนวนโบกี้
  } else {
    alert("ไม่สามารถเพิ่มโบกี้ได้ เพราะเต็มแล้ว");
  }
};

function updateCarriageCountDisplay() {
  const carriageCountDisplay = document.getElementById("carriageCountDisplay");
  carriageCountDisplay.textContent = "จำนวนโบกี้: " + carriageCount;
}


  // สร้างฟังก์ชันลบทั้งหมดโบกี้
  window.removeAllCarriages = function () {
    const train = document.getElementById("train");
    train.innerHTML = ""; // ลบทั้งหมดโบกี้ที่อยู่ในรถไฟ
    carriageCount = 0;
    updateCarriageCountDisplay(); // เพิ่มบรรทัดนี้เพื่ออัปเดตการแสดงจำนวนโบกี้
  };

  const addDragEvents = (item) => {
    item.addEventListener("dragstart", (e) => {
      dragged = item;
      e.dataTransfer.setData("text/plain", item.id);
    });
  };

  // จัดการกับการลากและวาง
  // (เพิ่มเหตุการณ์ dragover และ drop ตามตัวอย่างก่อนหน้า)
  train.addEventListener("dragover", (e) => {
    e.preventDefault(); // อนุญาตให้วาง
  });

  train.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragged && e.target.className === "carriage") {
      // หาโบกี้ที่อยู่ใกล้ที่สุดและวางโบกี้ที่ลากมาก่อนหรือหลัง
      const afterElement = getDragAfterElement(train, e.clientX);
      if (afterElement == null) {
        train.appendChild(dragged);
      } else {
        train.insertBefore(dragged, afterElement);
      }
    }
  });

  // ฟังก์ชันหาโบกี้ที่ควรจะวางโบกี้ที่ลากมาต่อหน้าหรือหลัง
  function getDragAfterElement(container, x) {
    const draggableElements = [
      ...container.querySelectorAll(".carriage:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
});

