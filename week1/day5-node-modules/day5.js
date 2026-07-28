
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.json');
const outputPath = path.join(__dirname, 'output.json');

console.log('--- Starting Data Transformation CLI ---');

try {
    
    console.log(`Reading data from: ${inputPath}`);
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log(`Successfully read ${data.length} records.`);

    console.log('Applying transformations...');
    const transformedData = data.map(record => ({
        ...record,
        score: Math.min(100, Math.round(record.score * 1.1)), 
        passed: record.score >= 80
    }));

   
    console.log(`Writing transformed data to: ${outputPath}`);
    fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 4), 'utf8');
    
    console.log('\n✅ Transformation complete!');
    console.log('Transformed Data Preview:');
    console.log(transformedData);
} catch (error) {
    console.error('\n❌ Error during transformation:', error.message);
    process.exit(1);
}
