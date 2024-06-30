function longestCommonPrefix1(words) {
    if (!words[0] || words.length === 1) return words[0] || "";
    let i = 0;
    while (words[0][i] && words.every((w) => w[i] === words[0][i])) i++;
    return words[0].substr(0, i);
}

function longestCommonPrefix2(words) {
    if (!words || words.length === 0) return "";

    let prefix = words[0];

    for (let i = 1; i < words.length; i++) {
        let j = 0;
        while (
            j < prefix.length &&
            j < words[i].length &&
            prefix[j] === words[i][j]
        ) {
            j++;
        }
        prefix = prefix.substring(0, j);
        if (prefix === "") return "";
    }

    return prefix;
}

var longestCommonPrefix3 = function (strs) {
    if (strs.length === 0) {
        return "";
    }
    let ans = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(ans) !== 0) {
            ans = ans.substring(0, ans.length - 1);
            if (ans === "") {
                return "";
            }
        }
    }
    return ans;
};

function autoRun() {
    const test1 = ["flower", "flow", "flight"]; // Output: "fl"
    const test2 = ["dog", "racecar", "car"]; // Output: ""
    const test3 = []; // Output: ""
    const arr3 = ["car", "car", "car"]; // Output: "car"
    const arr4 = ["dog", "doghouse", "doggy"]; // Output: "dog"
    const arr5 = ["a"]; // Output: "a"
    const arr6 = ["abc", "abcde", "abf"]; // Output: "ab"

    const arr1 = ["aaa", "flower", "flow", "flight"]; // Output: "fl" x
    const arr2 = ["dog", "racecar", "car", "car", "car", "car"]; // Output: "car" x
    const arr7 = ["tot", "got", "top"]; // Output: "to" x
    const arr = [test1, test2, test3, arr1, arr2, arr3, arr4, arr5, arr6, arr7];
    // https://leetcode.com/problems/longest-common-prefix/description/
    
    arr.forEach((e) => {
        console.log("1. Output: ", longestCommonPrefix1(e));
        console.log("2. Output: ", longestCommonPrefix2(e));
        console.log("3. Output: ", longestCommonPrefix3(e));
        console.log("**********");
    });
}

autoRun();
