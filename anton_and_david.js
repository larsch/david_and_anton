const ca = document.getElementById("canvas");
const ct = ca.getContext("2d");
let w, h;

let diff = -10;

function resize() {
    w = ca.width = window.innerWidth;
    h = ca.height = window.innerHeight;
    window.requestAnimationFrame(draw);
}

function text(ct, text, x, y) {
    ct.save();
    let scale = 0.25;
    ct.scale(scale, -scale);
    ct.fillText(text, (x + 3) / scale, -y / scale);
    ct.restore();
}

function divisions(ct, x, y1, y2, divs) {
    let step = (y2 - y1) / divs;
    ct.save();
    ct.setLineDash([]);

    ct.beginPath();
    ct.moveTo(x, y2);
    ct.lineTo(x, y1);
    ct.strokeStyle = "green";
    ct.stroke();

    ct.strokeStyle = "black";
    ct.beginPath();
    for (let i = 0; i < divs + 1; i++) {
        ct.moveTo(x - 1, y1 + i * step);
        ct.lineTo(x + 1, y1 + i * step);
    }
    ct.stroke();
    ct.restore();
}

function draw() {
    ct.clearRect(0, 0, ca.width, ca.height);
    let minX = -65 / 2 - 20;
    let maxX = 40;
    let minY = -15.0;
    let maxY = 65 + 15.0;

    ct.save();
    ct.setLineDash([]);
    ct.font = "12pt sans-serif";
    ct.textBaseline = "middle";

    ct.translate(ca.width / 2, ca.height / 2);
    let hscale = ca.height / 120;
    let wscale = ca.width / 100;
    let scale = Math.min(hscale, wscale);
    ct.scale(scale, -scale);
    ct.translate(0, -30);

    // Coordinate system
    ct.beginPath();
    ct.moveTo(minX, 0);
    ct.lineTo(maxX, 0);
    ct.moveTo(0, minY);
    ct.lineTo(0, maxY);
    ct.lineWidth = 0.5;
    ct.strokeStyle = "gray";
    ct.stroke();

    // 65 years
    ct.beginPath();
    ct.lineWidth = 0.25;
    ct.strokeStyle = "brown";
    ct.moveTo(-65.0 / 2 + minY / 2, minY);
    ct.lineTo((maxY - 65) / 2, maxY);
    ct.stroke();
    text(ct, "Combined age", (maxY - 65) / 2, maxY);

    ct.beginPath();
    ct.stroke();

    let antonToday = diff / 2 + 65.0 / 2;
    let antonBorn = -antonToday;
    let davidToday = -diff / 2 + 65.0 / 2;
    let davidBorn = -davidToday;
    let anton2 = davidToday / 3;
    let anton2Day = antonBorn + anton2;
    let david2 = anton2 - diff;
    let anton4 = david2 * 2;
    let time4 = antonBorn + anton4;
    let david1 = anton4 / 3;
    let time1 = davidBorn + david1;
    let anton1 = time1 - antonBorn;

    // Correspondence lines
    ct.beginPath();
    ct.moveTo(0, anton2);
    ct.lineTo(anton2Day, anton2);
    ct.moveTo(anton2Day, david2);
    ct.lineTo(time4, david2);
    ct.moveTo(time4, anton4);
    ct.lineTo(time1, anton4);
    // ct.moveTo(anton2Day, minY);
    // ct.lineTo(anton2Day, maxY);
    ct.strokeStyle = "orange";
    ct.lineWidth = 0.25;
    ct.setLineDash([2, 1]);
    ct.stroke();



    // Anton's life so far
    ct.setLineDash([]);
    ct.beginPath();
    ct.moveTo(antonBorn, 0);
    ct.lineTo(0, antonToday);
    ct.strokeStyle = "red";
    ct.stroke();

    // David's life so far
    ct.beginPath();
    ct.moveTo(davidBorn, 0);
    ct.lineTo(0, davidToday);
    ct.strokeStyle = "blue";
    ct.stroke();

    // Extension of Anton's life
    ct.beginPath();
    ct.moveTo(-65.0 / 2, -65.0 / 2 - antonBorn);
    ct.lineTo(antonBorn, 0);
    ct.moveTo(0, antonToday);
    ct.lineTo(time4, anton4);
    ct.strokeStyle = "red";
    ct.setLineDash([1, 1]);
    ct.stroke();

    // Time 2
    ct.save();
    ct.beginPath();
    ct.lineWidth = 0.2;
    ct.setLineDash([]);
    ct.strokeStyle = 'gray';
    ct.moveTo(minX, davidToday);
    ct.lineTo(maxX, davidToday);
    ct.moveTo(minX, antonToday);
    ct.lineTo(maxX, antonToday);
    ct.moveTo(minX, 65);
    ct.lineTo(maxX, 65);
    ct.stroke();
    ct.restore();

    divisions(ct, -65.0 / 2, -diff / 2, diff / 2, 2);
    divisions(ct, time4, 0, anton4, 2);
    divisions(ct, time1, 0, anton4, 3);
    divisions(ct, time1, 0, david1, 3);
    divisions(ct, 0, 0, davidToday, 3);
    divisions(ct, anton2Day, anton2, david2, 1);

    text(ct, "65 years", maxX, 65);
    text(ct, "Anton: " + antonToday, maxX, antonToday);
    text(ct, "David: " + davidToday, maxX, davidToday);
    text(ct, Math.round(david1 / anton1 * 1e3) / 1e3, time1, anton1);

    ct.restore();
}

function change(delta) {
    diff += delta;
    diff = Math.round(diff * 10.0) / 10.0;
    window.requestAnimationFrame(draw);
}

function wheel(e) {
    change(0.2 * Math.sign(e.deltaY));
}

function keydown(e) {
    if (e.key == "+" || e.key == "ArrowUp" || e.key == "ArrowRight")
        change(-0.2);
    if (e.key == "-" || e.key == "ArrowDown" || e.key == "ArrowLeft")
        change(0.2);
}


window.addEventListener("load", resize);
window.addEventListener("resize", resize)
window.addEventListener("wheel", wheel);
window.addEventListener("keydown", keydown);
