document.addEventListener('DOMContentLoaded', () => {
    const coursesContainer = document.getElementById('coursesContainer');
    const searchInput = document.getElementById('searchInput');
    const filterCategorySelect = document.getElementById('filterCategory');
    const filterPriceSelect = document.getElementById('filterSelect');
    let courses = JSON.parse(localStorage.getItem('courses')) || [];

    courses = courses.map(course => ({
        ...course,
        prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites : [],
    }));
    localStorage.setItem('courses', JSON.stringify(courses));

    function displayCourses(coursesList) {
        coursesContainer.innerHTML = '';

        if (coursesList.length === 0) {
            coursesContainer.innerHTML = `<p class="text-gray-500 text-center col-span-3">No courses available.</p>`;
            return;
        }

        coursesList.forEach((course, index) => {
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
                <button class="bg-red-500 text-white px-4 py-2 rounded-md mt-4" data-index="${index}">Delete</button>
            `;
            coursesContainer.appendChild(courseCard);
        });

        const deleteButtons = document.querySelectorAll('button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                courses.splice(index, 1);
                localStorage.setItem('courses', JSON.stringify(courses));
                displayCourses(courses);
            });
        });
    }

    function filterCourses() {
        let filteredCourses = [...courses];

        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredCourses = filteredCourses.filter(course =>
                course.name.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm) ||
                course.prerequisites.some(prerequisite =>
                    prerequisite.toLowerCase().includes(searchTerm)
                )
            );
        }

        const selectedCategory = filterCategorySelect.value;
        if (selectedCategory) {
            filteredCourses = filteredCourses.filter(
                course => course.category === selectedCategory
            );
        }

        const filterValue = filterPriceSelect.value;
        if (filterValue === 'low-to-high') {
            filteredCourses.sort((a, b) => a.price - b.price);
        } else if (filterValue === 'high-to-low') {
            filteredCourses.sort((a, b) => b.price - a.price);
        }

        displayCourses(filteredCourses);
    }

    if (searchInput && filterCategorySelect && filterPriceSelect) {
        searchInput.addEventListener('input', filterCourses);
        filterCategorySelect.addEventListener('change', filterCourses);
        filterPriceSelect.addEventListener('change', filterCourses);
    }

    if (coursesContainer) {
        displayCourses(courses);
    }

    const addCourseForm = document.getElementById('addCourseForm');
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const description = document.getElementById('description').value.trim();
            const price = document.getElementById('price').value.trim();
            const category = document.getElementById('category').value.trim();
            const prerequisites = document
                .getElementById('prerequisites')
                .value.split(',')
                .map(prereq => prereq.trim());

            if (!name || !description || !price || !category || prerequisites.length === 0) {
                alert('Please fill all the fields.');
                return;
            }

            const newCourse = {
                name,
                description,
                price: parseFloat(price),
                category,
                prerequisites
            };

            courses.push(newCourse);
            localStorage.setItem('courses', JSON.stringify(courses));

            alert('Course added successfully!');
            addCourseForm.reset();
            window.location.href = 'courses.html';
        });
    }
});
