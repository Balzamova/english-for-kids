"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sort(array) {
    array.sort((a, b) => {
        const c = +a.id;
        const d = +b.id;
        return c - d;
    });
    return array;
}
exports.default = sort;
//# sourceMappingURL=sort.js.map