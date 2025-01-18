
let isAssetsAvailable = false;

const assetsURL = {
    "studentID_normal_UpLayer": "./assets/studentID_Normal_UpLayer.png",
    "studentID_normal_DownLayer": "./assets/studentID_Normal_DownLayer.png",
    "studentID_abnormal_UpLayer": "./assets/studentID_Abnormal_UpLayer.png",
    "studentID_abnormal_DownLayer": "./assets/studentID_Abnormal_DownLayer.png",
    "studentID_mask": "./assets/studentID_Mask.png",
}

const assets = {};

const renderData = {
    face: {
        img: null,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
    },
    text: {
        S_N_No: {
            value: "ID",
            x: 1085,
            y: 610,
            fontFamily: "'ＭＳ ゴシック',sans-serif",
            fontSize: "1.65rem",
            color: "#000000"
        },
        course: {
            value: "学科",
            x: 1085,
            y: 650,
            fontFamily: "'ＭＳ ゴシック',sans-serif",
            fontSize: "1.65rem",
            color: "#000000"
        },
        namefuri: {
            value: "なまえ",
            x: 1085,
            y: 690,
            fontFamily: "'ＭＳ ゴシック',sans-serif",
            fontSize: "1.65rem",
            color: "#000000"
        },
        name: {
            value: "名前名前名前名前",
            x: 1085,
            y: 738,
            fontFamily: "'ＭＳ ゴシック',sans-serif",
            fontSize: "2.6rem",
            color: "#000000"
        },
        birthday: {
            value: "生年月日",
            x: 1085,
            y: 777.5,
            fontFamily: "'ＭＳ ゴシック',sans-serif",
            fontSize: "1.65rem",
            color: "#000000"
        },
        expire: {
            value: "有効期限",
            x: 1085,
            y: 820,
            fontFamily: "'ＭＳ ゴシック',sans-serif",
            fontSize: "1.65rem",
            color: "#000000"
        }
    },
    qr: { // ベース右上
        img: null,
        x: 1487,
        y: 574,
        size: 95
    },
    pointer: {
        x: 0,
        y: 0
    },
    upLayer: null,
    downLayer: null,
    debugData: {},
    debugMode: false,
    outputURL: ""
};

window.renderData = renderData;

let url = new URL(window.location.href);
let params = url.searchParams;
if (params.get('debug') != null) {
    renderData.debugMode = true;
}   

const loadAssets = () => {
    for (let key in assetsURL) {
        assets[key] = new Image();
        assets[key].src = assetsURL[key];
    }
    isAssetsAvailable = true;
    console.log("Loaded Assets.");
}

loadAssets();

const canvas = document.getElementById("view");
canvas.width = 2048;
canvas.height = 2048;
const context = canvas.getContext("2d");

const maskP1 = { x: 648, y: 540 };
const maskP2 = { x: 1011, y: 913 };

const update = () => {

    try {
        const idType = document.getElementById("idType").value;
        renderData.upLayer = assets["studentID_" + idType + "_UpLayer"];
        renderData.downLayer = assets["studentID_" + idType + "_DownLayer"];

        context.clearRect(0, 0, canvas.width, canvas.height);
        // 背景色描画
        context.fillStyle = colorChange("#000000", 0);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(renderData.downLayer, 0, 0, canvas.width, canvas.height);
        if (renderData.face.img != null) {
            context.save();
            // クリッピングマスクを使って描画
            // 顔の描画
            context.globalCompositeOperation = 'source-over';
            context.drawImage(
                renderData.face.img,
                renderData.face.x,
                renderData.face.y,
                renderData.face.img.width * renderData.face.scaleX,
                renderData.face.img.height * renderData.face.scaleY
            );
            // マスクの描画
            context.fillStyle = colorChange("#FFFFFF", 1);
            context.globalCompositeOperation = "destination-in";

            context.fillRect(maskP1.x, maskP1.y, maskP2.x - maskP1.x, maskP2.y - maskP1.y);
            context.restore();
        }
        context.drawImage(renderData.upLayer, 0, 0, canvas.width, canvas.height);

        // テキストの描画
        for(let key in renderData.text) {
            const text = renderData.text[key];
            context.fillStyle = colorChange(text.color, text.alpha ? text.alpha : 1);
            context.font = text.fontSize + " " + text.fontFamily;
            context.fillText(text.value, text.x, text.y);
        }

        // QRコードの描画
        const qr = renderData.qr;
        if (qr.img != null) {
            context.drawImage(qr.img, qr.x - qr.size, qr.y, qr.size, qr.size);
        } else {
            context.fillStyle = colorChange("#888888", 1);
            // context.fillRect(qr.x - qr.size, qr.y, qr.size, qr.size);
        }

        // デバッグ情報の描画
        if (renderData.debugMode) {
            context.fillStyle = colorChange("#FFFFFF", 1);
            context.font = "2rem sans-serif";
            let debugText = "";
            let i = 1;
            for (let key in renderData.debugData) {
                context.fillText(key + ": " + renderData.debugData[key], 10, 40 * i);
                i++;
            }
            // ルーペの描画
            // マウスの座標を取得
            const x = renderData.pointer.x;
            const y = renderData.pointer.y;
            const sizeX = 500, sizeY = 400;
            // 位置決定 (右上)
            const baseX = canvas.width - sizeX - 40;
            const baseY = 20;
            // ルーペの描画
            // 枠線(背景)の描画
            context.fillStyle = colorChange("#aaaaaa", 1);
            context.fillRect(baseX, baseY, sizeX + 20, sizeY + 20);
            // ルーペの描画
            const scale = 4;
            context.drawImage(
                canvas,
                x - sizeX / (scale * 2), y - sizeY / (scale * 2), // 画像の切り取り位置
                sizeX / scale, sizeY / scale, // 切り取るサイズ
                baseX + 10, baseY + 10, // 描画位置
                sizeX, sizeY // 描画サイズ
            );
        }
    } catch (e) {
        console.log(e);
    }
    requestAnimationFrame(update);
}
requestAnimationFrame(update);

const registerEvent = () => {
    let mousedown = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    canvas.addEventListener("mousedown", (e) => {
        mousedown = true;
        const rect = e.target.getBoundingClientRect();
        const XRate = canvas.width / rect.width;
        const YRate = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * XRate;
        const y = (e.clientY - rect.top) * YRate;
        renderData.debugData.lastClickPoint = x + ", " + y;
        lastX = x;
        lastY = y;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!mousedown) return;
        const rect = e.target.getBoundingClientRect();
        const XRate = canvas.width / rect.width;
        const YRate = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * XRate;
        const y = (e.clientY - rect.top) * YRate;
        renderData.pointer.x = x;
        renderData.pointer.y = y;
        renderData.debugData.lastClickPoint = x + ", " + y;

        // faceの座標を更新
        // 最後の座標からの差分を取得
        const dx = x - lastX;
        const dy = y - lastY;
        // 移動量を加算
        renderData.face.x += dx;
        renderData.face.y += dy;
        lastX = x;
        lastY = y;
    });

    window.addEventListener("mouseup", (e) => {
        const rect = e.target.getBoundingClientRect();
        const XRate = canvas.width / rect.width;
        const YRate = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * XRate;
        const y = (e.clientY - rect.top) * YRate;
        // delete renderData.debugData.lastClickPoint;
        mousedown = false;
    });

    canvas.addEventListener("wheel", (e) => {
        // つかんでいる時はページスクロールを抑止
        if (!mousedown) return;
        e.preventDefault();

        // つかみ状態はスケールの変更
        // 画像の中央から大きくなるように座標も調整
        const maxScale = 220, minScale = 0.0001;
        const delta = e.deltaY;
        let scale = 1.05;
        if (isShift) scale = 1.1;
        // スケールがどうなるか計算し、最大値、最小値を超える場合はなかったことにする
        if (delta > 0 && renderData.face.scaleX * scale > maxScale) return;
        if (delta < 0 && renderData.face.scaleX / scale < minScale) return;
        // 拡大縮小の結果、どれぐらい差分がでるか計算
        const dx = (renderData.face.img.width * renderData.face.scaleX) * (scale - 1) / 2;
        const dy = (renderData.face.img.height * renderData.face.scaleY) * (scale - 1) / 2;
        if (delta > 0) {
            renderData.face.scaleX *= scale;
            renderData.face.scaleY *= scale;
            renderData.face.x -= dx;
            renderData.face.y -= dy;
        } else {
            renderData.face.scaleX /= scale;
            renderData.face.scaleY /= scale;
            renderData.face.x += dx;
            renderData.face.y += dy;
        }
        
    })

    window.addEventListener('dragover', function(ev){
        ev.preventDefault();
    }, false);

    window.addEventListener("drop", (e) => {
        // ドラッグ&ドロップで画像を読み込む
        e.preventDefault();
        e.stopPropagation();
        document.getElementById("inputFaceImg").files = e.dataTransfer.files;
        faceImgLoad();
    });

    let isShift = false;
    document.addEventListener('keydown', event => {
        isShift = event.shiftKey;
        renderData.debugData.isShift = isShift;
    });
    document.addEventListener('keyup', event => {
        isShift = event.shiftKey;
        renderData.debugData.isShift = isShift;
    });
}
registerEvent();


const faceImgLoad = () => {
    const file = document.getElementById("inputFaceImg").files[0];

    if (file == null || file.type.indexOf("image/") === -1) {
        update(null);
        return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
        renderData.face.img = image;
        renderData.face.x = 670;
        renderData.face.y = 576;
        // (670, 576) から (916, 884)に収まるサイズにリサイズしたい
        // アスペクト比そのままでリサイズ
        const aspect = 916 / 884;
        const width = 916 - 670;
        const height = 884 - 576;
        const aspect2 = image.width / image.height;
        if (aspect2 > aspect) {
            renderData.face.scaleX = width / image.width;
            renderData.face.scaleY = width / image.width;
        } else {
            renderData.face.scaleX = height / image.height;
            renderData.face.scaleY = height / image.height;
        }
        // 真ん中に移動したくない？
        renderData.face.x += (width - image.width * renderData.face.scaleX) / 2;
        renderData.face.y += (height - image.height * renderData.face.scaleY) / 2;
    }
    image.src = url;
}

const QRGen = () => {
    const value = document.getElementById("code").value;
    if (value == "") {
        renderData.qr.img = null;
        return;
    }
    const qr = new QRious({
        value: value,
    });
    qr.background = "rgba(0, 0, 0, 0)";
    qr.backgroundAlpha = 0;

    renderData.qr.img = qr.canvas;
}

const colorChange = (color, alpha) => {
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

const downloadImage = (imageUrl, n = "") => {
    let name = document.querySelector("#filename").value.replace(/\.png/g, '');
    let link = document.createElement("a");
    link.href = imageUrl;
    link.download = name + n + ".png";
    link.click();
}

document.getElementById("code").addEventListener("input", (e) => {
    QRGen();
});

document.getElementById("inputFaceImg").addEventListener("input", (e) => {
    gen();
});

const textField = [
    "S_N_No",
    "course",
    "namefuri",
    "name",
    "birthday",
    "expire"
]

textField.forEach((key) => {
    document.getElementById(key).addEventListener("input", (e) => {
        renderData.text[key].value = e.target.value;
    });
});

const delFile = (elm) => {
    elm.parentElement.querySelector("input").value = "";
    gen();
}

const download = () => {
    const before = renderData.debugMode;
    renderData.debugMode = false;
    update();
    const url = canvas.toDataURL("image/png");
    downloadImage(url);
    renderData.debugMode = before;
}