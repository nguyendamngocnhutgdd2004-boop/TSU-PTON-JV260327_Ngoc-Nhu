let tasks = JSON.parse(localStorage.getItem('tasks')) || [
  { 
    id: 1, 
    name:'Thiết kế giao diện', 
    assignee: 'Nguyễn Văn A', 
    deadline: '2026-07-10', 
    status: 'Hoàn thành' 
},
  { 
    id: 2, 
    name:'Kiểm thử toàn bộ hệ thống', 
    assignee: 'Lê Văn B',     
    deadline: '2026-08-01', 
    status: 'Chờ làm'    
},];

let nextId = parseInt(localStorage.getItem('nextId')) || 4;
let editingId = null;

function saveData() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('nextId', nextId);
}

function validateForm() {
    let name = document.getElementById("taskName").value.trim();
    let assignee = document.getElementById("taskAssignee").value.trim();
    let deadline = document.getElementById("taskDeadline").value;
    if (name.length < 5) {
        alert("Tên công việc phải có ít nhất 5 ký tự");
    return false;
    }
    if (assignee === "") {
        alert("Vui lòng nhập người thực hiện");
    return false;
    }
    let today = new Date().toISOString().split("T")[0];
    if (deadline <= today) {
        alert("Deadline phải là ngày trong tương lai");
    return false;
    }
    return true;
}
function submitForm() {
    if (!validateForm()) return;
    let task = {
        name: document.getElementById("taskName").value.trim(),
        assignee: document.getElementById("taskAssignee").value.trim(),
        deadline: document.getElementById("taskDeadline").value,
        status: document.getElementById("taskStatus").value
    };
    if (editingId == null) {
task.id = nextId++;
    tasks.push(task);
    } else {
    let index = tasks.findIndex(t => t.id === editingId);
    tasks[index] = { id: editingId, ...task };
    editingId = null;
    }
    saveData();
    resetForm();
    renderTable();
}
function resetForm() {
    document.getElementById("taskName").value = "";
    document.getElementById("taskAssignee").value = "";
    document.getElementById("taskDeadline").value = "";
    document.getElementById("taskStatus").value = "Chờ làm";
}
function editTask(id) {
    let task = tasks.find(t => t.id === id);
    document.getElementById("taskName").value = task.name;
    document.getElementById("taskAssignee").value = task.assignee;
    document.getElementById("taskDeadline").value = task.deadline;
    document.getElementById("taskStatus").value = task.status;
    editingId = id;
}
function deleteTask(id) {
    if (confirm("Bạn có muốn xóa?")) {
    tasks = tasks.filter(t => t.id !== id);
    saveData();
    renderTable();
    }
}
function renderTable() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let sort = document.getElementById("sortSelect").value;
    let list = tasks.filter(t =>
        t.name.toLowerCase().includes(keyword) ||
        t.assignee.toLowerCase().includes(keyword)
);
    if (sort === "az") {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }
    let tbody = document.getElementById("tbody");
        tbody.innerHTML = "";
        list.forEach(task => {
        tbody.innerHTML += `
<tr>
<td>${task.id}</td>
<td>${task.name}</td>
<td>${task.assignee}</td>
<td>${task.deadline}</td>
<td>${task.status}</td>
<td>
<button onclick="editTask(${task.id})">Sửa</button>
<button onclick="deleteTask(${task.id})">Xóa</button>
</td>
</tr>
   `;
 });
}