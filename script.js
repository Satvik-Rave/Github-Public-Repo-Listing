// const user="mojombo";
const user = "Satvik-Rave";
// const user="johnpapa";
// const user="milind-nair";
async function bioUpdate() {
    await fetch(`https://api.github.com/users/${user}`)
        .then((res) => { return res.json(); })
        .then(async (data) => {
            console.log(data);
            document.getElementById("name").innerHTML = data.name;
            document.getElementById("location").innerHTML = data.location;
            document.getElementById("link").innerHTML = data.html_url;
            document.getElementById("bio").innerHTML = data.bio;
            document.getElementById("iconimg").setAttribute("src", data.avatar_url);
        });
};
// bioUpdate();
async function apiCall() {
    await fetch(`https://api.github.com/users/${user}/repos`)
        .then((res) => { return res.json(); })
        .then(async (data) => {
            // console.log(data);
            for (let i = 0; i < data.length; i++) {
                var ele = data[i];
                // console.log(ele);
                var name = ele.name;
                var description = ele.description;
                var langsStr = await getStr(name);
                // console.log(langsStr);
                var update = `<div class="repos"><div class="repo"><h2>${name}</h2><div class="bio">${description}</div><div class="languages">${langsStr}</div></div></div>`;
                document.getElementById("c2").innerHTML += update;
            }
        });
};
// apiCall();

async function getStr(name) {
    var langsStr = "";
    await fetch(`https://api.github.com/repos/${user}/${name}/languages`)
        .then((res) => { return res.json(); })
        .then((data) => {
            langs = Object.keys(data);
            // console.log(langs.length);
            var num = 0;
            if (langs.length > 6) {
                num = 6;
            }
            else {
                num = langs.length;
            }
            // console.log(num);
            for (let j = 0; j < num; j++) {
                const element = langs[j];
                langsStr += `<div class="lang">${element}</div>`;
            }
        });
    // console.log(langsStr);
    return langsStr;
}

Promise.all([bioUpdate(), apiCall()]).then(() => {
    const pageNumbers = document.querySelector(".pageNumbers");
    const paginationList = document.getElementById("c2");
    const listItems = paginationList.querySelectorAll(".repos");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    const contentLimit = 10;
    const pageCount = Math.ceil(listItems.length / contentLimit);
    let currentPage = 1;

    console.log(listItems.length);

    const displayPageNumbers = (index) => {
        const pageNumber = document.createElement("a");
        pageNumber.innerText = index;
        pageNumber.setAttribute('href', "#");
        pageNumber.setAttribute("index", index);
        pageNumbers.appendChild(pageNumber);
    };

    const getPageNumbers = () => {
        for (let i = 1; i <= pageCount; i++) {
            displayPageNumbers(i);
        };
    };

    const disableButton = (button) => {
        button.classList.add("disabled");
        button.setAttribute("disabled", true);
    };

    const enableButton = (button) => {
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    };

    const controlButtonsStatus = () => {
        if (currentPage == 1) {
            disableButton(prevButton);
        }
        else {
            enableButton(prevButton);
        }
        if (pageCount == currentPage) {
            disableButton(nextButton);
        }
        else {
            enableButton(nextButton);
        }
    };

    const handleActivePageNumber = () => {
        document.querySelectorAll('a').forEach((button) => {
            button.classList.remove("active");
            const pageIndex = Number(button.getAttribute("index"));
            if (pageIndex == currentPage) {
                button.classList.add('active');
            }
        });
    };

    const setCurrentPage = (pageNum) => {
        currentPage = pageNum;

        handleActivePageNumber();
        controlButtonsStatus();

        const prevRange = (pageNum - 1) * contentLimit;
        const currRange = pageNum * contentLimit;

        listItems.forEach((item, index) => {
            item.classList.add('hidden');
            if (index >= prevRange && index < currRange) {
                item.classList.remove('hidden');
            }
        });
    };

    window.addEventListener('load', () => {
        getPageNumbers();
        setCurrentPage(1);

        prevButton.addEventListener('click', () => {
            setCurrentPage(currentPage - 1);
        });

        nextButton.addEventListener("click", () => {
            setCurrentPage(currentPage + 1);
        });

        document.querySelectorAll('a').forEach((button) => {
            const pageIndex = Number(button.getAttribute('index'));

            if (pageIndex) {
                button.addEventListener('click', () => {
                    setCurrentPage(pageIndex);
                });
            };
        });
    });
});
