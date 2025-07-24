// Khởi tạo trạng thái checkbox cho mục gốc
function initCheckboxes() {
  // ...existing code...
}

// Lưu trạng thái checklist
function saveChecklist() {
  const data = {};
  document.querySelectorAll('.section').forEach(section => {
    const items = [];
    section.querySelectorAll('label').forEach(label => {
      const checkbox = label.querySelector('input[type="checkbox"]');
      items.push({
        text: label.querySelector('span').textContent,
        checked: checkbox.checked,
        original: label.getAttribute('data-original') === 'true'
      });
    });
    data[section.id] = items;
  });
  localStorage.setItem('weddingChecklist', JSON.stringify(data));
}

// Tải lại trạng thái checklist
function loadChecklist() {
  const data = JSON.parse(localStorage.getItem('weddingChecklist') || '{}');
  Object.keys(data).forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    // Xóa các label cũ
    section.querySelectorAll('label').forEach(label => label.remove());
    // Thêm lại các label từ localStorage
    data[sectionId].forEach(item => {
      const label = document.createElement('label');
      if (item.original) label.setAttribute('data-original', 'true');
      label.innerHTML = `<input type="checkbox"${item.checked ? ' checked' : ''}><span>${item.text}</span>`;
      section.appendChild(label);
    });
  });
}

// Thêm mục mới
function addItem(sectionId) {
  const input = document.getElementById('input-' + sectionId);
  const value = input.value.trim();
  if (!value) return;
  const section = document.getElementById(sectionId);
  const label = document.createElement('label');
  label.innerHTML = `<input type="checkbox"><span>${value}</span>`;
  section.appendChild(label);
  input.value = '';
  saveChecklist();
}

// Reset từng section
function resetSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.querySelectorAll('label').forEach(label => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (label.getAttribute('data-original') === 'true') {
      checkbox.checked = false;
    } else {
      label.remove();
    }
  });
  saveChecklist();
}

// Reset toàn bộ
function resetAll() {
  document.querySelectorAll('.section').forEach(section => resetSection(section.id));
  saveChecklist();
}

// Sự kiện lưu khi tick checkbox
document.addEventListener('change', function(e) {
  if (e.target.matches('input[type="checkbox"]')) {
    saveChecklist();
  }
});

// Tải lại khi mở trang
window.addEventListener('DOMContentLoaded', loadChecklist);

// Cho phép thêm mục mới bằng phím Enter
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const sectionId = input.id.replace('input-', '');
        addItem(sectionId);
      }
    });
  });
});
