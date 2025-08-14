// Get elements
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Search GitHub users
async function searchGitHubUsers(query) {
    if (!query.trim()) {
        resultsDiv.innerHTML = "<em>Type something to search GitHub users...</em>";
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.items.length === 0) {
            resultsDiv.innerHTML = "<em>No users found.</em>";
            return;
        }

        resultsDiv.innerHTML = data.items
            .map(user => `
                <div class="result-item">
                    <img src="${user.avatar_url}" width="40" height="40" style="border-radius:50%; vertical-align:middle; margin-right:10px;">
                    <a href="${user.html_url}" target="_blank">${user.login}</a>
                </div>
            `)
            .join("");
    } catch (error) {
        resultsDiv.innerHTML = `<span style="color:red;">Error: ${error.message}</span>`;
    }
}

// Create debounced search function
const debouncedSearch = debounce(searchGitHubUsers, 500);

// Listen for typing
searchInput.addEventListener("input", (e) => {
    debouncedSearch(e.target.value);
});
