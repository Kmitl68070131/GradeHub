let data = [];

// เรียกใช้เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    const container = document.getElementById('container');
    if (container) {
        console.log('Container found, initializing...');
        loadData(); // โหลดข้อมูลที่เก็บไว้ (จะเรียก showList() เองอยู่แล้ว)
        
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

// โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
function loadData() {
    const saved = localStorage.getItem('coursesData');
    if (saved) {
        data = JSON.parse(saved);
        console.log('Data loaded from localStorage:', data);
        calculateStats(); // คำนวณสถิติหลังโหลดข้อมูล
        updateDashboard(); // อัพเดตแดชบอร์ด
        showList(); // แสดงรายการ
    } else {
        // ถ้าไม่มีข้อมูล ให้แสดง empty state
        console.log('No saved data');
        showList();
    }
}

// บันทึกข้อมูลลง localStorage
function saveData() {
    localStorage.setItem('coursesData', JSON.stringify(data));
    console.log('Data saved to localStorage');
}

function getGrade(score) {
    if (score >= 80) return { grade: 'A', color: '#00ff5eff' };
    if (score >= 75) return { grade: 'B+', color: '#9bfb00ff' };
    if (score >= 70) return { grade: 'B', color: '#0082dfff' };
    if (score >= 65) return { grade: 'C+', color: '#00e1ffff' };
    if (score >= 60) return { grade: 'C', color: '#ffd000ff' };
    if (score >= 55) return { grade: 'D+', color: '#ff9500ff' };
    if (score >= 50) return { grade: 'D', color: '#ff6a00ff' };
    return { grade: 'F', color: '#ff0000ff' };
}


function updateDashboard() {
    const coursesElements = document.querySelectorAll('#credit_courses_text');
    const passElement = document.getElementById('credit_pass');
    const failElement = document.getElementById('credit_fail');
    
    coursesElements.forEach(el => el.innerText = credit_courses);
    if (passElement) passElement.innerText = credit_pass;
    if (failElement) failElement.innerText = credit_fail;
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
    saveData();
    calculateStats();
    updateDashboard();
    showList();

    console.log('Data after push:', data);
    console.log("จำนวนวิชาทั้งหมด:", credit_courses, "วิชา");

    nameInput.value = '';
    creditInput.value = '';
    scoreInput.value = '';
    nameInput.focus();
}

function remove(id) {
    if (confirm('คุณต้องการลบรายวิชานี้หรือไม่?')) {
        data = data.filter(item => item.id !== id);
        saveData();
        calculateStats();
        updateDashboard();
        showList();
        console.log("จำนวนวิชาทั้งหมด:", credit_courses, "วิชา");
    }
}

function showList() {
    console.log('showList called, data length:', data.length);
    const box = document.getElementById('container');
    if (!box) {
        console.error('Container not found!');
        return;
    }
    
    box.innerHTML = '';
    
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
        <button class="btn-delete" data-id="${item.id}">ลบ</button>
        </div>
        `).join('');
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
            remove(parseInt(this.dataset.id));
        });
    });
    console.log('List updated!');
}

let credit_courses = 0;
let credit_pass = 0;
let credit_fail = 0;


function calculateStats() {
    credit_courses = data.length;
    credit_pass = data.filter(item => item.grade !== 'F').length;
    credit_fail = data.filter(item => item.grade === 'F').length;
    console.log("ทั้งหมด:", credit_courses, "ผ่าน:", credit_pass, "ตก:", credit_fail);
}

// Dashboard
function gradeToPoint(grade) {
    switch (grade) {
        case 'A': return 4.0;
        case 'B+': return 3.5;
        case 'B': return 3.0;
        case 'C+': return 2.5;
        case 'C': return 2.0;
        case 'D+': return 1.5;
        case 'D': return 1.0;
        default: return 0.0;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem('coursesData');
    if (!saved) {
        console.warn('ไม่พบข้อมูลรายวิชาใน localStorage');
        return;
    }

    data = JSON.parse(saved);
    const totalCourses = data.length;
    const passed = data.filter(item => item.grade !== 'F').length;
    const failed = data.filter(item => item.grade === 'F').length;

    // คำนวณหน่วยกิตรวมและ GPA
    let totalCredits = 0;
    let totalPoints = 0;
    data.forEach(item => {
        totalCredits += item.credit;
        totalPoints += gradeToPoint(item.grade) * item.credit;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    const passPercent = totalCourses > 0 ? ((passed / totalCourses) * 100).toFixed(1) : 0;

    // แสดงผลในหน้า Dashboard
    document.getElementById('grade').innerText = gpa;
    document.querySelectorAll('#credit_courses').forEach(el => el.innerText = totalCourses);
    document.getElementById('credit_pass_text').innerText = passed;
    document.getElementById('credit_fail_text').innerText = failed;
    document.getElementById('total_credits').innerText = totalCredits;

    console.log(`ผ่าน ${passed}/${totalCourses} (${passPercent}%)`);
});

