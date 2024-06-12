function parseMappings(mappings) {
  return mappings.map(mapping => ({
    short: `/${mapping.short}`,
    full: mapping.full
  }));
}

async function fetchMappings() {
  const response = await fetch('/mappings');
  const data = await response.json();
  const parsedData = parseMappings(data.mappings);
  const mappingList = document.getElementById('mappingList');
  mappingList.innerHTML = '';
  parsedData.forEach(mapping => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.innerText = `${mapping.short} → ${mapping.full}`;
    a.href = mapping.full;
    a.target = "_blank"; // Open link in a new tab
    li.appendChild(a);
    mappingList.appendChild(li);
  });
}

document.getElementById('shortenForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = document.getElementById('url').value;
  const response = await fetch('/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });
  const data = await response.json();
  if (response.ok) {
    document.getElementById('result').innerText = `Short URL: /${data.shortURL}`;
    fetchMappings(); // Refresh the mappings list
  } else {
    document.getElementById('result').innerText = `Error: ${data.error || 'An unknown error occurred.'}`;
  }
});

// Fetch mappings on page load
fetchMappings();
