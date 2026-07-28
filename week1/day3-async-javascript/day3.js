const API_URL_USERS = 'https://jsonplaceholder.typicode.com/users/1';
const API_URL_POSTS = 'https://jsonplaceholder.typicode.com/posts/1';
const API_URL_BAD = 'https://jsonplaceholder.typicode.com/invalid-endpoint';


let state = {
    loading: false,
    data: null,
    error: null
};


function logState(message) {
    console.log(`[${message}] Loading: ${state.loading}`);
}


async function fetchDashboardData() {
    state.loading = true;
    state.error = null;
    logState('Started Fetching Data');

    try {
        const [userResponse, postResponse] = await Promise.all([
            fetch(API_URL_USERS),
            fetch(API_URL_POSTS)
        ]);

        if (!userResponse.ok) throw new Error(`User API Error: ${userResponse.status}`);
        if (!postResponse.ok) throw new Error(`Post API Error: ${postResponse.status}`);

        const userData = await userResponse.json();
        const postData = await postResponse.json();

        state.data = {
            user: userData,
            post: postData
        };
        
        console.log('\n--- Successfully Fetched Data ---');
        console.log(`User: ${state.data.user.name}`);
        console.log(`Post Title: ${state.data.post.title}\n`);

    } catch (error) {
      
        state.error = error.message;
        console.error(`\n--- Failed to Fetch Data ---`);
        console.error(`Error: ${state.error}\n`);
    } finally {
        
        state.loading = false;
        logState('Finished Fetching Data');
    }
}


async function fetchWithErrorHandling() {
    state.loading = true;
    state.error = null;
    logState('Started Fetching Bad Data');

    try {
        const response = await fetch(API_URL_BAD);
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        state.data = data;
    } catch (error) {
        state.error = error.message;
        console.error(`\n--- Caught Expected Error ---`);
        console.error(`Error details: ${state.error}\n`);
    } finally {
        state.loading = false;
        logState('Finished Fetching Bad Data');
    }
}

async function runDemo() {
    console.log("=== DEMO 1: Successful Concurrent Requests ===");
    await fetchDashboardData();

    console.log("\n=== DEMO 2: Error Handling ===");
    await fetchWithErrorHandling();
}

runDemo();
