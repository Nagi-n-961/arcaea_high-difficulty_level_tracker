const CURRENT_MAX_POTENTIAL = 13.29;
const config = [
    { val: "12.0", songs: [{ name: "Testify", artist: "void (Mournfinale) feat. 星熊南巫", diff: "BYD", notes: 2221 }] },
    { val: "11.9", songs: [{ name: "Designant.", artist: "Designant", diff: "BYD", notes:2184 }] },
    { val: "11.7", songs: [{ name: "Tempestissimo", artist: "t+pazolite", diff: "BYD", notes:1540 }] },
    { val: "11.6", songs: [{ name: "Arcana Eden", artist: "Team Grimoire vs Sakuzyo vs Laur", diff: "BYD", notes:2134 }] },
    { val: "11.5", songs: [{ name: "Aether Crest: Astral", artist: "void (Mournfinale) × 水野健治", diff: "ETR", notes: 1941},{ name: "Pentiment", artist: "Nothing But Requiem with Museo", diff: "BYD", notes:1741 }] },
    { val: "11.4", songs: [{ name: "Lament Rain", artist: "Ashrount vs. 打打だいず", diff: "BYD", notes:1637 }] },
    { val: "11.3", songs: [{ name: "Abstruse Dilemma", artist: "Ashrount vs. 打打だいず", diff: "FTR", notes:1467 }, { name: "Arghena", artist: "Feryquitous vs Laur", diff: "FTR", notes:1444 }, { name: "ALTER EGO", artist: "Yuta Imai vs Qlarabelle", diff: "ETR", notes:1644 }, { name: "多次元宇宙融合論", artist: "TAKIO feat. つぐ", diff: "ETR", notes:1726 }, { name: "Axium Divergence", artist: "ak+q (lowiro)", diff: "BYD", notes:1682 }] },
    { val: "11.2", songs: [{ name: "Aegleseeker", artist: "Silentroom vs Frums", diff: "FTR", notes:1568 }, { name: "PRAGMATISM -RESURRECTION-", artist: "Laur", diff: "BYD", notes:1502 }, { name: "Vicious [ANTi] Heroism", artist: "Kobaryo", diff: "BYD", notes:1772 }] },
    { val: "11.1", songs: [{ name: "#1f1e33", artist: "かめりあ (EDP)", diff: "FTR", notes:1576 }, { name: "Fracture Ray", artist: "Sakuzyo", diff: "FTR", notes:1729 }, { name: "Grievous Lady", artist: "Team Grimoire vs Laur", diff: "FTR", notes:1450 }, { name: "魔王", artist: "sasakure.UK × TJ.hangneil", diff: "BYD", notes:1661 }] },
    { val: "11.0", songs: [{name: "LAMIA", artist: "BlackY", diff: "FTR", copyright: "©SEGA", notes:1385 }, { name: "最強STRONGER", artist: "REDALiCE vs USAO", "diff": "FTR", notes:1384 }, { name: "Undying Macula", artist: "Ashrount", "diff": "ETR", notes:1461 }] }
];

const tierGroups = [
    { label: "CONST 11.5 - 12.0", values: ["12.0", "11.9", "11.7", "11.6", "11.5"] },
    { label: "CONST 11.3 - 11.4", values: ["11.4", "11.3"] },
    { label: "CONST 11.2", values: ["11.2"] },
    { label: "CONST 11.1", values: ["11.1"] },
    { label: "CONST 11.0", values: ["11.0"] }
];

const savedScores = JSON.parse(localStorage.getItem('arcaeaScores_v3')) || {};

const savedPlayerInfo = JSON.parse(localStorage.getItem('arcaeaPlayerInfo_v2')) || {
    name: "Name", friendCode: "000-000-000", overallPt: "-"
};

document.getElementById('display-date').innerText = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

function initPlayerInfo() {
    document.getElementById('in-player-name').value = savedPlayerInfo.name;
    document.getElementById('in-friend-code').value = savedPlayerInfo.friendCode;
    document.getElementById('in-overall-pt').value = savedPlayerInfo.overallPt;
    updatePlayerInfoDisplay();
}

function updatePlayerInfo() {
    savedPlayerInfo.name = document.getElementById('in-player-name').value || "Name";
    savedPlayerInfo.friendCode = document.getElementById('in-friend-code').value || "000-000-000";
    
    let ptInput = document.getElementById('in-overall-pt').value;
    let parsedPt = parseFloat(ptInput);
    savedPlayerInfo.overallPt = !isNaN(parsedPt) ? parsedPt.toFixed(2) : (ptInput || "-");

    localStorage.setItem('arcaeaPlayerInfo_v2', JSON.stringify(savedPlayerInfo));
    updatePlayerInfoDisplay();
}

function updatePlayerInfoDisplay() {
    document.getElementById('display-player-name').innerText = savedPlayerInfo.name;
    document.getElementById('display-friend-code').innerText = `ID: ${savedPlayerInfo.friendCode}`;
    
    const valElement = document.getElementById('display-overall-pt');
    valElement.innerText = savedPlayerInfo.overallPt;

    const parsedPt = parseFloat(savedPlayerInfo.overallPt);
    if (!isNaN(parsedPt) && parsedPt >= CURRENT_MAX_POTENTIAL) {
        valElement.classList.add('pt-max-glow');
    } else {
        valElement.classList.remove('pt-max-glow');
    }
    
    document.getElementById('display-overall-stars').innerText = !isNaN(parsedPt) ? getStars(parsedPt) : "";
}

function getGrade(score) {
    if (score === 0) return "-";
    if (score >= 10000000) return "PM";
    if (score >= 9900000) return "EX+";
    if (score >= 9800000) return "EX";
    if (score >= 9500000) return "AA";
    if (score >= 9200000) return "A";
    if (score >= 8900000) return "B";
    if (score >= 8600000) return "C";
    return "D";
}

function calcPT(constant, score) {
    let p = 0;
    if (score >= 10000000) p = constant + 2.0;
    else if (score >= 9800000) p = constant + 1.0 + (score - 9800000) / 200000;
    else p = constant + (score - 9500000) / 300000;
    return Math.max(0, p);
}

function getStars(pt) {
    if (pt >= 13.0) return "☆☆☆";
    if (pt >= 12.5) return "☆☆";
    if (pt >= 12.0) return "☆";
    return "";
}

function initEditor() {
    const editorRoot = document.getElementById('editor-root');
    editorRoot.innerHTML = "";

    tierGroups.forEach(group => {
        const accordion = document.createElement('details');
        accordion.className = 'tier-accordion';
        if(group.label.includes("11.5")) accordion.open = true;

        accordion.innerHTML = `<summary class="tier-summary">${group.label} <span>▼</span></summary>`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'editor-grid';

        config.filter(c => group.values.includes(c.val)).forEach(c => {
            c.songs.forEach(s => {
                const score = savedScores[s.name] || 0;
                const maxScore = 10000000 + (s.notes || 0);
                const safeName = s.name.replace(/[:\/\\#?%*|"<>]/g, '_');

                const editCard = document.createElement('div');
                editCard.className = 'editor-input-card';
                editCard.style.borderTop = `4px solid var(--${s.diff.toLowerCase()}-color)`;
                
                editCard.innerHTML = `
                    <div class="editor-card-header">
                        <img src="images/${safeName}.png" class="editor-jacket-mini" onerror="this.src='https://via.placeholder.com/50?text=No+Img'">
                        <div class="song-info-edit">
                            <span class="song-name-edit" title="${s.name}">${s.name}</span>
                            <span class="song-artist-edit" title="${s.artist || ''}">${s.artist || "Unknown Artist"}</span>
                            <span class="song-diff-edit">${s.diff} / CONST ${c.val}</span>
                        </div>
                    </div>
                    <div class="editor-card-input">
                        <input type="number" 
                            value="${score === 0 ? '' : score}" 
                            placeholder="0"
                            class="${score > maxScore ? 'input-error' : ''}" 
                            oninput="updateScore('${s.name}', this.value, ${maxScore}, this)">
                    </div>
                `;
                contentDiv.appendChild(editCard);
            });
        });
        accordion.appendChild(contentDiv);
        editorRoot.appendChild(accordion);
    });
}

function render() {
    const displayRoot = document.getElementById('display-root');
    displayRoot.innerHTML = "";

    let allSongsList = [];
    config.forEach(c => {
        c.songs.forEach(s => {
            const score = savedScores[s.name] || 0;
            allSongsList.push({ name: s.name, pt: calcPT(parseFloat(c.val), score) });
        });
    });
    allSongsList.sort((a, b) => b.pt - a.pt);
    let rankMap = {};
    allSongsList.forEach((song, index) => { rankMap[song.name] = index + 1; });

    let globalIndex = 1;

    tierGroups.forEach(group => {
        const label = document.createElement('div');
        label.className = 'tier-label';
        label.innerText = group.label;
        displayRoot.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'b30-grid';
        displayRoot.appendChild(grid);
        
        config.filter(c => group.values.includes(c.val)).forEach(c => {
            c.songs.forEach(s => {
                const score = savedScores[s.name] || 0;
                const pt = calcPT(parseFloat(c.val), score);
                const grade = getGrade(score);
                const songRank = rankMap[s.name];
                const safeName = s.name.replace(/[:\/\\#?%*|"<>]/g, '_');
                
                const wrapper = document.createElement('div');
                wrapper.className = "preview-card-wrapper"; // インラインスタイルを排除

                const maxScore = 10000000 + s.notes;
                const isTheoretical = (score === maxScore);

                let gradeClass = "grade-badge";
                if (grade === "PM") {
                    gradeClass += isTheoretical ? " grade-theoretical" : " grade-pm";
                }

                let ptClass = "card-pt";
                if (songRank === 1 && score > 0) ptClass += " pt-rank-1";
                else if (songRank === 2 && score > 0) ptClass += " pt-rank-2";
                else if (songRank === 3 && score > 0) ptClass += " pt-rank-3";

                wrapper.innerHTML = `
                    <div class="score-card diff-${s.diff.toLowerCase()}">
                        <div class="rank-badge">#${globalIndex++}</div>
                        <div class="level-badge" style="background:var(--${s.diff.toLowerCase()}-color)">${parseFloat(c.val).toFixed(1)}</div>
                        <div class="stars">${score > 0 ? getStars(pt) : ""}</div>
                        <div class="${gradeClass}">${grade}</div>
                        <img src="images/${safeName}.png" class="jacket" onerror="this.src='https://via.placeholder.com/180?text=No+Img'">
                        <div class="card-info">
                            <div class="card-title">${s.name}</div>
                            <div class="${ptClass}">${pt.toFixed(2)}</div>
                            <div class="card-score">Score: ${score > 0 ? score.toLocaleString() : '-'}</div>
                        </div>
                    </div>
                    <div class="card-copyright">${s.copyright || ""}</div>
                `;
                grid.appendChild(wrapper);
            });
        });
    });
}

function updateScore(name, val, maxScore, inputElem) {
    const inputVal = parseInt(val) || 0;
    if (inputVal > maxScore) {
        inputElem.classList.add('input-error');
    } else {
        inputElem.classList.remove('input-error');
    }
    savedScores[name] = inputVal;
    localStorage.setItem('arcaeaScores_v3', JSON.stringify(savedScores));
    render(); 
}

function exportImage() {
    let hasError = false;
    let errorSongNames = [];
    config.forEach(c => {
        c.songs.forEach(s => {
            const score = savedScores[s.name] || 0;
            const maxScore = 10000000 + (s.notes || 0); 
            
            if (score > maxScore) {
                hasError = true;
                errorSongNames.push(s.name); 
            }
        });
    });

    if (hasError) {
        alert(`以下の楽曲のスコアが理論値（10,000,000 + ノーツ数）を超えています。修正してください。\n\n${errorSongNames.join('\n')}`);
        return; 
    }
    render(); 

    const target = document.getElementById('capture-target');
    const btn = document.querySelector('.view-section.active .save-btn');
    const originalText = btn.innerText;

    btn.innerText = "生成中...";
    btn.disabled = true;

    setTimeout(() => {
        html2canvas(target, { 
            backgroundColor: '#0a0a0f', 
            useCORS: true,
            scale: 2, 
            width: target.scrollWidth,
            height: target.scrollHeight,
            windowWidth: 1400,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0
        }).then(canvas => {
            canvas.toBlob((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const imgElement = document.getElementById('generated-image');
                imgElement.src = blobUrl;
                
                const downloadBtn = document.getElementById('download-link-btn');
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `Arcaea_Result_${new Date().toISOString().slice(0,10)}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };

                document.getElementById('image-modal').style.display = 'flex';
                btn.innerText = originalText;
                btn.disabled = false;
            }, 'image/png');
        });
    }, 150);
}

function closeModal() {
    document.getElementById('image-modal').style.display = 'none';
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(tabName)) btn.classList.add('active');
    });
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
    });
    if (tabName === 'editor') {
        document.getElementById('view-editor').classList.add('active');
    } else {
        document.getElementById('view-preview').classList.add('active');
    }
}

// 初期化処理
initPlayerInfo();
initEditor();
render();