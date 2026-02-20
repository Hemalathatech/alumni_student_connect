/**
 * Alumni Dataset
 * 
 * This file contains 30 pre-seeded alumni records for the Alumni Directory.
 * These are SEPARATE from manually registered alumni (isRegistered: false).
 * 
 * Field mapping to User model:
 *   name          → split into firstName + lastName during seeding
 *   email         → email
 *   department    → department
 *   batch         → graduationYear
 *   company       → currentCompany
 *   jobTitle      → currentRole
 *   location      → location
 *   role          → role
 *   isRegistered  → isRegistered
 */

const alumniDataset = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        department: "Computer Science",
        batch: 2020,
        company: "Google",
        jobTitle: "Software Engineer",
        location: "Mountain View, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        department: "Electrical Engineering",
        batch: 2019,
        company: "Apple",
        jobTitle: "Hardware Engineer",
        location: "Cupertino, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Michael Johnson",
        email: "michael.j@example.com",
        department: "Mechanical Engineering",
        batch: 2018,
        company: "Tesla",
        jobTitle: "Mechanical Design Engineer",
        location: "Palo Alto, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        department: "Civil Engineering",
        batch: 2021,
        company: "Bechtel",
        jobTitle: "Civil Engineer",
        location: "San Francisco, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "David Wilson",
        email: "david.wilson@example.com",
        department: "Computer Science",
        batch: 2017,
        company: "Microsoft",
        jobTitle: "Product Manager",
        location: "Redmond, WA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        department: "Business Administration",
        batch: 2022,
        company: "Amazon",
        jobTitle: "Marketing Specialist",
        location: "Seattle, WA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Chris Martinez",
        email: "chris.martinez@example.com",
        department: "Information Technology",
        batch: 2020,
        company: "Oracle",
        jobTitle: "Database Administrator",
        location: "Austin, TX",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Amanda Garcia",
        email: "amanda.garcia@example.com",
        department: "Psychology",
        batch: 2019,
        company: "Kaiser Permanente",
        jobTitle: "Clinical Psychologist",
        location: "Oakland, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "James Rodriguez",
        email: "james.r@example.com",
        department: "Computer Science",
        batch: 2021,
        company: "Meta",
        jobTitle: "Data Scientist",
        location: "Menlo Park, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Robert Lee",
        email: "robert.lee@example.com",
        department: "Electrical Engineering",
        batch: 2018,
        company: "Intel",
        jobTitle: "Process Engineer",
        location: "Santa Clara, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Jennifer White",
        email: "jennifer.white@example.com",
        department: "Marketing",
        batch: 2020,
        company: "Salesforce",
        jobTitle: "Account Executive",
        location: "San Francisco, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "William Harris",
        email: "william.harris@example.com",
        department: "Finance",
        batch: 2017,
        company: "Goldman Sachs",
        jobTitle: "Investment Banker",
        location: "New York, NY",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Linda Clark",
        email: "linda.clark@example.com",
        department: "Computer Science",
        batch: 2022,
        company: "Netflix",
        jobTitle: "UI Engineer",
        location: "Los Gatos, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Richard Lewis",
        email: "richard.lewis@example.com",
        department: "Mechanical Engineering",
        batch: 2019,
        company: "Boeing",
        jobTitle: "Aerospace Engineer",
        location: "Seattle, WA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Susan Walker",
        email: "susan.walker@example.com",
        department: "Education",
        batch: 2018,
        company: "Stanford University",
        jobTitle: "Professor",
        location: "Stanford, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Joseph Hall",
        email: "joseph.hall@example.com",
        department: "Computer Science",
        batch: 2021,
        company: "Adobe",
        jobTitle: "Software Developer",
        location: "San Jose, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Jessica Allen",
        email: "jessica.allen@example.com",
        department: "Biomedical Engineering",
        batch: 2020,
        company: "Genentech",
        jobTitle: "Research Associate",
        location: "South San Francisco, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Thomas Young",
        email: "thomas.young@example.com",
        department: "Physics",
        batch: 2017,
        company: "NASA",
        jobTitle: "Physicist",
        location: "Houston, TX",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Karen King",
        email: "karen.king@example.com",
        department: "Law",
        batch: 2019,
        company: "Latham & Watkins",
        jobTitle: "Attorney",
        location: "Los Angeles, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Charles Wright",
        email: "charles.wright@example.com",
        department: "Architecture",
        batch: 2018,
        company: "Gensler",
        jobTitle: "Architect",
        location: "San Francisco, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Patricia Scott",
        email: "patricia.scott@example.com",
        department: "Nursing",
        batch: 2021,
        company: "UCSF Health",
        jobTitle: "Registered Nurse",
        location: "San Francisco, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Daniel Torres",
        email: "daniel.torres@example.com",
        department: "Computer Science",
        batch: 2022,
        company: "Uber",
        jobTitle: "Mobile Engineer",
        location: "San Francisco, CA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Barbara Nguyen",
        email: "barbara.nguyen@example.com",
        department: "Chemistry",
        batch: 2020,
        company: "Pfizer",
        jobTitle: "Chemist",
        location: "New York, NY",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Matthew Hill",
        email: "matthew.hill@example.com",
        department: "History",
        batch: 2017,
        company: "Museum of Modern Art",
        jobTitle: "Curator",
        location: "New York, NY",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Lisa Flores",
        email: "lisa.flores@example.com",
        department: "Sociology",
        batch: 2019,
        company: "Nonprofit Org",
        jobTitle: "Program Coordinator",
        location: "Chicago, IL",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Anthony Green",
        email: "anthony.green@example.com",
        department: "Political Science",
        batch: 2018,
        company: "Government",
        jobTitle: "Policy Analyst",
        location: "Washington, D.C.",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Nancy Adams",
        email: "nancy.adams@example.com",
        department: "Environmental Science",
        batch: 2021,
        company: "EPA",
        jobTitle: "Environmental Scientist",
        location: "Denver, CO",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Mark Baker",
        email: "mark.baker@example.com",
        department: "Mathematics",
        batch: 2020,
        company: "Hedge Fund",
        jobTitle: "Quantitative Analyst",
        location: "New York, NY",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Sandra Gonzalez",
        email: "sandra.gonzalez@example.com",
        department: "Journalism",
        batch: 2019,
        company: "CNN",
        jobTitle: "Journalist",
        location: "Atlanta, GA",
        role: "alumni",
        isRegistered: false
    },
    {
        name: "Steven Nelson",
        email: "steven.nelson@example.com",
        department: "Graphic Design",
        batch: 2022,
        company: "Design Studio",
        jobTitle: "Graphic Designer",
        location: "Portland, OR",
        role: "alumni",
        isRegistered: false
    }
];

module.exports = alumniDataset;
