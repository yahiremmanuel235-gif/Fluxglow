const babel = require('@babel/core');
const fs = require('fs');

const code = fs.readFileSync('../src/components/modules/LearnModule.tsx', 'utf8');

try {
  babel.transformSync(code, {
    filename: 'LearnModule.tsx',
    presets: ['@babel/preset-typescript', ['@babel/preset-react', { runtime: 'automatic' }]],
  });
  console.log("Success");
} catch (e) {
  console.error("Syntax Error:", e.message);
}
