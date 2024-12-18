const PARSE = {
    damageTaken: {
        regex: /<b>(\d+)<\/b>.*?<font size=10>from<\/font>.*?<b><color=.*?>(.*?)<\/b><font size=10>.*?(?: - (.*?))? - (Grazes|Glances Off|Hits|Penetrates|Smashes|Wrecks)/g
    },
    damageDone: {
        regex: /<b>(\d+)<\/b> <color=.*>to<\/font> <b><color=.*>(.*?)<\/b><font size=\d+>.*? - (.*?) - (Grazes|Glances Off|Hits|Penetrates|Smashes|Wrecks)/g
    },
    damageOutMiss: {
        regex: /Your (.*?) misses (.*?) completely - (.*?)/g
    },
    damageInMiss: {
        regex: /misses you completely/g
    },
    capOut: {
        regex: /<b>(\d+)<\/b><color=0x77ffffff><font size=10> remote capacitor transmitted to/g
    },
    neutIn: {
        regex: /<color=0xffe57f7f><b>(\d+)\sGJ<\/b><color=0x77ffffff><font size=10> energy neutralized /g
    },
    neutOut: {
        regex: /<color=0xff7fffff><b>(\d+)\sGJ<\/b><color=0x77ffffff><font size=10> energy neutralized /g
    },
    repOut: {
        regex: /<b>(\d+)<\/b><color=0x77ffffff><font size=10> remote (?:armor repaired|shield boosted) to/g
    },
    bounty: {
        regex: /<color=0xff00aa00>([\d,]+) ISK<\/b>/g
    }
};

const HIT_QUALITY_COLORS = {
    "Misses": '#a6a6a6',
    "Grazes": '#ffffff',
    "Glances Off": '#8ae826',
    "Hits": '#08b0ea',
    "Penetrates": '#d908ea',
    "Smashes": '#eda515',
    "Wrecks": '#ff0000'
}

let widget;
let widgetVisibilityTimeoutMs;
let widgetLastVisibilityTime = 0;
let isWidgetVisible = false;

function initWidgetVisibility(timeoutMs) {
    widget = document.getElementById('widget');
    widgetVisibilityTimeoutMs = timeoutMs;
    setInterval(applyWidgetVisibility, 1000);
}

function applyWidgetVisibility() {
    if (Date.now() - widgetVisibilityTimeoutMs > widgetLastVisibilityTime) {
        showWidget(false);
    }
};

function showWidget(show) {
    if (show) {
        widgetLastVisibilityTime = Date.now();
    }
    if (show ^ widget.classList.contains('show')) {
        widget.classList.toggle('show');
    }
    isWidgetVisible = show;
};