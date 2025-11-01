// ตัวแปร
let data = [];
let credit_courses = 0;
let credit_pass = 0;
let credit_fail = 0;

// โหลดข้อมูลจาก localStorage
function loadData() {
    const saved = localStorage.getItem('coursesData');
    if (saved) {
        data = JSON.parse(saved);
        console.log('Data loaded:', data);
        return true;
    }
    console.log('No saved data');
    return false;
}

// บันทึกข้อมูลลง localStorage
function saveData() {
    localStorage.setItem('coursesData', JSON.stringify(data));
    console.log('Data saved to localStorage');
}

// คำนวณเกรดจากคะแนน
function getGrade(score) {
    if (score >= 80) return { grade: 'A', color: '#07ff28ff' };
    if (score >= 75) return { grade: 'B+', color: '#a2fa00ff' };
    if (score >= 70) return { grade: 'B', color: '#e5ff00ff' };
    if (score >= 65) return { grade: 'C+', color: '#ebdf37ff' };
    if (score >= 60) return { grade: 'C', color: '#d9ff00ff' };
    if (score >= 55) return { grade: 'D+', color: '#ffa600ff' };
    if (score >= 50) return { grade: 'D', color: '#fd7b01ff' };
    return { grade: 'F', color: '#ff0000ff' };
}

// แปลงเกรดเป็นคะแนน GPA
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

// คำนวณสถิติ
function calculateStats() {
    credit_courses = data.length;
    credit_pass = data.filter(item => item.grade !== 'F').length;
    credit_fail = data.filter(item => item.grade === 'F').length;
    console.log("ทั้งหมด:", credit_courses, "ผ่าน:", credit_pass, "ตก:", credit_fail);
}

// ส่วนของหน้า COURSES (Courses Page)

// เพิ่มรายวิชาใหม่
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
    showList();

    console.log('Data after push:', data);
    console.log("จำนวนวิชาทั้งหมด:", credit_courses, "วิชา");

    nameInput.value = '';
    creditInput.value = '';
    scoreInput.value = '';
    nameInput.focus();
}

// ลบรายวิชา
function remove(id) {
    if (confirm('คุณต้องการลบรายวิชานี้หรือไม่?')) {
        data = data.filter(item => item.id !== id);
        saveData();
        calculateStats();
        showList();
        console.log("จำนวนวิชาทั้งหมด:", credit_courses, "วิชา");
    }
}

// แสดงรายการวิชาทั้งหมด
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

// เริ่มต้นหน้า Courses
function initCoursesPage() {
    console.log('Courses page initialized');
    loadData();
    calculateStats();
    showList();
    
    const scoreInput = document.getElementById('txtScore');
    if (scoreInput) {
        scoreInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                AddCourse();
            }
        });
    }
}

// ส่วนของหน้า DASHBOARD (Dashboard Page)

// อัปเดตข้อมูลใน Dashboard
function updateDashboard() {
    console.log('Updating dashboard...');
    
    // คำนวณหน่วยกิตรวมและ GPA
    let totalCredits = 0;
    let totalPoints = 0;
    
    data.forEach(item => {
        totalCredits += item.credit;
        totalPoints += gradeToPoint(item.grade) * item.credit;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    // อัปเดต GPA
    const gradeElement = document.getElementById('grade');
    if (gradeElement) {
        gradeElement.innerText = gpa;
    }

    // อัปเดตหน่วยกิตรวม
    const totalCreditsElement = document.getElementById('total_credits');
    if (totalCreditsElement) {
        totalCreditsElement.innerText = totalCredits;
    }

    // อัปเดตรายวิชาที่ผ่าน
    const creditPassElement = document.getElementById('credit_pass');
    if (creditPassElement) {
        creditPassElement.innerText = credit_pass;
    }

    // อัปเดตรายวิชาที่ตก
    const creditFailElement = document.getElementById('credit_fail');
    if (creditFailElement) {
        creditFailElement.innerText = credit_fail;
    }

    // อัปเดตจำนวนวิชาทั้งหมด
    const totalCoursesElements = document.querySelectorAll('#total_courses');
    totalCoursesElements.forEach(el => {
        el.innerText = credit_courses;
    });

    console.log('Dashboard updated - GPA:', gpa, 'Credits:', totalCredits, 'Pass:', credit_pass, 'Fail:', credit_fail);
}

// เริ่มต้นหน้า Dashboard
function initDashboardPage() {
    console.log('Dashboard page initialized');
    loadData();
    calculateStats();
    updateDashboard();
}

// ไว้เก็บตัวแปลวิชาจำลองนะจ้ะ
let simData = [];

// funtion โหลดหน้า simulation
function loadSimulationPage() {
    const saved = localStorage.getItem('coursesData'); // ดึงข้อมูลจาก couses
    let currentGPAX = 0.0;
    let currentTotalCredits = 0;
    if (saved) {
        const localData = JSON.parse(saved);
        let currentTotalPoints = 0;
        localData.forEach(item => {
            currentTotalCredits += item.credit;
            currentTotalPoints += gradeToPoint(item.grade) * item.credit;
        });
        currentGPAX = currentTotalCredits > 0 ? (currentTotalPoints / currentTotalCredits) : 0.0;
    }
    
    // #ยัดค่าที่คำนวณได้ ไปใส่ใน "ช่องกรอก"
    document.getElementById('sim_manual_gpax').value = currentGPAX.toFixed(2);
    document.getElementById('sim_manual_credits').value = currentTotalCredits;

    // #เรียกฟังก์ชันข้างล่างนี้เพื่ออัปเดตหน้าจอ
    updateCurrentStatusDisplay(); 
}

// function ไว้อัปเดตสถานะความเสี่ยง
function updateRiskStatus(elementId, gpa) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (gpa >= 2.00) {
        el.innerText = 'ปลอดภัย';
        el.className = 'gpa-value status-safe';
    } else if (1.5 <= gpa < 2) {
        el.innerText = 'ติดโปร';
        el.className = 'gpa-value status-warn';
    } else {
        el.innerText = 'ติดโปรและเสี่ยงรีไทร์';
        el.className = 'gpa-value status-danger';
    }
}

// #ฟังก์ชันที่ทำงานตอน "แก้เลข" ในช่อง GPAX
function updateCurrentStatusDisplay() {
    // #อ่านค่าล่าสุดจากช่องกรอก
    const manualGPAX = parseFloat(document.getElementById('sim_manual_gpax').value) || 0;
    
    // #อัปเดตการ์ด "สถานะความเสี่ยง"
    updateRiskStatus('sim_risk_status', manualGPAX);
    
    // #คำนวณ "GPAX ใหม่" ทั้งหมดอีกรอบ
    calculateSimResults(); 
}

// #ฟังก์ชันที่ทำงานตอนกดปุ่ม "เพิ่มวิชาจำลอง"
function addSimCourse() {
    // #1. อ่านค่าจากช่องกรอก
    const name = document.getElementById('sim_name').value.trim();
    const credit = parseInt(document.getElementById('sim_credit').value);
    const grade = document.getElementById('sim_grade').value;

    if (name === '' || isNaN(credit) || credit <= 0) {
        alert('กรุณากรอกข้อมูลให้ถูกต้อง');
        return;
    }
    
    // #2. สร้าง object วิชานี้
    const item = { id: Date.now(), name: name, credit: credit, grade: grade };
    simData.push(item);
    
    // #3. สั่งให้มันโชว์ใน List และคำนวณใหม่
    showSimList();
    calculateSimResults(); 

    // #4. เคลียร์ช่องกรอก
    document.getElementById('sim_name').value = '';
    document.getElementById('sim_credit').value = '';

}

// ฟังก์ชันแสดงรายการวิชาจำลอง
function showSimList() {
    const box = document.getElementById('sim_course_list_container');
    if (simData.length === 0) {
        box.innerHTML = '<p style="color: #999; text-align: center;">ยังไม่มีวิชาจำลอง...</p>';
        return;
    }
    // สร้าง HTML จากอาเรย์ simData
    box.innerHTML = simData.map(item => `
        <div class="item">
            <div class="name"><div class="label">ชื่อ</div><div class="value">${item.name}</div></div>
            <div class="credit"><div class="label">หน่วยกิต</div><div class="value">${item.credit}</div></div>
            <div class="point"><div class="label">เกรด</div><div class="value">${item.grade}</div></div>
            <button class="btn-delete" onclick="removeSimCourse(${item.id})">ลบ</button>
        </div>
    `).join('');
}

// ฟังก์ชันลบวิชาจำลอง
function removeSimCourse(id) {
    simData = simData.filter(item => item.id !== id); 
    showSimList(); // #โชว์ List ใหม่
    calculateSimResults(); // #คำนวณเกรดใหม่
}

// ฟังก์ชันคำนวณ GPS และ GPAX ใหม่
function calculateSimResults() {
    // #อ่านค่าจาก "ช่องกรอก GPAX ปัจจุบัน"
    const manualGPAX = parseFloat(document.getElementById('sim_manual_gpax').value) || 0;
    const manualCredits = parseInt(document.getElementById('sim_manual_credits').value) || 0;
    const manualTotalPoints = manualGPAX * manualCredits; // #แต้มรวมเดิม

    // คำนวณแต้มรวมของ "เทอมนี้" (จาก simData)
    let simTotalPoints = 0;
    let simTotalCredits = 0;
    simData.forEach(item => {
        simTotalCredits += item.credit;
        simTotalPoints += gradeToPoint(item.grade) * item.credit;
    });

    const simGPS = simTotalCredits > 0 ? (simTotalPoints / simTotalCredits) : 0.0;

    // GPAX ใหม่
    const newTotalPoints = manualTotalPoints + simTotalPoints;
    const newTotalCredits = manualCredits + simTotalCredits;
    const newGPAX = newTotalCredits > 0 ? (newTotalPoints / newTotalCredits) : 0.0;

    // ยัดผลลัพธ์กลับไปโชว์ใน HTML
    document.getElementById('sim_gps_result').innerText = simGPS.toFixed(2);
    document.getElementById('sim_semester_credits').innerText = simTotalCredits;
    document.getElementById('sim_new_gpax_result').innerText = newGPAX.toFixed(2);
    document.getElementById('sim_new_total_credits').innerText = newTotalCredits;
    updateRiskStatus('sim_new_risk_status', newGPAX); 
}
// เหลืออัพเดทตัว start, fucntion วางแผนความหน้าจะเป็น

// เริ่มต้นระบบ

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    // ตรวจสอบว่าอยู่หน้าไหน
    const container = document.getElementById('container');
    const gradeElement = document.getElementById('grade');
    if (container) {
        // อยู่หน้า Courses
        initCoursesPage();
    } else if (gradeElement) {
        // อยู่หน้า Dashboard
        initDashboardPage();
    }
});