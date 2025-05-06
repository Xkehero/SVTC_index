function checkNetwork() {
    if (navigator.onLine) {
        console.log("Browser thinks it's online");
    } else {
        console.log("Browser thinks it's offline");
        alert("当前网络不可用，正在重定向到404页面...");
        window.location.href = "/404.html";
    }
}

function redirectTo404() {
    "/404.html" !== window.location.pathname && (window.location.href = "/404.html");
}

const ipToClassroomMapping = {
    "172.21.11.15": "1101",
    "172.21.11.35": "1103",
    "172.21.11.55": "1105",
    "172.21.11.115": "1111",
    "172.21.11.125": "1112",
    "172.21.11.135": "1113",
    "172.21.11.145": "1114",
    "172.21.11.155": "1115",
    "172.21.11.165": "1116",
    "172.21.12.15": "1201",
    "172.21.12.25": "1202",
    "172.21.12.35": "1203",
    "172.21.12.45": "1204",
    "172.21.12.55": "1205",
    "172.21.12.65": "1206",
    "172.21.12.85": "1208",
    "172.21.12.105": "1210",
    "172.21.12.125": "1212",
    "172.21.12.145": "1214",
    "172.21.12.155": "1215",
    "172.21.12.165": "1216",
    "172.21.12.175": "1217",
    "172.21.12.185": "1218",
    "172.21.12.195": "1219",
    "172.21.12.205": "1220",
    "172.21.12.215": "1221",
    "172.21.13.15": "1301",
    "172.21.13.16": "1302",
    "172.21.13.35": "1303",
    "172.21.13.45": "1304",
    "172.21.13.55": "1305",
    "172.21.13.65": "1306",
    "172.21.13.85": "1308",
    "172.21.13.105": "1310",
    "172.21.13.125": "1312",
    "172.21.13.145": "1314",
    "172.21.13.165": "1316",
    "172.21.13.185": "1318",
    "172.21.13.195": "1319",
    "172.21.13.205": "1320",
    "172.21.13.215": "1321",
    "172.21.13.225": "1322",
    "172.21.13.235": "1323",
    "172.21.14.15": "1401",
    "172.21.14.25": "1402",
    "172.21.14.35": "1403",
    "172.21.14.45": "1404",
    "172.21.14.55": "1405",
    "172.21.14.65": "1406",
    "172.21.14.85": "1408",
    "172.21.14.105": "1410",
    "172.21.14.125": "1412",
    "172.21.14.145": "1414",
    "172.21.14.165": "1416",
    "172.21.14.185": "1418",
    "172.21.14.195": "1419",
    "172.21.14.205": "1420",
    "172.21.14.215": "1421",
    "172.21.14.225": "1422",
    "172.21.14.235": "1423",
    "172.21.15.15": "1501",
    "172.21.15.25": "1502",
    "172.21.15.35": "1503",
    "172.21.15.45": "1504",
    "172.21.15.55": "1505",
    "172.21.15.65": "1506",
    "172.21.15.85": "1508",
    "172.21.15.105": "1510",
    "172.21.15.125": "1512",
    "172.21.15.145": "1514",
    "172.21.15.165": "1516",
    "172.21.15.185": "1518",
    "172.21.15.195": "1519",
    "172.21.15.205": "1520",
    "172.21.15.215": "1521",
    "172.21.15.225": "1522",
    "172.21.15.235": "1523",
    "172.21.21.15": "2101",
    "172.21.21.25": "2102",
    "172.21.21.35": "2103",
    "172.21.22.15": "2201",
    "172.21.22.25": "2202",
    "172.21.22.35": "2203",
    "172.21.31.15": "3101",
    "172.21.31.25": "3102",
    "172.21.31.35": "3103",
    "172.21.32.25": "3202",
    "172.21.32.35": "3203",
    "172.21.73.55": "7305",
    "172.21.73.65": "7306",
    "172.21.73.75": "7307",
    "172.21.73.85": "7308",
    "172.21.73.95": "7309",
    "172.21.73.105": "7310",
    "172.21.53.15": "5301",
    "172.21.53.65": "5306",
    "172.21.53.25": "5302",
    "172.21.53.75": "5307",
    "172.21.53.35": "5303",
    "172.21.53.85": "5308",
    "172.21.53.45": "5304",
    "172.21.53.95": "5309",
    "172.21.53.105": "5310",
    "172.21.54.65": "5406",
    "172.21.54.15": "5401",
    "172.21.54.75": "5407",
    "172.21.54.25": "5402",
    "172.21.54.85": "5408",
    "172.21.54.35": "5403",
    "172.21.54.95": "5409",
    "172.21.45.25": "4502",
    "172.21.45.45": "4504",
    "172.21.45.55": "4505",
    "172.21.45.65": "4506",
    "172.21.45.75": "4507",
    "172.21.45.85": "4508",
    "172.21.45.115": "4511",
    "172.21.81.15": "8101",
    "172.21.16.25": "8102",
    "172.21.82.15": "8201",
    "172.21.82.25": "8202",
    "172.21.83.15": "8301",
    "172.21.83.25": "8302",

};

function getLocalIP(callback) {
    const rtc = new RTCPeerConnection({
        iceServers: []
    });
    rtc.createDataChannel(""); // 创建数据通道

    rtc.onicecandidate = function (event) {
        if (event.candidate) {
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(/(?:\d{1,3}\.){3}\d{1,3}/);
            if (ipMatch) {
                callback(ipMatch[0]);
                rtc.close();
            }
        }
    };

    rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
}

function handleIP(ip) {
    console.log("获取到的 IP 地址: " + ip);

    var classroomId = ipToClassroomMapping[ip];

    let locationMessage = "";

    if (!classroomId) {
        if (ip.startsWith("10.135.")) {
            locationMessage = "您当前在数据中心。";
        } else if (ip.startsWith("10.40.")) {
            locationMessage = "您当前使用的是内网WIFI。";
        } else if (ip.startsWith("10.43.")) {
            locationMessage = "您当前处于电子信息工程学院。";
        } else {
            locationMessage = "您似乎处于校外！";
        }
    } else {
        locationMessage = "您当前所在的教室是: " + classroomId;
    }

    document.getElementById("classroom").innerHTML = locationMessage;
}

getLocalIP(function (ip) {
    handleIP(ip);
});

document.addEventListener("DOMContentLoaded", function () {
    checkNetwork();

    document.querySelectorAll(".clickable-card").forEach(e => {
        e.addEventListener("click", function () {
            var href = this.getAttribute("data-href");
            href && window.open(href, "_blank");
        });
    });

    var elements = document.querySelectorAll(".reveal-on-scroll");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        });

        elements.forEach(element => observer.observe(element));
    } else {
        console.warn("IntersectionObserver not supported, revealing all elements immediately.");
        elements.forEach(element => element.classList.add("is-visible"));
    }

    var techSupportLink = document.getElementById("tech-support-link");
    if (techSupportLink) {
        techSupportLink.addEventListener("click", function (e) {
            e.preventDefault();
            alert("数据信息中心：029-83618153");
        });
    }

    var baiduSearchForm = document.getElementById("baidu-search-form");
    const baiduSearchInput = document.getElementById("baidu-search-input");

    if (baiduSearchForm && baiduSearchInput) {
        baiduSearchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const query = baiduSearchInput.value.trim();
            if (query) {
                window.location.href = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
            }
        });
    }
});
