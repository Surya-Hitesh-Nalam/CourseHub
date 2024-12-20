document.addEventListener('DOMContentLoaded', () => {
    const coursesContainer = document.getElementById('coursesContainer');
    const searchInput = document.getElementById('searchInput');
    const filterCategorySelect = document.getElementById('filterCategory');
    const filterPriceSelect = document.getElementById('filterSelect');
    const addCourseForm = document.getElementById('addCourseForm');
    
    // Load courses from localStorage or initialize as empty
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses = courses.map(course => ({
        ...course,
        prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites : [],
    }));

    // Save courses back to localStorage
    localStorage.setItem('courses', JSON.stringify(courses));

    // Handle course list display
    function displayCourses(coursesList) {
        coursesContainer.innerHTML = '';

        if (coursesList.length === 0) {
            coursesContainer.innerHTML = `<p class="text-gray-500 text-center col-span-3">No courses available.</p>`;
            return;
        }

        coursesList.forEach((course, index) => {
            const isRegistered = JSON.parse(localStorage.getItem('registeredCourses')) || {};
            const courseCard = document.createElement('div');
            courseCard.classList.add(
                'bg-white',
                'shadow-md',
                'rounded-md',
                'p-6',
                'hover:shadow-lg',
                'transition',
                'duration-300'
            );
            courseCard.innerHTML = `
                <h3 class="text-2xl font-bold text-blue-900 mb-2">${course.name}</h3>
                <p class="text-gray-700 mb-4">${course.description}</p>
                <p class="text-lg font-semibold text-green-600 mb-2">$${course.price}</p>
                <p class="text-sm text-gray-600 mb-2"><span class="font-medium">Category:</span> ${course.category}</p>
                <p class="text-sm text-gray-600"><span class="font-medium">Prerequisites:</span> ${
                    course.prerequisites.slice(0, 3).join(', ')
                }${course.prerequisites.length > 3 ? '...' : ''}</p>
                <button 
                    class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 register-btn ${isRegistered[course.name] ? 'hidden' : ''}" 
                    data-index="${index}">Register Now</button>
                <div class="registered-options ${isRegistered[course.name] ? '' : 'hidden'} flex gap-4 mt-4">
                    <button class="bg-gray-500 text-white px-4 py-2 rounded-md" disabled>Registered</button>
                    <button 
                        class="bg-green-500 text-white px-4 py-2 rounded-md view-btn" 
                        data-index="${index}">View Course</button>
                </div>
                <button class="bg-red-500 text-white px-4 py-2 rounded-md mt-4 delete-btn" data-index="${index}">Delete</button>
            `;
            coursesContainer.appendChild(courseCard);
        });

        attachEventListeners();
    }

    // Attach event listeners to buttons (Register, Delete, View)
    function attachEventListeners() {
        const registerButtons = document.querySelectorAll('.register-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const viewButtons = document.querySelectorAll('.view-btn');

        registerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                registerForCourse(index);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteCourse(index);
            });
        });

        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                viewCourse(index);
            });
        });
    }

    // Register a user for a course
    function registerForCourse(index) {
        const selectedCourse = courses[index];
        const registeredCourses = JSON.parse(localStorage.getItem('registeredCourses')) || {};
        registeredCourses[selectedCourse.name] = true;
        localStorage.setItem('registeredCourses', JSON.stringify(registeredCourses));
        alert(`You have successfully registered for ${selectedCourse.name}!`);
        displayCourses(courses);
    }

    // Delete a course
    function deleteCourse(index) {
        courses.splice(index, 1);
        localStorage.setItem('courses', JSON.stringify(courses));
        alert('Course deleted successfully!');
        displayCourses(courses);
    }

    // View a course (store it in localStorage and redirect)
    function viewCourse(index) {
        const selectedCourse = courses[index];
        localStorage.setItem('selectedCourse', JSON.stringify(selectedCourse));
        window.location.href = 'course-detail.html'; // Redirect to course details page
    }

    // Filter courses based on search, category, and price
    function filterCourses() {
        let filteredCourses = [...courses];
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterCategorySelect.value;
        const filterValue = filterPriceSelect.value;

        if (searchTerm) {
            filteredCourses = filteredCourses.filter(course =>
                course.name.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm) ||
                course.prerequisites.some(prereq =>
                    prereq.toLowerCase().includes(searchTerm)
                )
            );
        }

        if (selectedCategory) {
            filteredCourses = filteredCourses.filter(course => course.category === selectedCategory);
        }

        if (filterValue === 'low-to-high') {
            filteredCourses.sort((a, b) => a.price - b.price);
        } else if (filterValue === 'high-to-low') {
            filteredCourses.sort((a, b) => b.price - a.price);
        }

        displayCourses(filteredCourses);
    }

    // Add a new course
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const description = document.getElementById('description').value.trim();
            const price = parseFloat(document.getElementById('price').value.trim());
            const category = document.getElementById('category').value.trim();
            const prerequisites = document.getElementById('prerequisites').value.split(',').map(prereq => prereq.trim());

            if (!name || !description || isNaN(price) || !category || prerequisites.length === 0) {
                alert('Please fill all the fields.');
                return;
            }

            const newCourse = { name, description, price, category, prerequisites };
            courses.push(newCourse);
            localStorage.setItem('courses', JSON.stringify(courses));
            alert('Course added successfully!');
            addCourseForm.reset();
            displayCourses(courses);
        });
    }

    // Handle course details page rendering
    if (window.location.pathname.includes('course-detail.html')) {
        const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse'));

        if (selectedCourse) {
            document.getElementById('courseDetails').innerHTML = `
                <h1 class="text-3xl font-bold text-blue-900 mb-4">${selectedCourse.name}</h1>
                <p class="text-lg text-gray-700 mb-4">${selectedCourse.description}</p>
                <p class="text-2xl font-semibold text-green-600 mb-4">$${selectedCourse.price}</p>
                <p class="text-sm text-gray-600 mb-4">
                    <span class="font-medium">Category:</span> ${selectedCourse.category}
                </p>
                <p class="text-sm text-gray-600">
                    <span class="font-medium">Prerequisites:</span> ${selectedCourse.prerequisites.join(', ')}
                </p>
            `;
        } else {
            document.getElementById('courseDetails').innerHTML = `<p class="text-gray-500 text-center">Course not found.</p>`;
        }
    }

    // Initial rendering of course list
    if (!window.location.pathname.includes('course-detail.html')) {
        displayCourses(courses);
    }

    // Event listeners for search and filters
    if (searchInput && filterCategorySelect && filterPriceSelect) {
        searchInput.addEventListener('input', filterCourses);
        filterCategorySelect.addEventListener('change', filterCourses);
        filterPriceSelect.addEventListener('change', filterCourses);
    }
});
