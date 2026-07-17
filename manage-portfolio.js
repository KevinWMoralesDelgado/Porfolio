const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// Helper function to read a JSON file safely
function readJsonFile(fileName) {
    if (!fs.existsSync(fileName)) return [];
    try {
        const fileContent = fs.readFileSync(fileName, 'utf8');
        return JSON.parse(fileContent);
    } catch (e) {
        console.log(`⚠️ Error reading ${fileName}. Starting with an empty array.`);
        return [];
    }
}

// Helper function to save data to a JSON file safely
function saveJsonFile(fileName, data) {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');
}

// Main logic menu loop
async function main() {
    console.log("\n--- Advanced Portfolio Content Manager ---");
    console.log("1. Add a Skill");
    console.log("2. Add a Project");
    console.log("3. Delete a Skill");
    console.log("4. Delete a Project");
    
    const choice = await askQuestion("Choose an option (1-4): ");

    if (choice.trim() === "1") {
        // --- ADD A SKILL ---
        const skillName = await askQuestion("Enter the name of the skill (e.g., React, Python): ");
        if (!skillName.trim()) {
            console.log("❌ Skill name cannot be empty.");
            rl.close();
            return;
        }

        console.log("\nChoose Skill Category:");
        console.log("1. Frontend");
        console.log("2. Backend");
        const categoryChoice = await askQuestion("Select (1 or 2): ");
        
        let category = "Frontend";
        if (categoryChoice.trim() === "2") {
            category = "Backend";
        }

        // Read data and insert skill object formatted correctly
        let skills = readJsonFile('skills.json');
        skills.push({
            name: skillName.trim(),
            category: category
        });
        
        saveJsonFile('skills.json', skills);
        console.log(`✅ Successfully added ${skillName.trim()} to ${category}!`);

    } else if (choice.trim() === "2") {
        // --- ADD A PROJECT ---
        const projName = await askQuestion("Enter Project Title: ");
        const projDesc = await askQuestion("Enter Project Description: ");
        const projLink = await askQuestion("Enter Project URL Link: ");
        const projTags = await askQuestion("Enter technologies used, separated by commas (e.g., HTML, CSS, JavaScript): ");

        if (projName.trim() && projDesc.trim() && projLink.trim()) {
            // Split the tags text string by commas and clean up any loose spaces
            const tagsArray = projTags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            let projects = readJsonFile('projects.json');
            projects.push({
                title: projName.trim(),
                description: projDesc.trim(),
                link: projLink.trim(),
                tags: tagsArray
            });

            saveJsonFile('projects.json', projects);
            console.log("✅ Successfully saved your project with tags!");
        } else {
            console.log("❌ Project details cannot be empty.");
        }

    } else if (choice.trim() === "3") {
        // --- DELETE A SKILL ---
        let skills = readJsonFile('skills.json');
        if (skills.length === 0) {
            console.log("📂 No skills found to delete.");
            rl.close();
            return;
        }

        console.log("\n--- Current Skills List ---");
        skills.forEach((skill, index) => {
            console.log(`${index + 1}. [${skill.category}] ${skill.name}`);
        });

        const deleteIndexStr = await askQuestion("\nEnter the number of the skill you want to delete: ");
        const deleteIndex = parseInt(deleteIndexStr.trim()) - 1;

        if (deleteIndex >= 0 && deleteIndex < skills.length) {
            const removed = skills.splice(deleteIndex, 1);
            saveJsonFile('skills.json', skills);
            console.log(`❌ Successfully removed: ${removed[0].name}`);
        } else {
            console.log("❌ Invalid number option selection.");
        }

    } else if (choice.trim() === "4") {
        // --- DELETE A PROJECT ---
        let projects = readJsonFile('projects.json');
        if (projects.length === 0) {
            console.log("📂 No projects found to delete.");
            rl.close();
            return;
        }

        console.log("\n--- Current Projects List ---");
        projects.forEach((project, index) => {
            console.log(`${index + 1}. ${project.title}`);
        });

        const deleteIndexStr = await askQuestion("\nEnter the number of the project you want to delete: ");
        const deleteIndex = parseInt(deleteIndexStr.trim()) - 1;

        if (deleteIndex >= 0 && deleteIndex < projects.length) {
            const removed = projects.splice(deleteIndex, 1);
            saveJsonFile('projects.json', projects);
            console.log(`❌ Successfully removed: ${removed[0].title}`);
        } else {
            console.log("❌ Invalid number option selection.");
        }
    } else {
        console.log("❌ Invalid choice selection layout option.");
    }

    rl.close();
}

main();
