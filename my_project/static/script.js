// ==================== Courses Page ====================
let data = [];

// โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
function loadData() {
    const saved = localStorage.getItem('coursesData');
    if (saved) {
        data = JSON.parse(saved);
        console.log('Data loaded from localStorage:', data);
    }
}

// บันทึกข้อมูลลง localStorage
function saveData() {
    localStorage.setItem('coursesData', JSON.stringify(data));
    console.log('Data saved to localStorage');
}

function getGrade(score) {
    if (score >= 80) return { grade: 'A', color: '#10b981' };
    if (score >= 75) return { grade: 'B+', color: '#34d399' };
    if (score >= 70) return { grade: 'B', color: '#3b82f6' };
    if (score >= 65) return { grade: 'C+', color: '#60a5fa' };
    if (score >= 60) return { grade: 'C', color: '#f59e0b' };
    if (score >= 55) return { grade: 'D+', color: '#fb923c' };
    if (score >= 50) return { grade: 'D', color: '#f97316' };
    return { grade: 'F', color: '#ef4444' };
}

function AddCourse() {
    console.log('AddCourse called');
    
    const nameInput = document.getElementById('txtName');
    const creditInput = document.getElementById('txtCredit');
    const scoreInput = document.getElementById('txtScore');
    
    if (!nameInput || !creditInput || !scoreInput) {
        console.error('Elements not found!');
        return;
    }
    
    const name = nameInput.value.trim();
    const credit = creditInput.value.trim();
    const score = scoreInput.value.trim();
    
    console.log('Values:', name, credit, score);

    if (name === '') {
        alert('กรุณากรอกชื่อรายวิชา');
        nameInput.focus();
        return;
    }

    if (credit === '' || credit <= 0) {
        alert('กรุณากรอกหน่วยกิตที่ถูกต้อง');
        creditInput.focus();
        return;
    }

    if (score === '' || score < 0 || score > 100) {
        alert('กรุณากรอกคะแนนที่ถูกต้อง (0-100)');
        scoreInput.focus();
        return;
    }

    const gradeInfo = getGrade(parseFloat(score));
    
    const item = {
        id: Date.now(),
        name: name,
        credit: parseInt(credit),
        score: parseFloat(score),
        grade: gradeInfo.grade,
        color: gradeInfo.color
    };

    data.push(item);
    saveData(); // บันทึกข้อมูล
    console.log('Data after push:', data);
    
    showList();

    nameInput.value = '';
    creditInput.value = '';
    scoreInput.value = '';
    nameInput.focus();
}

function showList() {
    console.log('showList called, data length:', data.length);
    
    const box = document.getElementById('container');
    
    if (!box) {
        console.error('Container not found!');
        return;
    }

    if (data.length === 0) {
        box.innerHTML = `
            <div class="empty">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <p>ยังไม่มีรายวิชา กรุณาเพิ่มรายวิชาใหม่</p>
            </div>
        `;
        return;
    }

    box.innerHTML = data.map(item => `
        <div class="item">
            <div class="name">
                <div class="label">ชื่อรายวิชา</div>
                <div class="value">${item.name}</div>
            </div>
            <div class="credit">
                <div class="label">หน่วยกิต</div>
                <div class="value">${item.credit}</div>
            </div>
            <div class="point">
                <div class="label">คะแนน</div>
                <div class="value">${item.score}</div>
            </div>
            <div class="grade-box">
                <div class="label">เกรด</div>
                <div class="grade-badge" style="background: ${item.color}">${item.grade}</div>
            </div>
            <button class="btn-delete" onclick="remove(${item.id})">ลบ</button>
        </div>
    `).join('');
    
    console.log('List updated!');
}

function remove(id) {
    if (confirm('คุณต้องการลบรายวิชานี้หรือไม่?')) {
        data = data.filter(item => item.id !== id);
        saveData(); // บันทึกข้อมูลหลังลบ
        showList();
    }
}

// ฟังก์ชันลบข้อมูลทั้งหมด (เผื่อต้องการใช้)
function clearAllData() {
    if (confirm('คุณต้องการลบข้อมูลทั้งหมดหรือไม่?')) {
        data = [];
        saveData();
        showList();
        alert('ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
    }
}

// เรียกใช้เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    const container = document.getElementById('container');
    if (container) {
        console.log('Container found, initializing...');
        loadData(); // โหลดข้อมูลที่เก็บไว้
        showList(); // แสดงข้อมูล
        // กด Enter ในช่องคะแนนเพื่อเพิ่มรายวิชา
        const scoreInput = document.getElementById('txtScore');
        if (scoreInput) {
            scoreInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    AddCourse();
                }
            });
        }
    }
});