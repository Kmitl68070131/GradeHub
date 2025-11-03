// ตัวแปร
let data = [];
let credit_courses = 0;
let credit_pass = 0;
let credit_fail = 0;

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
// โหลดข้อมูลจาก localStorage
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
    if (score >= 80) return { grade: 'A', color: '#4be173ff' };
    if (score >= 75) return { grade: 'B+', color: '#a3df62ff' };
    if (score >= 70) return { grade: 'B', color: '#c1e35bff' };
    if (score >= 65) return { grade: 'C+', color: '#e8eb37ff' };
    if (score >= 60) return { grade: 'C', color: '#f4d62eff' };
    if (score >= 55) return { grade: 'D+', color: '#ffa02cff' };
    if (score >= 50) return { grade: 'D', color: '#e87c2fff' };
    return { grade: 'F', color: '#c52121ff' };
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
    updateDashboard();

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
        updateDashboard();
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
    let currentGPA = 0.0;
    let currentTotalCredits = 0;
    if (saved) {
        const localData = JSON.parse(saved);
        let currentTotalPoints = 0;
        localData.forEach(item => {
            currentTotalCredits += item.credit;
            currentTotalPoints += gradeToPoint(item.grade) * item.credit;
        });
        currentGPA = currentTotalCredits > 0 ? (currentTotalPoints / currentTotalCredits) : 0.0;
    }
    
    // #ยัดค่าที่คำนวณได้ ไปใส่ใน "ช่องกรอก"
    document.getElementById('sim_manual_gpa').value = currentGPA.toFixed(2);
    document.getElementById('sim_manual_credits').value = currentTotalCredits;

    // #เรียกฟังก์ชันข้างล่างนี้เพื่ออัปเดตหน้าจอ
    updateCurrentStatusDisplay(); 
}

// function ไว้อัปเดตสถานะความเสี่ยง
function updateRiskStatus(elementId, gpa, gps = 2.0) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (gpa < 1.00) {
        el.innerText = 'รีไทร์';
        el.className = 'gpa-value status-danger';
    } else if (gpa < 2.00 && gps < 2.00) {
        el.innerText = 'รีไทร์';
        el.className = 'gpa-value status-danger';
    } else if (gpa < 1.50) {
        el.innerText = 'เสี่ยงรีไทร์';
        el.className = 'gpa-value status-warn';
    } else if (gpa < 1.75) {
        el.innerText = 'ติดโปร';
        el.className = 'gpa-value status-warn'; // #สีเหลือง
    } else if (gpa < 2.00) {
        el.innerText = 'ติดโปร';
        el.className = 'gpa-value status-warn';
    } else if (gpa < 2.10) { 
        el.innerText = 'ปลอดภัย';
        el.className = 'gpa-value status-safe'; // #สีเขียว แต่ข้อความเตือน

    //ปลอดภัย
    } else {
        el.innerText = 'ปลอดภัย';
        el.className = 'gpa-value status-safe';
    }
}

// #ฟังก์ชันที่ทำงานตอน "แก้เลข" ในช่อง GPA
function updateCurrentStatusDisplay() {
    // #อ่านค่าล่าสุดจากช่องกรอก
    const manualGPA = parseFloat(document.getElementById('sim_manual_gpa').value) || 0;
    
    // #อัปเดตการ์ด "สถานะความเสี่ยง"
    updateRiskStatus('sim_risk_status', manualGPA);
    
    // #คำนวณ "GPA ใหม่" ทั้งหมดอีกรอบ
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

// ฟังก์ชันคำนวณ GPS และ GPA ใหม่
function calculateSimResults() {
    // อ่านค่าจาก "ช่องกรอก GPA ปัจจุบัน"
    const manualGPA = parseFloat(document.getElementById('sim_manual_gpa').value) || 0;
    const manualCredits = parseInt(document.getElementById('sim_manual_credits').value) || 0;
    const manualTotalPoints = manualGPA * manualCredits; // #แต้มรวมเดิม

    // คำนวณแต้มรวมของ "เทอมนี้" (จาก simData)
    let simTotalPoints = 0;
    let simTotalCredits = 0;
    simData.forEach(item => {
        simTotalCredits += item.credit;
        simTotalPoints += gradeToPoint(item.grade) * item.credit;
    });

    const simGPS = simTotalCredits > 0 ? (simTotalPoints / simTotalCredits) : 0.0;


    const newGPA = newTotalCredits > 0 ? (newTotalPoints / newTotalCredits) : 0.0;

    // ยัดผลลัพธ์กลับไปโชว์ใน HTML
    document.getElementById('sim_gps_result').innerText = simGPS.toFixed(2);
    document.getElementById('sim_semester_credits').innerText = simTotalCredits;

    document.getElementById('sim_new_gpa_result').innerText = newGPA.toFixed(2);
    document.getElementById('sim_new_total_credits').innerText = newTotalCredits;
    
    updateRiskStatus('sim_new_risk_status', newGPA, simGPS); 
}

// ฟังก์ชันคำนวณเป้าหมายระยะยาว (เกียรตินิยม)
function calculateLongTermGoal() {
    // #1. อ่านค่าจากช่องเป้าหมาย
    const targetGPA = parseFloat(document.getElementById('goal_target_gpa').value);
    const remainingCredits = parseInt(document.getElementById('goal_remaining_credits').value);

    if (isNaN(targetGPA) || targetGPA <= 0 || targetGPA > 4) {
        alert('กรุณากรอก GPA เป้าหมายที่ถูกต้อง (0.01 - 4.00)');
        return;
    }
    if (isNaN(remainingCredits) || remainingCredits <= 0) {
        alert('กรุณากรอกหน่วยกิตที่เหลือที่ถูกต้อง');
        return;
    }

    // #2. อ่านค่า "GPA ใหม่" (หลังจบเทอมนี้)
    const currentNewGPA = parseFloat(document.getElementById('sim_new_gpa_result').innerText) || 0;
    const currentNewCredits = parseInt(document.getElementById('sim_new_total_credits').innerText) || 0;
    const currentNewPoints = currentNewGPA * currentNewCredits;
    
    // #3. คำนวณ
    const finalTotalCredits = currentNewCredits + remainingCredits;
    const requiredTotalPoints = targetGPA * finalTotalCredits;
    const requiredFuturePoints = requiredTotalPoints - currentNewPoints;
    const requiredFutureGPA = requiredFuturePoints / remainingCredits; // เกรดต้องทำที่เหลือ

    // #4. แสดงผล
    const resultArea = document.querySelector('.goal-results'); 
    const resultText = document.getElementById('goal_result_text');
    resultArea.style.display = 'block'; // เปิดกล่องผลลัพธ์

    if (requiredFutureGPA > 4.0) {
        resultText.innerHTML = `เป้าหมาย <strong class="status-danger">เป็นไปไม่ได้</strong> 
            <br>คุณต้องทำเกรดเฉลี่ย <strong class="status-danger">${requiredFutureGPA.toFixed(2)}</strong> 
            ใน <strong>${remainingCredits}</strong> หน่วยกิตที่เหลือ (มันเกิน 4.00)`;
    } else if (requiredFutureGPA <= 0) {
         resultText.innerHTML = `เป้าหมาย <strong class="status-safe">สำเร็จแล้ว!</strong> 
            <br>GPA (หลังจบเทอมนี้) ของคุณคือ <strong>${currentNewGPA.toFixed(2)}</strong> ซึ่งสูงกว่าเป้าหมาย <strong>${targetGPA.toFixed(2)}</strong> แล้ว
            <br>แค่เรียนให้ผ่านหมด (เกรด D ขึ้นไป) ใน <strong>${remainingCredits}</strong> หน่วยกิตที่เหลือก็พอ`;
    } else {
        resultText.innerHTML = `เป้าหมาย <strong class="status-safe">เป็นไปได้</strong> 
            <br>คุณต้องทำเกรดเฉลี่ยอย่างน้อย <strong class="status-safe">${requiredFutureGPA.toFixed(2)}</strong> 
            ใน <strong>${remainingCredits}</strong> หน่วยกิตที่เหลือ`;
    }
}

// เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    // เช็คว่าเป็นหน้า Courses
    const container = document.getElementById('container');
    if (container) {
        console.log('Courses page found, initializing...');
        loadData(); 
        
        const scoreInput = document.getElementById('txtScore');
        if (scoreInput) {
            scoreInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    AddCourse();
                }
            });
        }
    }
    // เช็คว่าเป็นหน้า Dashboard
    const gradeElement = document.getElementById('grade');
    if (gradeElement) {
        console.log('Dashboard page found, initializing...');
        initDashboardPage(); // เรียก function นี้
    }
    
    // เช็คว่าเป็นหน้า Simulation
    const simManualGPA = document.getElementById('sim_manual_gpa');
    if (simManualGPA) {
        console.log('Simulation page found, initializing...');
        loadSimulationPage(); // เรียก function นี้
    }
});