// 1. Get names of active users
function getActiveUserNames(users) {
    return users.filter(user => user.active).map(user => user.name);
}

// 2. Total price of available products
function getTotalPriceOfAvailableProducts(products) {
    return products
        .filter(product => product.stock > 0)
        .reduce((total, product) => total + product.price, 0);
}

// 3. Average age of adults
function getAverageAgeOfAdults(people) {
    const adults = people.filter(person => person.age >= 18);
    return adults.length === 0 ? 0 : adults.reduce((sum, person) => sum + person.age, 0) / adults.length;
}

// 4. Acronym generator
function generateAcronym(phrase) {
    return phrase
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase())
        .reduce((acronym, letter) => acronym + letter, "");
}

// 5. Count occurrences of items in an array
function countOccurrences(items) {
    return items.reduce((acc, item) => {
        return { ...acc, [item]: (acc[item] || 0) + 1 };
    }, {});
}

// 6. Get names of top scorers (score > 80)
function getTopScorerNames(students) {
    return students
        .filter(student => student.score > 80)
        .map(student => student.name);
}

// 7. Flatten array of arrays and double the numbers
function flattenAndDouble(nestedArrays) {
    return nestedArrays
        .reduce((flat, current) => [...flat, ...current], [])
        .map(num => num * 2);
}

// 8. Extract unique tags from blog posts
function getUniqueTags(posts) {
    return posts
        .reduce((allTags, post) => [...allTags, ...post.tags], [])
        .reduce((unique, tag) => {
            return unique.includes(tag) ? unique : [...unique, tag];
        }, []);
}

// 9. Total population of cities in a specific country
function getTotalPopulation(cities, targetCountry) {
    return cities
        .filter(city => city.country === targetCountry)
        .reduce((total, city) => total + city.population, 0);
}

// 10. Calculate total cost with 20% tax for items over $100
function getTotalCostOfExpensiveItems(items) {
    return items
        .filter(item => item.price > 100)
        .map(item => item.price * 1.20)
        .reduce((total, price) => total + price, 0);
}

// --- Test Cases ---

console.log("--- Problem 1: Active User Names ---");
const users = [{ name: 'Alice', active: true }, { name: 'Bob', active: false }, { name: 'Charlie', active: true }];
console.log("Input:", users);
console.log("Output:", getActiveUserNames(users)); 

console.log("\n--- Problem 2: Total Price of Available Products ---");
const products = [{ price: 10, stock: 5 }, { price: 20, stock: 0 }, { price: 30, stock: 2 }];
console.log("Input:", products);
console.log("Output:", getTotalPriceOfAvailableProducts(products)); 

console.log("\n--- Problem 3: Average Age of Adults ---");
const people = [{ age: 15 }, { age: 20 }, { age: 30 }];
console.log("Input:", people);
console.log("Output:", getAverageAgeOfAdults(people)); 

console.log("\n--- Problem 4: Acronym Generator ---");
console.log("Input:", "object oriented programming");
console.log("Output:", generateAcronym("object oriented programming"));

console.log("\n--- Problem 5: Count Occurrences ---");
const fruitArray = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
console.log("Input:", fruitArray);
console.log("Output:", countOccurrences(fruitArray)); 


console.log("\n--- Problem 6: Top Scorers ---");
const students = [{ name: 'John', score: 75 }, { name: 'Jane', score: 90 }, { name: 'Doe', score: 85 }];
console.log("Input:", students);
console.log("Output:", getTopScorerNames(students)); 

console.log("\n--- Problem 7: Flatten and Double ---");
const nested = [[1, 2], [3, 4], [5]];
console.log("Input:", nested);
console.log("Output:", flattenAndDouble(nested)); 

console.log("\n--- Problem 8: Unique Tags ---");
const posts = [
    { title: 'Post 1', tags: ['javascript', 'web'] },
    { title: 'Post 2', tags: ['javascript', 'tutorial', 'web'] }
];
console.log("Input:", posts);
console.log("Output:", getUniqueTags(posts));

console.log("\n--- Problem 9: Total Population ---");
const cities = [
    { name: 'NY', country: 'USA', population: 8000000 },
    { name: 'London', country: 'UK', population: 9000000 },
    { name: 'LA', country: 'USA', population: 4000000 }
];
console.log("Input:", cities, "Target Country: USA");
console.log("Output:", getTotalPopulation(cities, 'USA')); 

console.log("\n--- Problem 10: Total Cost with Tax for Expensive Items ---");
const costItems = [{ name: 'Pen', price: 10 }, { name: 'Laptop', price: 1000 }, { name: 'Phone', price: 500 }];
console.log("Input:", costItems);
console.log("Output:", getTotalCostOfExpensiveItems(costItems));
