"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, TypeScript API!');
});
app.get('/api', (req, res) => {
    res.send('This is api general');
});
app.get('/api/v1', (req, res) => {
    res.send('This is apiv1');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
