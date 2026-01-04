export const looksLikeSolidity = (text = "") => {
    if (!text || text.trim().length < 10) return false;

    const strong = [
        /pragma\s+solidity/i,
        /\bcontract\s+\w+/i,
        /\binterface\s+\w+/i,
        /\blibrary\s+\w+/i,
    ];

    if (!strong.some(r => r.test(text))) return false;

    const patterns = [
        /\bfunction\s+\w+/i,
        /\bmapping\s*\(/i,
        /\buint(8|16|32|64|128|256)?\b/i,
        /\baddress\b/i,
        /\bmodifier\s+\w+/i,
        /\bevent\s+\w+/i,
        /\bpayable\b|\bview\b|\bpure\b/i,
        /msg\.sender|msg\.value|block\./i,
        /\brequire\s*\(/i,
    ];

    const matches = patterns.filter(r => r.test(text)).length;
    return text.includes("{") && text.includes("}") && matches >= 2;
};
