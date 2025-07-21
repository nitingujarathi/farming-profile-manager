const addProfileBtn = document.getElementById("addProfileBtn");
const profilesTableBody = document.getElementById("profilesTableBody");
const nameInput = document.getElementById("nameInput");
const saveNameBtn = document.getElementById("saveNameBtn");
const welcomeMessage = document.getElementById("welcomeMessage");
const searchInput = document.getElementById("searchInput");

let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
let userName = localStorage.getItem("userName") || "";

if (userName) showWelcome(userName);
renderProfiles();

saveNameBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name) {
    userName = name;
    localStorage.setItem("userName", userName);
    showWelcome(userName);
  }
});

function showWelcome(name) {
  nameInput.style.display = "none";
  saveNameBtn.style.display = "none";
  welcomeMessage.innerHTML = `Welcome <span id="nameNeon">${name}</span> <span id="editNameBtn" style="cursor:pointer;"></span>`;



  const neon = document.getElementById("nameNeon");
  neon.style.textShadow = "0 0 10px #0ff, 0 0 20px #0ff";
  setTimeout(() => {
    neon.style.textShadow = "none";
  }, 2000);

  document.getElementById("editNameBtn").onclick = () => {
    nameInput.style.display = "inline-block";
    saveNameBtn.style.display = "inline-block";
    nameInput.value = userName;
    welcomeMessage.textContent = "";
  };
}

addProfileBtn.addEventListener("click", () => {
  if (profiles.length >= 100) {
    alert("Maximum 100 profiles.");
    return;
  }
  profiles.push({});
  saveProfiles();
  renderProfiles();
});

searchInput.addEventListener("input", renderProfiles);

function renderProfiles() {
  profilesTableBody.innerHTML = "";
  profiles.forEach((profile, idx) => {
    const query = searchInput.value.trim().toLowerCase();
    if (query && !Object.values(profile).some(val => (val || "").toLowerCase().includes(query))) {
      return;
    }

    const tr = document.createElement("tr");

    const noTd = document.createElement("td");
    noTd.textContent = idx + 1;
    tr.appendChild(noTd);

    ["chrome", "email", "twitter", "discord", "telegram", "wallet", "notes"].forEach(field => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "type here";
      input.value = profile[field] || "";

      // ✅ Adjust widths based on field
      if (field === "email") input.style.width = "220px";
      else if (field === "chrome") input.style.width = "80px";
      else if (field === "twitter") input.style.width = "120px";
      else if (field === "discord") input.style.width = "120px";
      else if (field === "telegram") input.style.width = "120px";
      else if (field === "wallet") input.style.width = "180px";
      else if (field === "notes") input.style.width = "220px";

      td.appendChild(input);
      tr.appendChild(td);
    });

    const saveTd = document.createElement("td");
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "✅";
    saveBtn.className = "save-btn";
    saveBtn.onclick = () => {
      const inputs = tr.querySelectorAll("input");
      const isEmpty = [...inputs].every(inp => !inp.value.trim());
      if (isEmpty) {
        alert("⚠️ Please fill at least one field before saving.");
        return;
      }
      ["chrome", "email", "twitter", "discord", "telegram", "wallet", "notes"].forEach((field, i) => {
        profile[field] = inputs[i].value.trim();
      });
      saveProfiles();
      alert("✅ Saved successfully!");
    };
    saveTd.appendChild(saveBtn);
    tr.appendChild(saveTd);

    const removeTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => {
      profiles.splice(idx, 1);
      saveProfiles();
      renderProfiles();
      alert("Removed successfully!");
    };
    removeTd.appendChild(removeBtn);
    tr.appendChild(removeTd);

    profilesTableBody.appendChild(tr);
  });
}


function saveProfiles() {
  localStorage.setItem("profiles", JSON.stringify(profiles));
}
