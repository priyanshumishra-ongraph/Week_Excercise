function fizzbuzz(n) {
    if (typeof n !== 'number' || !Number.isInteger(n) || n <= 0) {
        throw new Error("Input must be a positive integer.");
    }
    if (n % 15 === 0) return "FizzBuzz";
    if (n % 3 === 0) return "Fizz";
    if (n % 5 === 0) return "Buzz";
    return n;
}

function celsiusToFahrenheit(celsius) {
    if (typeof celsius !== 'number') {
        throw new Error("Input must be a number.");
    }
    if (celsius < -273.15) {
        throw new Error("Temperature cannot be below absolute zero (-273.15°C).");
    }
    return (celsius * 9 / 5) + 32;
}


console.log("--- Testing FizzBuzz ---");
try {
    console.assert(fizzbuzz(3) === "Fizz", "Expected Fizz for 3");
    console.assert(fizzbuzz(5) === "Buzz", "Expected Buzz for 5");
    console.assert(fizzbuzz(15) === "FizzBuzz", "Expected FizzBuzz for 15");
    console.assert(fizzbuzz(7) === 7, "Expected 7 for 7");
    console.log("Valid FizzBuzz inputs passed!");
} catch (e) {
    console.error("Unexpected error:", e.message);
}

try {
    fizzbuzz(-1);
    console.error("Failed to catch expected Error for fizzbuzz(-1)");
} catch (e) {
    console.log("Caught expected Error for fizzbuzz(-1):", e.message);
}


console.log("\n--- Testing Temperature Converter ---");
try {
    console.assert(celsiusToFahrenheit(0) === 32, "Expected 32 for 0°C");
    console.assert(celsiusToFahrenheit(100) === 212, "Expected 212 for 100°C");
    console.assert(celsiusToFahrenheit(-40) === -40, "Expected -40 for -40°C");
    console.log("Valid Temperature Converter inputs passed!");
} catch (e) {
    console.error("Unexpected error:", e.message);
}

try {
    celsiusToFahrenheit(-300);
    console.error("Failed to catch expected Error for celsiusToFahrenheit(-300)");
} catch (e) {
    console.log("Caught expected Error for celsiusToFahrenheit(-300):", e.message);
}
