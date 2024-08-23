let pageNo = 1;
let isLoading = false;
let query = '';

function data(query = '', pageNo = 1) {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    fetch(`https://backend-prod.app.hiringmine.com/api/jobAds/all?limit=10&pageNo=${pageNo}&keyWord=${query}&category=`)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            const result = data.data;

            const jobShow = document.getElementById("jobShow");

            if (result.length === 0 && pageNo === 1) {
                jobShow.innerHTML = '<p>No matching jobs found</p>';
                return;
            }

            function timeElapsed(date) {
                const now = new Date();
                const updatedDate = new Date(date);
                const diffInMs = now - updatedDate;
                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

                if (diffInDays < 1) {
                    return "Today";
                } else if (diffInDays < 30) {
                    return `${diffInDays} days ago`;
                } else if (diffInDays < 365) {
                    const diffInMonths = Math.floor(diffInDays / 30);
                    return `${diffInMonths} months ago`;
                } else {
                    const diffInYears = Math.floor(diffInDays / 365);
                    return `${diffInYears} years ago`;
                }
            }

            result.forEach((value) => {
                let salaryText;
                if (value.payRangeStart === "" || value.payRangeEnd === "" || value.payRangeStart === null || value.payRangeEnd === null) {
                    salaryText = "No Salary Mentioned";
                } else {
                    salaryText = "RS" + value.payRangeStart + "-" + value.payRangeEnd;
                }

                let timeText = timeElapsed(value.updatedAt);

                jobShow.innerHTML += `<div class="col-12 col-sm-12 col-md-6 col-lg-6">
                    <div class="jobCard">
                        <div class="job">
                            <div class="jobDetail1">
                                <h5>${value.companyName ? value.companyName : "Anonymous"}</h5>
                                <span>${value.designation}</span>
                                <p class="color">${salaryText}</p>
                            </div>
                            <div class="jobImage">
                                <img src="./assest/icon.png" alt="">
                            </div>
                        </div>
                        <div class="jobMonth">
                            <div class="month">
                                <p>${timeText}</p>
                            </div>
                            <div class="view">
                                <p>${value.views} views</p>
                            </div>
                        </div>
                    </div>
                </div>`;
            });

            isLoading = false;
        })
        .catch(error => {
            loader.style.display = 'none'; 
            console.error('Error fetching data:', error);
            isLoading = false;
        });
}

document.getElementById('searchButton').addEventListener('click', () => {
    let query = document.getElementById('searchBox').value;
    document.getElementById('jobShow').innerHTML = ''; 
    pageNo = 1;
    data(query, pageNo);

});

window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !isLoading) {
        isLoading = true;
        pageNo++;
        data(query, pageNo);
    }
});

data(); 