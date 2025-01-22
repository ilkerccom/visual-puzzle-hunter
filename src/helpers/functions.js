export function randomDigit() {
    return Math.floor(Math.random() * Math.floor(2));
}

export function randomBinaryArray(puzzle = 0) {
    let binary = "";
    for (let i = 0; i < 256; ++i) {
        if (puzzle != 0) {
            if (i < 256 - puzzle) {
                binary += "0";
            } else if (i < 256 - puzzle + 1) {
                binary += "1";
            } else {
                binary += randomDigit();
            }
        } else {
            binary += randomDigit();
        }
    }
    var binaryArray = binary.split("").map(function (item) {
        return parseInt(item, 10);
    });

    return binaryArray;
}

export function binaryToHex(s) {
    var i,
        k,
        part,
        accum,
        ret = "";
    for (i = s.length - 1; i >= 3; i -= 4) {
        part = s.substr(i + 1 - 4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== "0" && part[k] !== "1") {
                return { valid: false };
            }
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            ret = String.fromCharCode(accum - 10 + "A".charCodeAt(0)) + ret;
        } else {
            ret = String(accum) + ret;
        }
    }
    if (i >= 0) {
        accum = 0;
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== "0" && s[k] !== "1") {
                return { valid: false };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        ret = String(accum) + ret;
    }
    return { valid: true, result: ret };
}