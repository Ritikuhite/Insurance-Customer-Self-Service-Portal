// LocalStorageService class
class LocalStorageService {
  constructor() {
    this.localStorage = window.localStorage;
    this.dataKey = 'claims';
  }

  // save data
  saveData(data) {
    const dataString = JSON.stringify(data);
    this.localStorage.setItem(this.dataKey, dataString);
  }

  // fetch(get) data
  getData() {
    const dataString = this.localStorage.getItem(this.dataKey);
    return dataString ? JSON.parse(dataString) : [];
  }
}

// create LocalStorage instance
const localStorageService = new LocalStorageService();

// Loading localStorage data into the claims array
let claims = [...localStorageService.getData()];

// If no claims are found, initialize an empty array
// if (!claims.length) {
//   // Create two default entries for empty array
//   claims = [
//     { claimNumber: "CLM001", Status: "Approved", dateSubmited: '09-05-2024' },
//     { claimNumber: "CLM002", Status: "Approved", dateSubmited: '08-05-2024' }
//   ];
// }

// Function to render recent claims table
function renderRecentClaimsTable() {
  const recentClaimsTableBody = document.querySelector('#recent-claims-tbody');
  recentClaimsTableBody.innerHTML = '';
  
  claims.slice(-5).forEach((claim) => {
    const row = recentClaimsTableBody.insertRow();
    const date = new Date(claim.incidentDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    row.innerHTML = `
      <td>${claim.claimNumber}</td>
      <td>${claim.Status}</td>
      <td>${formattedDate}</td>
    `;
  });
}

// Form submission event listener
document.querySelector('#claim-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form input values
  const policyNumber = document.querySelector('#policy-number').value;
  const incidentDate = document.querySelector('#incident-date').value;
  const incidentDescription = document.querySelector('#incident-description').value;

  // Form validation
  if (policyNumber === '' || incidentDate === '' || incidentDescription === '') {
    displayErrorMessage('All fields are required.');
  } else {
    // Create a new claim object
    const newClaim = {
      claimNumber: "CLM"+policyNumber,
      incidentDate: incidentDate,
      incidentDescription: incidentDescription,
      Status: 'Pending', // Initial status
    };

    // Add the new claim to the top of the array
    claims.unshift(newClaim);

    // Save the updated claims array to local storage
    localStorageService.saveData(claims);

    // Clear form fields
    document.querySelector('#claim-form').reset();

    // Display success message
    displaySuccessMessage('Claim submitted successfully.');

    // Render submitted claims in the table
    renderClaimsTable();

    // Render recent claims in the table
    renderRecentClaimsTable();
   
  }
});

// Function to display error message
function displayErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;

  document.querySelector('#claim-form').appendChild(errorDiv);

  // Remove error message after 3 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// Function to display success message
function displaySuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;

  document.querySelector('#claim-form').appendChild(successDiv);

  // Remove success message after 3 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Function to render submitted claims in the table
function renderClaimsTable() {
  const tableBody = document.querySelector('#track-claim-tbody');
  tableBody.innerHTML = '';

  claims.forEach((claim) => {
    const date = new Date(claim.incidentDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${claim.claimNumber}</td>
      <td>${claim.Status}</td>
      <td>${formattedDate}</td>
    `;
  });
}

// Knowledge base
// Preloaded articles
const articles = [
  { title: "What is third-party liability coverage?", content: "Third-party liability coverage protects you against claims for bodily injury or property damage caused to another party." },
  { title: "How does a deductible work?", content: "A deductible is the amount of money you must pay out of pocket before your insurance company pays for the covered loss." },
  { title: "What is comprehensive coverage?", content: "Comprehensive coverage helps pay to repair or replace your car if it's stolen or damaged by something other than a collision." },
  { title: "What is collision coverage?", content: "Collision coverage helps pay to repair or replace your car if it's damaged in a collision with another vehicle or object." },
  { title: "What is bodily injury liability coverage?", content: "Bodily injury liability coverage helps pay for the costs associated with injuries to the other party if you are at fault in an accident." },
{ title: "What is property damage liability coverage?", content: "Property damage liability coverage helps pay for the costs of damage to another person's property if you are at fault in an accident." }
];

// Function to filter articles based on user input
function filterArticles(query) {
  const filteredArticles = articles.filter(article => {
    return article.title.toLowerCase().includes(query.toLowerCase()) ||
           article.content.toLowerCase().includes(query.toLowerCase());
  });
  return filteredArticles;
}

// Function to render search results
function renderResults(results) {
  const searchResults = document.getElementById('searchResults');
  if (results.length > 0) {
    searchResults.innerHTML = results.map(article => {
      return `<div>
                <h3>${article.title}</h3>
                <p>${article.content}</p>
              </div>`;
    }).join('');
  } else {
    searchResults.innerHTML = '<p>No matching articles found.</p>';
  }
}

// Event listener for input change
document.getElementById('searchInput').addEventListener('input', function() {
  const query = this.value;
  const filteredResults = filterArticles(query);
  renderResults(filteredResults);
});

// Render recent claims table initially
renderRecentClaimsTable();
renderClaimsTable() 


// code to toggle between recent claim,claim form  ,knowledgebase serch bar,track claim 
// Add event listeners to the navigation links
document.querySelectorAll('.selection a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const sectionId = link.getAttribute('href').substring(1);
    console.log(`Link clicked: ${sectionId}`);
    showSection(sectionId);
  });
});

// Function to toggle between sections
function showSection(sectionId) {
  console.log(`Showing section: ${sectionId}`);
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => section.classList.add("hidden")); // Add "hidden" class to all sections
  document.getElementById(sectionId).classList.remove("hidden"); // Remove "hidden" class from the selected section
  renderRecentClaimsTable();
renderClaimsTable() 

}